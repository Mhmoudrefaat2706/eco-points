import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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


  private translate = inject(TranslateService);
  private router = inject(Router);
  
  counter = 0;
  isDarkMode = false;
  currentLanguage = 'en';
  mobileMenuActive = false;

  constructor(private sharedMaterials: SharedMatarialsService) {}

  ngOnInit(): void {
    this.loadPreferences();
    this.setupCartSubscription();
  }

  private loadPreferences(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.setLanguage(savedLang);
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    this.updateBodyDarkMode();
  }

  private setupCartSubscription(): void {
    this.sharedMaterials.cartCount$.subscribe(count => {
      this.counter = count;
    });
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
    const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  private setLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleMobileMenu(): void {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  closeMobileMenu(): void {
    this.mobileMenuActive = false;
  }

  isProfileActive(): boolean {
    return this.router.url.includes('/b-profile');
  }
}
