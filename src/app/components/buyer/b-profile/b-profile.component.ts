import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { ToastrService } from 'ngx-toastr';

// Define the User interface with all required properties
interface User {
  name?: string;
  email: string;
  role: string;
  gender?: string;
  location?: string;
  address?: string;
  paypal_client_id?: string; // Add this
  paypal_client_secret?: string; // Add this
}

@Component({
  selector: 'app-b-profile',
  imports: [CommonModule, FormsModule, BNavbarComponent, BFooterComponent],
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
    paypal_client_id: '', // Add this
    paypal_client_secret: '', // Add this
  };

  isEditing = false;
  currentDate = new Date();

  isSaving = false; // Add this loading state

  constructor(
    private authService: AuthService,
    private toastr: ToastrService // Add this
  ) {}

  // Update the ngOnInit subscription:
  ngOnInit(): void {
    this.authService.getUserData();
    this.authService.userProfile$.subscribe((data) => {
      if (data) {
        this.userData = {
          name: data.first_name + ' ' + data.last_name,
          email: data.email,
          role: data.role,
          gender: data.gender ?? 'Male',
          location: data.city,
          address: data.address ?? '',
          paypal_client_id: data.paypal_client_id ?? '', // Add this
          paypal_client_secret: data.paypal_client_secret ?? '', // Add this
        };
      }
    });
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.isSaving = true; // Start loading
    const updatedData = {
      first_name: this.userData.name?.split(' ')[0] || '',
      last_name: this.userData.name?.split(' ')[1] || '',
      address: this.userData.address || '',
      city: this.userData.location?.split(',')[0]?.trim() || '',
      state: '',
      postal_code: '',
      country: this.userData.location?.split(',')[1]?.trim() || '',
      paypal_client_id: this.userData.paypal_client_id ?? '', // Add this
      paypal_client_secret: this.userData.paypal_client_secret ?? '', // Add this
    };

    console.log('Sending payload:', updatedData);

    this.authService.updateProfile(updatedData).subscribe({
      next: (res) => {
        console.log('✅ Profile updated:', res);
        this.isEditing = false;
        this.toastr.success('Profile updated successfully!', 'Success');
      },
      error: (err) => {
        console.error('❌ Failed to update profile:', err);
        let errorMessage = 'Failed to update profile';
        if (err.error?.errors) {
          errorMessage = Object.values(err.error.errors).join('\n');
        }
        this.toastr.error(errorMessage, 'Error');
      },
      complete: () => {
        this.isSaving = false; // End loading
      },
    });
  }
}
