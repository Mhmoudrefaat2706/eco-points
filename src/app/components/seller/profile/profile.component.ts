import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';

// Define the User interface
export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  role: string;
  gender?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string | null;
  postal_code?: string;
  phone?: string | null;
  is_active?: boolean | number;
  points_balance?: string;
  paypal_client_id?: string | null;
  paypal_client_secret?: string | null;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userData: User = {
    name: '',
    email: '',
    role: '',
    location: '',
    gender: 'Male',
    address: '',
    paypal_client_id: '',
    paypal_client_secret: '',
  };

  isEditing = false;
  isSaving = false;
  currentDate = new Date();
  @Input() isDarkMode = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.authService.getUserData();
    this.authService.userProfile$.subscribe((data) => {
      if (data) {
        this.userData = {
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          role: data.role,
          gender: data.gender ?? 'Male',
          location: data.city,
          address: data.address ?? '',
          paypal_client_id: data.paypal_client_id ?? '',
          paypal_client_secret: data.paypal_client_secret ?? '',
        };
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.isSaving = true;

    const updatedData = {
      first_name: this.userData.name?.split(' ')[0] || '',
      last_name: this.userData.name?.split(' ')[1] || '',
      address: this.userData.address || '',
      city: this.userData.location?.split(',')[0]?.trim() || '',
      state: '',
      postal_code: '',
      country: this.userData.location?.split(',')[1]?.trim() || '',
      paypal_client_id: this.userData.paypal_client_id ?? '',
      paypal_client_secret: this.userData.paypal_client_secret ?? '',
    };

    this.authService.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.toastr.success('Profile updated successfully!', 'Success');
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Profile update error:', err);
        const errorMessage = this.getErrorMessage(err);
        this.toastr.error(errorMessage, 'Update Failed');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.errors) {
      return Object.values(error.error.errors).join('\n');
    }
    return 'An unexpected error occurred. Please try again.';
  }
}
