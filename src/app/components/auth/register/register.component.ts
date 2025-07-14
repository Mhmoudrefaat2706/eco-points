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

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  };

  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  registerForm = this.formBuilder.group({
    first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    last_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const data = this.registerForm.value as User;


    this.authService
      .register(
        this.user.firstName,
        this.user.lastName,
        this.user.email,
        this.user.password,
        this.user.role
      )
      .subscribe({
        next: (response) => {
          this.successMessage = 'Registration successful! You can now login.';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Registration failed. Try again.';
          this.successMessage = '';
        },
      });
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

  sendRegisterData(data: User) {
    this.authService.register(data).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = 'User registered successfully.';
        this.errorMessage = '';

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

  }
}
