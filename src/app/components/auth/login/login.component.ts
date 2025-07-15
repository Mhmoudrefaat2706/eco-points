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
import { AuthService, loginUser, User } from '../../../services/auth.service';

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

  private router = inject(Router); 
  private authService = inject(AuthService);
  private _FormBuilder = inject(FormBuilder);

  loginForm = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.sendLoginData(this.loginForm.value);
    } else {
      console.log('not valid');
      this.loginForm.markAllAsTouched();
    }
  }

//  sendLoginData(data: object) {
//   this.authService.login(data).subscribe({
//     next: (res) => {
//       console.log(res);

//       const role = res.user.role;
//       if (role === 'seller') {
//         this.router.navigate(['/home']);
//       } else if (role === 'buyer') {
//         this.router.navigate(['/buyer-home']);
//       }
//     },
//     error: (err) => {
//       console.log(err);
//       this.errorMessage = err.error.message || 'Login failed';
//     },
//   });
// }

sendLoginData(data: object) {
  this.authService.login(data).subscribe({
    next: (res) => {
      console.log(res);

      // ✅ حفظ التوكن في localStorage
      if (res.access_token) {
        localStorage.setItem('token', res.access_token);
      }

      // ✅ حفظ بيانات المستخدم
      if (res.user) {
        localStorage.setItem('loggedInUser', JSON.stringify(res.user));
      }

      // ✅ التوجيه حسب الدور
      const role = res.user.role;
      if (role === 'seller') {
        this.router.navigate(['/home']);
      } else if (role === 'buyer') {
        this.router.navigate(['/buyer-home']);
      }
    },
    error: (err) => {
      console.log(err);
      this.errorMessage = err.error.message || 'Login failed';
    },
  });
}



  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
  }
}
