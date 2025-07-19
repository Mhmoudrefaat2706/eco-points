import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  adminName: string = 'Admin';
  adminInitials: string = 'A';
  isMobile = false;
  mobileMenuExpanded = false;
  private resizeListener: () => void;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.resizeListener = this.onResize.bind(this);
  }

  ngOnInit() {
    const user = this.authService.getLoggedInUser();
    if (user && user.name) {
      this.adminName = user.name;
      this.adminInitials = this.getInitials(user.name);
    }
    this.checkIfMobile();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuExpanded = !this.mobileMenuExpanded;
  }

  closeMobileMenu() {
    this.mobileMenuExpanded = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
      this.mobileMenuExpanded = false;
    }
  }

  private onResize() {
    this.checkIfMobile();
  }
}