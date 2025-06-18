import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';

import { NavbarComponent } from '../navbar/navbar.component';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-materials',

  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css',
})
export class MaterialsComponent {

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 8;
  filteredMaterials: any[] = [];
  isLoading = false;
  errorMessage = '';
  searchQuery = '';
  selectedCategory = 'All'; // Default to show all categories

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
      this.categories = [
        'All',
        ...new Set(this.materialsList.map(material => material.category))
      ];
      this.updateFilteredMaterials();
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Failed to load materials.';
      this.isLoading = false;
      console.error('Error loading materials:', error);
    }
  }

  // Update the filtered materials based on current page, search query, and category
  updateFilteredMaterials() {
    // Filter materials based on search query and category

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

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredMaterials = filtered.slice(startIndex, endIndex);
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

}
