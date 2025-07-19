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
import { AuthService } from '../../../services/auth.service';

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
  isLoading = false;
  roles = ['buyer', 'seller']; // Removed admin from public registration

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  registerForm = this.formBuilder.group({
    first_name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ],
    last_name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;

      this.authService
        .register(
          formData.first_name!,
          formData.last_name!,
          formData.email!,
          formData.password!,
          formData.role! as 'seller' | 'buyer'
        )
        .subscribe({
          next: (response) => {
            this.successMessage = 'Registration successful! You can now login.';
            this.errorMessage = '';
            this.isLoading = false;
            setTimeout(() => this.router.navigate(['/login']), 2000);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || 'Registration failed. Try again.';
            this.successMessage = '';
            this.isLoading = false;
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  scrollToRegister() {
    const element = document.getElementById('registerForm');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  scrollToWhyJoin() {
    const element = document.getElementById('whyJoin');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
