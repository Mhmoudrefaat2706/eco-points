import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';

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
export class HomeComponent {
  @ViewChild('materialsCarousel') carousel!: ElementRef;
  featuredMaterials: any[] = [];

  constructor(private materialsService: MaterialsService) {}

  ngOnInit() {
    this.loadFeaturedMaterials();
  }

  ngAfterViewInit() {
    // Initialize carousel if not auto-initialized
    if (typeof window !== 'undefined' && (window as any).bootstrap) {
      new (window as any).bootstrap.Carousel(this.carousel.nativeElement, {
        interval: 3500,
      });
    }
  }

  loadFeaturedMaterials() {
    const allMaterials = this.materialsService.getAllMaterials();
    this.featuredMaterials = [...allMaterials]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }
}
