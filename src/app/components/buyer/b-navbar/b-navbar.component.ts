import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';

@Component({
  selector: 'app-b-navbar',
  imports: [CommonModule, RouterModule, TranslateModule],
  standalone: true,
  templateUrl: './b-navbar.component.html',
  styleUrl: './b-navbar.component.css',
})
export class BNavbarComponent implements OnInit {
  constructor(private sharedMatrials: SharedMatarialsService) {}
  counter: number = 0;

  private translate = inject(TranslateService);
  isDarkMode = false;
  currentLanguage = 'en';
  mobileMenuActive = false;

  ngOnInit() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.translate.use(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

      this.sharedMatrials.cartCount$.subscribe((count) => {
        this.counter = count;
      });
    }

    // Load dark mode state
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
    document.documentElement.dir =
      this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  closeMobileMenu() {
    this.mobileMenuActive = false;
  }
}
