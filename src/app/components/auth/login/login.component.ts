import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  rememberMe = false;
  errorMessage = '';
  successMessage = '';
  logoutMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['loggedOut']) {
        this.logoutMessage = 'تم تسجيل الخروج بنجاح.';
        this.errorMessage = '';
        this.successMessage = '';
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.successMessage = '';
      this.logoutMessage = '';
      return;
    }

    this.isLoading = true;
    this.authService.login(
      this.credentials.email,
      this.credentials.password
    ).subscribe({
      next: () => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        this.logoutMessage = '';
        this.isLoading = false;

        const role = this.authService.getUserRole();
        if (role === 'seller') {
          this.router.navigate(['/home']);
        } else if (role === 'buyer') {
          this.router.navigate(['/buyer-home']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Invalid email or password.';
        this.successMessage = '';
        this.logoutMessage = '';
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
  }
}