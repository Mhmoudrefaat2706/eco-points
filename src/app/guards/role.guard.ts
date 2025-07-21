import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] || route.data['role'];
    const user = this.authService.getLoggedInUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Handle single role or array of roles
    if (Array.isArray(expectedRoles)) {
      if (expectedRoles.includes(user.role)) {
        return true;
      }
    } else if (user.role === expectedRoles) {
      return true;
    }

    // Redirect to appropriate home based on role or to login
    if (user.role === 'buyer') {
      this.router.navigate(['/buyer-home']);
    } else if (user.role === 'seller') {
      this.router.navigate(['/home']);
    } else if (user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}