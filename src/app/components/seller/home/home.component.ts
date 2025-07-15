import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { Category, Material } from '../../../models/material.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    FooterComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('materialsCarousel') carousel!: ElementRef;
  featuredMaterials: Material[] = [];
  isLoadingMaterials = true;

  constructor(private materialsService: MaterialsService) {}

  ngOnInit() {
    this.loadFeaturedMaterials();
  }

  ngAfterViewInit() {
    this.initializeCarousel();
  }

  loadFeaturedMaterials() {
    this.materialsService.getLatestMaterials().subscribe({
      next: (materials: Material[]) => {
        this.featuredMaterials = materials;
        this.isLoadingMaterials = false; // Add this line
        setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (error) => {
        console.error('Error loading latest materials:', error);
        this.isLoadingMaterials = false; // Add this line
      },
    });
  }

  initializeCarousel() {
    if (
      typeof window !== 'undefined' &&
      (window as any).bootstrap &&
      this.carousel?.nativeElement
    ) {
      new (window as any).bootstrap.Carousel(this.carousel.nativeElement, {
        interval: 3500,
        wrap: true,
      });
    }
  }

  getGroupedMaterials(): Material[][] {
    const groups = [];
    for (let i = 0; i < this.featuredMaterials.length; i += 3) {
      groups.push(this.featuredMaterials.slice(i, i + 3));
    }
    return groups;
  }
getImageUrl(image: string | undefined): string {
  if (!image) return 'assets/images/placeholder.png'; // صورة افتراضية
  return `http://localhost:8000/materials/${image}`;
}

  getCategoryName(category: string | Category): string | null {
    if (!category) return null;
    return typeof category === 'string' ? category : category.name;
  }
}
