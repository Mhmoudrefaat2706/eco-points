import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';


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
  private authService = inject(AuthService);
  
  counter = 0;
  isDarkMode = false;
  currentLanguage = 'en';
  mobileMenuActive = false;
  activeRoute = '';
  userName = '';
  userRole = '';
  currentUser: any;

  constructor(
      private cartService: CartService,
  ) {}


  getUserAvatar(): string {
    if (this.currentUser?.avatar) {
      return this.currentUser.avatar;
    }
    const name = this.currentUser?.name || this.currentUser?.email.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3a8ffe&color=fff`;
  }

  
  ngOnInit(): void {
    this.loadPreferences();
    this.setupCartSubscription();
    this.cartService.loadCartCount(); 
    this.setActiveRoute();
    this.loadUserData();
    this.router.events.subscribe(() => this.setActiveRoute());
  }

  private loadUserData(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      //this.userName = user.name;
      this.userName = user.first_name + ' ' + user.last_name; 
      this.userRole = user.role === 'buyer' ? 'Buyer' : 'Seller';
    }
  }

  private setActiveRoute(): void {
    this.activeRoute = this.router.url.split('/')[1] || 'home';
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
  this.cartService.cartCount$.subscribe(count => {
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

  isRouteActive(route: string): boolean {
    return this.activeRoute === route;
  }

  goToProfile(): void {
    this.router.navigate(['/b-profile']);
    this.closeMobileMenu();
  }















  // private translate = inject(TranslateService);
  // private router = inject(Router);
  
  // counter = 0;
  // isDarkMode = false;
  // currentLanguage = 'en';
  // mobileMenuActive = false;
  // activeRoute = '';

  // constructor(private sharedMaterials: SharedMatarialsService) {}
  
  // ngOnInit(): void {
  //   this.loadPreferences();
  //   this.setupCartSubscription();
  //   this.setActiveRoute();
  //   this.router.events.subscribe(() => this.setActiveRoute());
  // }

  // private setActiveRoute(): void {
  //   this.activeRoute = this.router.url.split('/')[1] || 'home';
  // }

  // private loadPreferences(): void {
  //   const savedLang = localStorage.getItem('language');
  //   if (savedLang) {
  //     this.setLanguage(savedLang);
  //   }

  //   const savedDarkMode = localStorage.getItem('darkMode');
  //   this.isDarkMode = savedDarkMode === 'true';
  //   this.updateBodyDarkMode();
  // }

  // private setupCartSubscription(): void {
  //   this.sharedMaterials.cartCount$.subscribe(count => {
  //     this.counter = count;
  //   });
  // }

  // toggleTheme(): void {
  //   this.isDarkMode = !this.isDarkMode;
  //   this.updateBodyDarkMode();
  //   localStorage.setItem('darkMode', this.isDarkMode.toString());
  // }

  // private updateBodyDarkMode(): void {
  //   document.body.classList.toggle('dark-mode', this.isDarkMode);
  // }

  // changeLanguage(): void {
  //   const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
  //   this.setLanguage(newLang);
  // }

  // private setLanguage(lang: string): void {
  //   this.currentLanguage = lang;
  //   this.translate.use(lang);
  //   localStorage.setItem('language', lang);
  //   document.documentElement.lang = lang;
  //   document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  // }

  // toggleMobileMenu(): void {
  //   this.mobileMenuActive = !this.mobileMenuActive;
  // }

  // closeMobileMenu(): void {
  //   this.mobileMenuActive = false;
  // }

  // isRouteActive(route: string): boolean {
  //   return this.activeRoute === route;
  // }

  // goToProfile(): void {
  //   this.router.navigate(['/b-profile']);
  //   this.closeMobileMenu();
  // }
}
