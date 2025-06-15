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

  private authService = inject(AuthService); // ⬅️ Inject AuthService
  private router = inject(Router);           // ⬅️ Inject Router

  isDarkMode = false;
  currentLanguage = 'en';
  mobileMenuActive = false;
  loggedIn = false;
  ngOnInit() {

    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.translate.use(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

      
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    this.updateBodyDarkMode();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.updateBodyDarkMode();
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  private updateBodyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  changeLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLanguage);
    localStorage.setItem('language', this.currentLanguage);
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  closeMobileMenu() {
    this.mobileMenuActive = false;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

}
