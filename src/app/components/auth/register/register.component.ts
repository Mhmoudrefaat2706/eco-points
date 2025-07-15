import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  registerForm = this.formBuilder.group({
    first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    last_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const data = this.registerForm.value as User;

      // تحقق إضافي على الدور
      if (!['buyer', 'seller'].includes(data.role)) {
        this.errorMessage = 'Please select a valid role (buyer or seller).';
        return;
      }

      this.sendRegisterData(data);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  sendRegisterData(data: User) {
    this.authService.register(data).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = 'User registered successfully.';
        this.errorMessage = '';

        // Redirect after short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error("err", err);
        if (err.status === 422 && err.error.errors) {
          const errors = err.error.errors;
          this.errorMessage = Object.values(errors).flat().join(' ');
        } else {
          this.errorMessage = err.error.message || 'Something went wrong!';
        }
      },
    });
  }
}