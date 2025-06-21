import { Component, inject } from '@angular/core';
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
  // Pagination variables
  currentPage = 1;
  itemsPerPage = 8;
  filteredMaterials: any[] = [];
  isLoading = false;
  errorMessage = '';
  searchQuery = '';
  selectedCategory = 'All'; // Default to show all categories
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceFilterActive = false;

  // Unique categories for the filter dropdown
  categories: string[] = ['All'];

  materialsList: any[] = [];

  constructor(private materialsService: MaterialsService) {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.materialsList = this.materialsService.getAllMaterials();
      // Use service's getCategories() instead of extracting from materials
      this.categories = ['All', ...this.materialsService.getCategories()];
      this.updateFilteredMaterials();
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Failed to load materials.';
      this.isLoading = false;
      console.error('Error loading materials:', error);
    }
  }

  // Update updateFilteredMaterials
  updateFilteredMaterials() {
    const filtered = this.materialsList.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        material.category
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        material.category === this.selectedCategory;

      const matchesPrice =
        !this.priceFilterActive ||
        ((this.minPrice === null || material.price >= this.minPrice) &&
          (this.maxPrice === null || material.price <= this.maxPrice));

      return matchesSearch && matchesCategory && matchesPrice;
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredMaterials = filtered.slice(startIndex, endIndex);
  }

  // Add this method
  applyPriceFilter() {
    this.priceFilterActive = true;
    this.currentPage = 1;
    this.updateFilteredMaterials();
  }

  // Add this method
  clearPriceFilter() {
    this.minPrice = null;
    this.maxPrice = null;
    this.priceFilterActive = false;
    this.currentPage = 1;
    this.updateFilteredMaterials();
  }

  // Handle search input changes
  onSearchChange() {
    this.currentPage = 1; // Reset to first page when search changes
    this.updateFilteredMaterials();
  }

  // Handle category selection changes
  onCategoryChange() {
    this.currentPage = 1; // Reset to first page when category changes
    this.updateFilteredMaterials();
  }

  // Change page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredMaterials();
    }
  }

  // Get total pages based on filtered results
  get totalPages(): number {
    const filtered = this.materialsList.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        material.category
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        material.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  // Generate page numbers for pagination controls rubber
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  get topMaterials() {
    return this.filteredMaterials.slice(0, 4);
  }
}
