import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service'; // تأكدي إنك مستوردة السيرفيس
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

// Define the User interface
interface User {
  name?: string;
  email: string;
  role: string;
  gender?: string;
  location?: string;
  address?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
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
  @Input() isDarkMode = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.profileService.getUserProfile().subscribe({
      next: (response) => {
        this.userData = {
          name:
            response.name ||
            response.first_name + ' ' + response.last_name ||
            response.email.split('@')[0],
          email: response.email,
          role: this.capitalizeFirstLetter(response.role),
          gender: response.gender || 'Male',
          location:
            response.city && response.country
              ? `${response.city}, ${response.country}`
              : 'Cairo, Egypt',
          address: response.address || '',
        };
      },
      error: (err) => {
        console.error('❌ خطأ في تحميل بيانات المستخدم:', err);
      },
    });
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    console.log('✅ saveProfile() function triggered');

    const updatedData = {
      first_name: this.userData.name?.split(' ')[0] || '',
      last_name: this.userData.name?.split(' ')[1] || '',
      address: this.userData.address || '',
      city: this.userData.location?.split(',')[0]?.trim() || '',
      state: 'Cairo',
      postal_code: '12345',
      country: this.userData.location?.split(',')[1]?.trim() || '',
    };

    this.authService.updateProfile(updatedData).subscribe({
      next: (res) => {
        console.log('✅ Profile updated:', res);
        this.isEditing = false;
        alert('✅ Profile updated successfully!');
      },
      error: (err) => {
        console.error('❌ Failed to update profile:', err);
        alert('❌ Failed to update profile.');
      },
    });
  }
}
