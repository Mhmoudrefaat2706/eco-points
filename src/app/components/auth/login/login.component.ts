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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockedUserModalComponent } from '../blocked-user-modal/blocked-user-modal.component';

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
  private modalService = inject(NgbModal);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('loggedOut') === 'true') {
      this.logoutMessage = 'You have been logged out successfully.';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.successMessage = 'Login successful!';
          this.isLoading = false;

          const role = this.authService.getUserRole();
          switch (role) {
            case 'seller':
              this.router.navigate(['/home']);
              break;
            case 'buyer':
              this.router.navigate(['/buyer-home']);
              break;
            case 'admin':
              this.router.navigate(['/admin/dashboard']);
              break;
            default:
              this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          if (error.message.includes('blocked')) {
            this.showBlockedModal();
          } else {
            this.errorMessage =
              error.error?.message || 'Invalid email or password.';
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private showBlockedModal() {
    const modalRef = this.modalService.open(BlockedUserModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.message = 'Your account is currently blocked.';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
  }
}
