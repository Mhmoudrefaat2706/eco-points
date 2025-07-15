import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MaterialDetailsModalComponent } from '../material-details-modal/material-details-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { MaterialsService } from '../../../services/materials.service';
import { Material } from '../../../models/material.model';
import { firstValueFrom, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface CategoryOption {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @ViewChild('addEditForm') addEditForm!: ElementRef;

  categories$: Observable<CategoryOption[]> = of([]);
  selectedCategoryId: number | null = null;

  showAddForm = false;
  isEditing = false;
  currentMaterialId: number | null = null;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading = false;

  // Filtering and pagination
  searchTerm = '';
  selectedCategory = '';
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  totalItems = 0;
  Math = Math;

  loadingMaterials = false;

  materialForm = {
    name: '',
    category_id: null as number | null,
    image: '' as string | File,
    desc: '',
    price: 0,
    price_unit: 'piece' as 'piece' | 'kg' | 'm²' | 'm³',
  };

  priceUnits = ['piece', 'kg', 'm²', 'm³'];
  allMaterials: Material[] = [];

  constructor(
    private modalService: NgbModal,
    private materialsService: MaterialsService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadingMaterials = true;
    this.loadMaterials();
    this.categories$ = this.getUniqueCategories();
  }

  loadMaterials() {
    this.loadingMaterials = true;
    this.materialsService
      .getMyMaterials(
        this.currentPage,
        this.searchTerm || undefined,
        this.selectedCategory || undefined
      )
      .pipe(delay(300))
      .subscribe({
        next: (response) => {
          this.allMaterials = response.data.map((material: any) => ({
            id: material.id,
            name: material.name,
            category: material.category?.name || material.category,
            category_id: material.category_id ||
              (material.category?.id ? material.category.id : null),
            image_url: material.image_url,
            description: material.description,
            price: material.price,
            price_unit: material.price_unit,
          }));

          this.totalItems = response.total;
          this.totalPages = response.last_page;
          this.currentPage = response.current_page;
          this.loadingMaterials = false;
        },
        error: (error) => {
          console.error('Error loading materials:', error);
          this.loadingMaterials = false;
          this.showNotificationMessage('Failed to load materials', 'error');
        },
      });
  }

  getUniqueCategories(): Observable<CategoryOption[]> {
    return this.materialsService.getCategories().pipe(
      map((categories: Category[]) => {
        const apiCategories = categories.map((c) => ({
          id: c.id,
          name: c.name,
        }));

        const materialCategories = this.allMaterials
          .map((m) => {
            if (typeof m.category === 'string') {
              return {
                id: m.category_id || 0,
                name: m.category,
              };
            } else if (m.category && 'id' in m.category && 'name' in m.category) {
              return {
                id: m.category.id,
                name: m.category.name,
              };
            }
            return {
              id: m.category_id || 0,
              name: 'Unknown',
            };
          })
          .filter((cat) => cat.id && cat.name);

        const uniqueCategories = [
          ...apiCategories,
          ...materialCategories,
        ].filter(
          (cat, index, self) => index === self.findIndex((c) => c.id === cat.id)
        );

        return uniqueCategories;
      })
    );
  }

  selectCategory(categoryName: string) {
    this.isLoading = true;
    this.getCategoryId(categoryName).subscribe({
      next: (id) => {
        this.materialForm.category_id = id;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting category ID:', err);
        this.isLoading = false;
      },
    });
  }

  getCategoryId(categoryName: string): Observable<number | null> {
    return this.materialsService.getCategories().pipe(
      map((categories: Category[]) => {
        const category = categories.find((c) => c.name === categoryName);
        if (!category) {
          console.error('Category not found:', categoryName);
        }
        return category ? category.id : null;
      })
    );
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadMaterials();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadMaterials();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.isEditing = false;
    this.resetForm();
  }

  resetForm() {
    this.materialForm = {
      name: '',
      category_id: null,
      image: '',
      desc: '',
      price: 0,
      price_unit: 'piece',
    };
    this.currentMaterialId = null;
  }

  addMaterial() {
    if (!this.isFormValid()) return;

    if (this.materialForm.category_id === null) {
      this.showNotificationMessage('Please select a valid category', 'error');
      return;
    }

    this.isLoading = true;

    // Handle image upload
    if (this.materialForm.image instanceof File) {
      const formData = new FormData();
      formData.append('image', this.materialForm.image);

      this.materialsService.uploadImage(formData).subscribe({
        next: (res: any) => {
          this.createMaterial(res.filename);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.showNotificationMessage('Failed to upload image', 'error');
        }
      });
    } else {
      this.createMaterial(this.materialForm.image || null);
    }
  }

  getImageUrl(image: string | File | undefined): string {
    if (!image) return 'assets/images/placeholder.png';

    if (typeof image === 'string') {
      return `http://localhost:8000/materials/${image}`;
    }

    return URL.createObjectURL(image);
  }

  private createMaterial(imageUrl: string | null) {
    const materialData = {
      name: this.materialForm.name,
      category_id: this.materialForm.category_id,
      description: this.materialForm.desc,
      price: this.materialForm.price,
      price_unit: this.materialForm.price_unit,
      image_url: imageUrl,
    };

    this.materialsService.addMaterial(materialData).subscribe({
      next: (response) => {
        this.showNotificationMessage(
          response.message || 'Material added successfully!',
          'success'
        );
        this.resetForm();
        this.showAddForm = false;
        this.loadMaterials();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding material:', error);
        const errorMessage = error.error?.message || 'Failed to add material';
        this.showNotificationMessage(errorMessage, 'error');
        this.isLoading = false;
      },
    });
  }

  get uploadedFileName(): string {
    return this.materialForm.image instanceof File
      ? this.materialForm.image.name
      : '';
  }

  editMaterial(material: Material) {
    this.isEditing = true;
    this.showAddForm = true;
    this.currentMaterialId = material.id;

    const categoryName =
      typeof material.category === 'string'
        ? material.category
        : material.category?.name || '';

    if (material.category_id) {
      this.materialForm = {
        name: material.name,
        category_id: material.category_id,
        image: material.image_url,
        desc: material.description,
        price: material.price || 0,
        price_unit: material.price_unit,
      };
    } else {
      this.getCategoryId(categoryName).subscribe((categoryId) => {
        this.materialForm = {
          name: material.name,
          category_id: categoryId,
          image: material.image_url,
          desc: material.description,
          price: material.price || 0,
          price_unit: material.price_unit,
        };
      });
    }

    setTimeout(() => {
      this.addEditForm.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  updateMaterial() {
    if (!this.currentMaterialId) return;

    this.materialsService
      .updateMaterial(this.currentMaterialId, {
        name: this.materialForm.name,
        category_id: this.materialForm.category_id,
        description: this.materialForm.desc,
        price: this.materialForm.price,
        price_unit: this.materialForm.price_unit,
        image_url: typeof this.materialForm.image === 'string'
          ? this.materialForm.image
          : ''
      })
      .subscribe({
        next: (response) => {
          this.showNotificationMessage(
            response.message || 'Material updated successfully!',
            'success'
          );
          this.resetForm();
          this.showAddForm = false;
          this.loadMaterials();
        },
        error: (error) => {
          console.error('Error updating material:', error);
          const errorMessage =
            error.error?.message || 'Failed to update material';
          this.showNotificationMessage(errorMessage, 'error');
        },
      });
  }

  isFormValid(): boolean {
    return (
      this.materialForm.name.trim() !== '' &&
      this.materialForm.category_id !== null &&
      this.materialForm.desc.trim() !== '' &&
      this.materialForm.price >= 0 &&
      this.materialForm.price_unit.trim() !== ''
    );
  }

  deleteMaterial(id: number) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.material = this.allMaterials.find(
      (m) => m.id === id
    );

    modalRef.result
      .then((result) => {
        if (result) {
          this.materialsService.deleteMaterial(id).subscribe({
            next: (response) => {
              this.showNotificationMessage(
                response.message || 'Material deleted successfully!',
                'success'
              );
              this.loadMaterials();
            },
            error: (error) => {
              console.error('Error deleting material:', error);
              const errorMessage =
                error.error?.message || 'Failed to delete material';
              this.showNotificationMessage(errorMessage, 'error');
            },
          });
        }
      })
      .catch(() => {});
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (this.materialForm.image instanceof File) {
      URL.revokeObjectURL(img.src);
    }
  }

  async handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.match(/image\/(jpeg|png|jpg|gif|webp)/)) {
      this.showNotificationMessage('Only image files allowed', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.showNotificationMessage('Image must be less than 2MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res: any = await firstValueFrom(
        this.materialsService.uploadImage(formData)
      );

      this.materialForm.image = res.filename;
      this.showNotificationMessage('Image uploaded successfully', 'success');
    } catch (err) {
      console.error(err);
      this.showNotificationMessage('Failed to upload image', 'error');
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMaterials();
    }
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.loadMaterials();
  }

  viewDetails(material: Material) {
    const modalRef = this.modalService.open(MaterialDetailsModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.material = material;
  }

  openImageModal(imageUrl: string) {
    const modalRef = this.modalService.open(ImageModalComponent);
    modalRef.componentInstance.imageUrl = imageUrl;
  }

  private showNotificationMessage(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  get filteredMaterials(): Material[] {
    return this.allMaterials;
  }

  get paginatedMaterials(): Material[] {
    return this.allMaterials;
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }
}
