
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-buyer-home',
  imports: [CommonModule, TranslateModule, BFooterComponent, BNavbarComponent, RouterModule],
  templateUrl: './buyer-home.component.html',
  styleUrls: ['./buyer-home.component.css'],
})
export class BuyerHomeComponent {

  translate = inject(TranslateService);
  
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  featuredMaterials: any[] = [];
  currentSlide = 0;
  autoSlideInterval: any;
  slidesToShow = 3;
  slideWidth = 0;
  totalSlides = 0;
  isRTL = false;

  constructor(
    private materialsService: MaterialsService,
    private cartMaterials: SharedMatarialsService
  ) {}

ngOnInit(): void {
  this.translate.onLangChange.subscribe((event) => {
    this.isRTL = event.lang === 'ar'; // Assuming 'ar' is your Arabic language code
    this.updateSlideDirection();
  });
  
  this.featuredMaterials = this.materialsService.getAllMaterials().slice(0, 6);
  this.totalSlides = Math.ceil(this.featuredMaterials.length / this.slidesToShow);
}

updateSlideDirection(): void {
  if (this.carouselTrack?.nativeElement) {
    this.carouselTrack.nativeElement.style.direction = this.isRTL ? 'rtl' : 'ltr';
    this.goToSlide(this.currentSlide); // Reset position after direction change
  }
}

  ngAfterViewInit(): void {
    this.updateSlideWidth();
    this.startAutoSlide();
    window.addEventListener('resize', this.updateSlideWidth.bind(this));
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.updateSlideWidth.bind(this));
  }

  updateSlidesToShow(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.slidesToShow = 1;
    } else if (width < 992) {
      this.slidesToShow = 2;
    } else {
      this.slidesToShow = 3;
    }
    this.goToSlide(this.currentSlide);
  }

  addToCart(material: any): void {
    this.cartMaterials.addToCart(material);
    // Optional: Show a toast notification
  }

  truncateText(text: string, length: number): string {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  updateSlideWidth(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.slidesToShow = 1;
    } else if (width < 992) {
      this.slidesToShow = 2;
    } else {
      this.slidesToShow = 3;
    }
    
    if (this.carouselTrack?.nativeElement?.children[0]) {
      this.slideWidth = this.carouselTrack.nativeElement.children[0].offsetWidth;
    }
    
    this.totalSlides = Math.ceil(this.featuredMaterials.length / this.slidesToShow);
    this.goToSlide(this.currentSlide);
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

goToSlide(index: number): void {
  if (!this.carouselTrack?.nativeElement) return;
  
  const track = this.carouselTrack.nativeElement;
  const gap = 16; // 1rem gap
  let offset = -(index * (this.slideWidth + gap) * this.slidesToShow);
  
  // Adjust for RTL direction
  if (this.isRTL) {
    offset = -offset;
  }
  
  track.style.transition = 'transform 1s ease-in-out';
  track.style.transform = `translateX(${offset}px)`;
  this.currentSlide = index;
}

  nextSlide(): void {
    if (this.currentSlide >= this.totalSlides - 1) {
      this.currentSlide = 0;
    } else {
      this.currentSlide++;
    }
    this.goToSlide(this.currentSlide);
  }

  prevSlide(): void {
    if (this.currentSlide <= 0) {
      this.currentSlide = this.totalSlides - 1;
    } else {
      this.currentSlide--;
    }
    this.goToSlide(this.currentSlide);
  }
}
