import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MaterialsService } from '../../../services/materials.service';
import { Material } from '../../../models/material.model';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-materials',
  standalone: true,
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
export class MaterialsComponent implements OnInit {
  // Pagination variables
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  totalItems = 0;

  materialsList: Material[] = [];
  isLoading = false;
  errorMessage = '';
  searchQuery = '';
  selectedCategory = 'All';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceFilterActive = false;
  priceFilterApplied = false;
  priceFilterError = '';

  // Unique categories for the filter dropdown
  categories: string[] = ['All'];

  constructor(private materialsService: MaterialsService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMaterials();
  }

  // Update the loadCategories() method
  loadCategories(): void {
    this.materialsService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = ['All', ...categories.map((c) => c.name)];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback to default categories if API fails
        this.categories = ['All', ...this.materialsService.categories];
      },
    });
  }

  // Update the loadMaterials method
  loadMaterials(): void {
    // Temporary fallback for testing
    if (!this.materialsService) {
      console.error('MaterialsService not injected!');
      this.materialsList = [
        {
          id: 1,
          name: 'Test Material',
          category: 'Concrete',
          image_url: 'https://via.placeholder.com/300',
          description: 'Test description',
          price: 99.99,
          price_unit: 'kg',
        },
      ];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Loading materials with params:', {
      page: this.currentPage,
      search: this.searchQuery,
      category: this.selectedCategory,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });

    this.materialsService
      .getAllMaterials(
        this.currentPage,
        this.searchQuery || undefined,
        this.selectedCategory !== 'All' ? this.selectedCategory : undefined,
        this.priceFilterApplied ? this.minPrice ?? undefined : undefined,
        this.priceFilterApplied ? this.maxPrice ?? undefined : undefined
      )
      .subscribe({
        next: (response) => {
          console.log('API Response:', response); // Fixed typo here

          if (response?.data?.length) {
            this.materialsList = response.data.map((material) => {
              const categoryName =
                typeof material.category === 'string'
                  ? material.category
                  : material.category?.name ?? 'Uncategorized';

              return {
                id: material.id ?? 0,
                name: material.name ?? 'Unnamed Material',
                category: categoryName,
                image_url:
                  material.image_url || './assets/default-material.jpg',
                description: material.description || 'No description available',
                price: material.price ?? 0,
                price_unit: material.price_unit || 'piece',
              };
            });

            this.totalItems = response.total ?? 0;
            this.totalPages = response.last_page ?? 1;
            this.currentPage = response.current_page ?? 1;
          } else {
            console.warn('Empty or invalid API response');
            this.materialsList = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load materials.';
          this.isLoading = false;
          console.error('Error loading materials:', error);
        },
      });
  }

  get filteredMaterials(): Material[] {
    if (!this.priceFilterApplied) {
      return this.materialsList;
    }

    return this.materialsList.filter((material) => {
      return (
        (this.minPrice === null || material.price >= this.minPrice) &&
        (this.maxPrice === null || material.price <= this.maxPrice)
      );
    });
  }

  // Handle search input changes
  onSearchChange(): void {
    this.currentPage = 1;
    this.loadMaterials();
  }

  // Handle category selection changes
  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadMaterials();
  }

  // Change page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMaterials();
    }
  }

  // Generate page numbers for pagination controls
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Scroll to materials section
  scrollToMaterials(): void {
    const element = document.getElementById('materialsSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Clear all filters
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.minPrice = null;
    this.maxPrice = null;
    this.priceFilterActive = false;
    this.priceFilterApplied = false;
    this.priceFilterError = '';
    this.currentPage = 1;
    this.loadMaterials();
  }

  // Truncate text for display
  truncateText(text: string, length: number = 60): string {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  // Apply price filter
  applyPriceFilter(): void {
    // Validate inputs
    if (
      this.minPrice !== null &&
      this.maxPrice !== null &&
      this.minPrice > this.maxPrice
    ) {
      this.priceFilterError =
        'Minimum price cannot be greater than maximum price';
      return;
    }

    this.priceFilterError = '';
    this.priceFilterActive = true;
    this.priceFilterApplied = true;
    this.currentPage = 1;
    this.loadMaterials();
  }

  // Clear price filter
  clearPriceFilter(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.priceFilterActive = false;
    this.priceFilterApplied = false;
    this.priceFilterError = '';
    this.currentPage = 1;
    this.loadMaterials();
  }

  // Get material details (for navigation or modal)
  viewMaterialDetails(materialId: number): void {
    this.materialsService.getMaterialById(materialId).subscribe({
      next: (material) => {
        if (material) {
          // Handle material details view
          console.log('Material details:', material);
          // You can implement navigation to detail page or open modal here
        }
      },
      error: (error) => {
        console.error('Error fetching material details:', error);
      },
    });
  }
}
