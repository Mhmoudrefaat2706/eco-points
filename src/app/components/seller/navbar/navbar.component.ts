import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router'; // ⬅️ Router
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service'; // ⬅️ AuthService


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: any;
  isDarkMode = false;
  currentLanguage = 'en';
  mobileMenuActive = false;

  ngOnInit(): void {
    this.loadUserData();
    this.loadLanguagePreference();
    this.loadThemePreference();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getLoggedInUser();
  }

  private loadLanguagePreference(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.translate.use(savedLang);
      this.setDocumentLanguage(savedLang);
    }
  }

  private loadThemePreference(): void {
    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    this.updateBodyDarkMode();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateBodyDarkMode();
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  private updateBodyDarkMode(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  changeLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLanguage);
    localStorage.setItem('language', this.currentLanguage);
    this.setDocumentLanguage(this.currentLanguage);
  }

  private setDocumentLanguage(lang: string): void {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleMobileMenu(): void {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  closeMobileMenu(): void {
    this.mobileMenuActive = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserAvatar(): string {
    if (this.currentUser?.avatar) {
      return this.currentUser.avatar;
    }
    const name = this.currentUser?.name || this.currentUser?.email.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3a8ffe&color=fff`;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeMobileMenu();
  }

  isProfileActive(): boolean {
    return this.router.url.includes('/profile');
  }
}
