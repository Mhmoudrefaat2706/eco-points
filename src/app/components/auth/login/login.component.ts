import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { email: '', password: '', role: '' }; // ضفت role هنا
  rememberMe = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

onSubmit() {
  const role = this.credentials.role.toLowerCase(); // تحويل للدور إلى أحرف صغيرة

  const success = this.authService.login(
    this.credentials.email,
    this.credentials.password,
    role
  );

  if (success) {
    this.successMessage = 'Login successful!';
    this.errorMessage = '';

    if (role === 'seller') {
      this.router.navigate(['/home']);
    } else if (role === 'buyer') {
      this.router.navigate(['/buyer-home']);
    } else {
      this.router.navigate(['/login']);
    }
  } else {
    this.errorMessage = 'Invalid email, password, or role.';
    this.successMessage = '';
  }
}

}
