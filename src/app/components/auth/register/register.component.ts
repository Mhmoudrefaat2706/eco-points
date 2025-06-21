import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', confirmPassword: '', role: '' };
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.successMessage = '';
      return;
    }

    const success = this.authService.register(
      this.user.name,
      this.user.email,
      this.user.password,
      this.user.role
    );

    if (success) {
      this.successMessage = 'Registration successful! You can now login.';
      this.errorMessage = '';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.errorMessage = 'Registration failed. Try again.';
      this.successMessage = '';
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
        behavior: 'smooth'
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
        behavior: 'smooth'
      });
    }
  }
}