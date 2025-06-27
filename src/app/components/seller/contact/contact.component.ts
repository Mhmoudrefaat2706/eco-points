import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  isDarkMode = false;
  contactForm: FormGroup;

  @ViewChild('contactInfo', { static: false }) contactInfo!: ElementRef;
  @ViewChild('contactFormElement', { static: false })
  contactFormElement!: ElementRef;

  // Location coordinates - can be replaced with your actual location coordinates
  mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1026.9098075937954!2d31.152603349109356!3d29.009568717423523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a25e6d62da0d3%3A0x2697971af768c6d5!2sCreativa%20IHUB-Bani%20Suef!5e0!3m2!1sar!2seg!4v1749462965731!5m2!1sar!2seg';

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    // Load dark mode state from localStorage if it exists
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      this.isDarkMode = savedMode === 'true';
      this.toggleDarkModeClasses(this.isDarkMode);
    }
  }

  // Function to convert map URL to a safe resource URL
  get safeMapUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.mapUrl);
  }

  // Function to toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.toggleDarkModeClasses(this.isDarkMode);
  }

  // Apply dark mode changes
  private toggleDarkModeClasses(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Here you can send the data to the server
      alert(this.translate.instant('CONTACT.SUCCESS_MESSAGE'));
      this.contactForm.reset();
    }
  }

  // Function to get translated error message
  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.hasError('required')) {
      return this.translate.instant('FORM.REQUIRED');
    }
    if (control?.hasError('email')) {
      return this.translate.instant('FORM.INVALID_EMAIL');
    }
    return '';
  }
}
