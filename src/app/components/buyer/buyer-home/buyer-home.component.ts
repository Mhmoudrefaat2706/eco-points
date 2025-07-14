import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { RouterModule } from '@angular/router';
import { Material } from '../../../models/material.model';

@Component({
  selector: 'app-buyer-home',
  imports: [
    CommonModule,
    TranslateModule,
    BFooterComponent,
    BNavbarComponent,
    RouterModule,
  ],
  templateUrl: './buyer-home.component.html',
  styleUrls: ['./buyer-home.component.css'],
})
export class BuyerHomeComponent {
  private carouselInitialized = false;
  isLoadingMaterials = true;
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
      this.isRTL = event.lang === 'ar';
      this.updateSlideDirection();
    });

    this.materialsService.getLatestMaterials().subscribe({
      next: (materials: Material[]) => {
        this.featuredMaterials = materials;
        this.isLoadingMaterials = false; // Add this line
        this.totalSlides = Math.ceil(
          this.featuredMaterials.length / this.slidesToShow
        );
      },
      error: (error) => {
        console.error('Error loading latest materials:', error);
        this.isLoadingMaterials = false; // Add this line
      },
    });
  }

  ngAfterViewInit(): void {
    this.updateSlideWidth();
    this.startAutoSlide();
    window.addEventListener('resize', this.updateSlideWidth.bind(this));
    this.carouselInitialized = true;
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

    // Calculate slide width properly
    if (this.carouselTrack?.nativeElement?.children[0]) {
      const track = this.carouselTrack.nativeElement;
      const slide = track.children[0];
      const style = window.getComputedStyle(slide);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      this.slideWidth = slide.offsetWidth + marginLeft + marginRight;
    }

    this.totalSlides = Math.ceil(
      this.featuredMaterials.length / this.slidesToShow
    );

    // Only go to slide if carousel is initialized
    if (this.carouselInitialized) {
      this.goToSlide(this.currentSlide);
    }
  }

  goToSlide(index: number): void {
    if (
      !this.carouselTrack?.nativeElement ||
      this.featuredMaterials.length === 0
    )
      return;

    // Ensure index is within bounds
    if (index >= this.totalSlides) {
      index = 0;
    } else if (index < 0) {
      index = this.totalSlides - 1;
    }

    const track = this.carouselTrack.nativeElement;
    const gap = 16; // 1rem gap (match your CSS)
    let offset = index * (this.slideWidth * this.slidesToShow + gap);

    // Adjust for RTL direction
    if (this.isRTL) {
      offset = -offset;
    }

    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(${offset}px)`;
    this.currentSlide = index;
  }

  updateSlideDirection(): void {
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.direction = this.isRTL
        ? 'rtl'
        : 'ltr';
      this.goToSlide(this.currentSlide); // Reset position after direction change
    }
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
