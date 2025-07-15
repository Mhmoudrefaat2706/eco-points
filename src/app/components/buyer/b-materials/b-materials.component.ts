import { Component } from '@angular/core';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { MaterialsService } from '../../../services/materials.service';
import { Material } from '../../../models/material.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-b-materials',
  imports: [
    BFooterComponent,
    BNavbarComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './b-materials.component.html',
  styleUrl: './b-materials.component.css',
})
export class BMaterialsComponent {
  currentPage = 1;
  itemsPerPage = 6;
  allMaterials: Material[] = [];
  filteredMaterials: Material[] = [];
  isLoading = false;
  errorMessage = '';
  searchQuery = '';
  selectedCategory = 'All';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceFilterActive = false;
  priceFilterApplied = false;
  priceFilterError = '';
  categories: string[] = ['All'];

  cartMaterialIds: number[] = []; 

  constructor(
    private cartMatrials: SharedMatarialsService,
    private materialsService: MaterialsService,
    private snackBar: MatSnackBar,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    this.loadCartMaterialIds(); 
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.allMaterials = this.materialsService.getAllMaterials();
      this.categories = [
        'All',
        ...new Set(this.allMaterials.map((material) => material.category)),
      ];
      this.updateFilteredMaterials();
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Failed to load materials.';
      this.isLoading = false;
      console.error('Error loading materials:', error);
    }
  }

  loadCartMaterialIds(): void {
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartMaterialIds = res.map((item: any) => item.material.id); // ✅ حفظ الـ IDs
      },
      error: (err) => {
        console.error('Failed to load cart items', err);
      },
    });
  }

  scrollToMaterials() {
    const element = document.getElementById('materialsSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.minPrice = null;
    this.maxPrice = null;
    this.priceFilterActive = false;
    this.priceFilterApplied = false;
    this.priceFilterError = '';
    this.currentPage = 1;
    this.updateFilteredMaterials();
  }

  truncateText(text: string, length: number = 60): string {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  applyPriceFilter() {
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
    this.updateFilteredMaterials();
  }

  clearPriceFilter() {
    this.minPrice = null;
    this.maxPrice = null;
    this.priceFilterActive = false;
    this.priceFilterApplied = false;
    this.priceFilterError = '';
    this.currentPage = 1;
    this.updateFilteredMaterials();
  }

  updateFilteredMaterials() {
    const filtered = this.allMaterials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        material.category
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        material.category === this.selectedCategory;

      const matchesPrice =
        !this.priceFilterApplied ||
        ((this.minPrice === null ||
          (material.price && material.price >= this.minPrice)) &&
          (this.maxPrice === null ||
            (material.price && material.price <= this.maxPrice)));

      return matchesSearch && matchesCategory && matchesPrice;
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredMaterials = filtered.slice(startIndex, endIndex);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.updateFilteredMaterials();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.updateFilteredMaterials();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredMaterials();
    }
  }

  get totalPages(): number {
    const filtered = this.allMaterials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        material.category
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        material.category === this.selectedCategory;

      const matchesPrice =
        !this.priceFilterApplied ||
        ((this.minPrice === null ||
          (material.price && material.price >= this.minPrice)) &&
          (this.maxPrice === null ||
            (material.price && material.price <= this.maxPrice)));

      return matchesSearch && matchesCategory && matchesPrice;
    });
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

addToCart(material: Material) {
  console.log('material_id sent to backend:', material.id);
  this.cartService.addToCart(material.id).subscribe({
    next: (res) => {
      this.cartMaterialIds.push(material.id);

      // ✅ أعد تحميل العدد من السيرفر بعد الإضافة
      this.cartService.loadCartCount();

      this.showSnackbar(`${material.name} added to cart`, 'success-snackbar');
    },
    error: (err) => {
      console.error('Add to cart failed', err);
      this.showSnackbar('Error adding to cart', 'error-snackbar');
    },
  });
}


  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    });
  }

  isInCart(materialId: number): boolean {
    return this.cartMaterialIds.includes(materialId);
  }
}
