import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { CreateUser } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  user: CreateUser = {
    first_name: '',
    last_name: '',
    email: '',
    role: 'buyer',
    password: '',
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isSuccess = false;

  constructor(private adminService: AdminService, public router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.isSuccess = false;

    this.adminService.createUser(this.user).subscribe({
      next: () => {
        this.isSuccess = true;
        this.successMessage = 'User created successfully!';
        this.isLoading = false;
        this.resetForm(); // Reset form but keep it visible
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create user';
        this.isLoading = false;
        console.error('Error creating user:', error);
      },
    });
  }

  private resetForm(): void {
    this.user = {
      first_name: '',
      last_name: '',
      email: '',
      role: 'buyer',
      password: '',
    };
  }
}