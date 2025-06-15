import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '', role: '' };
  rememberMe = false;
  errorMessage = '';
  successMessage = '';
  logoutMessage = '';

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

    const role = this.credentials.role.toLowerCase();

    const success = this.authService.login(
      this.credentials.email,
      this.credentials.password,
      role
    );

    if (success) {
      this.successMessage = 'Login successful!';
      this.errorMessage = '';
      this.logoutMessage = '';

      if (role === 'seller') {
        this.router.navigate(['/home']);
      } else if (role === 'buyer') {
        this.router.navigate(['/buyer-home']);
      }
    } else {
      this.errorMessage = 'Invalid email, password, or role.';
      this.successMessage = '';
      this.logoutMessage = '';
    }
  }

  logout() {
    this.authService.logout();
    // توجيه مع باراميتر يفيد بتسجيل الخروج
    this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
  }
}
