import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage = '';
  successMessage = '';
  logoutMessage = '';
  isLoading = false;

  private router = inject(Router); 
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    // Check for logout query parameter
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('loggedOut') === 'true') {
      this.logoutMessage = 'You have been logged out successfully.';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const { email, password } = this.loginForm.value;
      
      this.authService.login(email!, password!).subscribe({

      const credentials = this.loginForm.value;
      
      this.authService.login(
        credentials.email!,
        credentials.password!
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
    } else {

      console.log('Form not valid');

      this.loginForm.markAllAsTouched();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
  }
}