import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';

// Define the User interface with all required properties
interface User {
  name?: string;
  email: string;
  role: string;
  gender?: string;
  location?: string;
  address?: string;
}

@Component({
  selector: 'app-b-profile',
  imports: [CommonModule, FormsModule, BNavbarComponent],
  templateUrl: './b-profile.component.html',
  styleUrl: './b-profile.component.css',
})
export class BProfileComponent implements OnInit {
  userData: User = {
    name: 'User',
    email: '',
    role: '',
    location: 'Cairo, Egypt',
    gender: 'Male',
    address: '',
  };

  isEditing = false;
  currentDate = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.authService.getProfile().subscribe({
      next: (response: any) => {
        this.userData = {
          name:
            response.name ||
            response.first_name + ' ' + response.last_name ||
            response.email.split('@')[0],
          email: response.email,
          role: this.capitalizeFirstLetter(response.role),
          gender: response.gender || 'Male',
          location: response.location || 'Cairo, Egypt',
          address: response.address || '',
        };
      },
      error: (err) => {
        console.error('خطأ في تحميل بيانات المستخدم:', err);
      },
    });
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    const updatedData = {
      first_name: this.userData.name?.split(' ')[0] || '',
      last_name: this.userData.name?.split(' ')[1] || '',
      address: this.userData.address || '',
      city: this.userData.location?.split(',')[0]?.trim() || '',
      state: '',
      postal_code: '',
      country: this.userData.location?.split(',')[1]?.trim() || '',
    };

    console.log('Sending payload:', updatedData);

    this.authService.updateProfile(updatedData).subscribe({
      next: (res) => {
        console.log('✅ Profile updated:', res);
        this.isEditing = false;
        alert('✅ Profile updated successfully!');
      },
      error: (err) => {
        console.error('❌ Failed to update profile:', err);
        if (err.error && err.error.errors) {
          console.error('Validation errors:', err.error.errors);
        }
        alert('❌ Failed to update profile.');
      },
    });
  }
}
