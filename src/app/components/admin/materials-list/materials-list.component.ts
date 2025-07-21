import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Category, Material } from '../../../models/material.model';
import { MaterialsService } from '../../../services/materials.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-materials-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.css'],
})
export class MaterialsListComponent implements OnInit {
  materials: Material[] = [];
  categories: Category[] = [];
  statuses: ('active' | 'blocked' | 'pending')[] = [
    'active',
    'blocked',
    'pending',
  ];
  selectedCategory: string = '';
  selectedStatus: string = '';
  searchTerm: string = '';
  isLoading = false;
  errorMessage = '';
  selectedMaterialId: number | null = null;
  statusLoading: { [key: number]: boolean } = {};

  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  constructor(
    private adminService: AdminService,
    private materialsService: MaterialsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    this.loadCategories();
  }

  // Update the loadMaterials method
  loadMaterials(): void {
    this.isLoading = true;
    this.adminService.getMaterials().subscribe({
      next: (materials: Material[]) => {
        this.materials = materials.map((material) => {
          // Create a properly typed material object
          const mappedMaterial: Material = {
            ...material,
            status: material.status || 'active',
            category:
              typeof material.category === 'string'
                ? { id: 0, name: material.category }
                : material.category,
            seller: material.seller
              ? {
                  ...material.seller,
                  name:
                    material.seller.first_name && material.seller.last_name
                      ? `${material.seller.first_name} ${material.seller.last_name}`
                      : material.seller.name || 'N/A',
                }
              : undefined, // Use undefined instead of null
          };
          return mappedMaterial;
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load materials';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  // Update the updateMaterialStatus method
  updateMaterialStatus(
    materialId: number,
    newStatus: 'active' | 'blocked' | 'pending'
  ): void {
    this.statusLoading[materialId] = true;

    this.adminService.updateMaterialStatus(materialId, newStatus).subscribe({
      next: () => {
        const material = this.materials.find((m) => m.id === materialId);
        if (material) {
          material.status = newStatus;
        }
        this.statusLoading[materialId] = false;
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.statusLoading[materialId] = false;
      },
    });
  }

  loadCategories(): void {
    this.materialsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  openDeleteModal(materialId: number): void {
    this.selectedMaterialId = materialId;
    this.modalService.open(this.deleteModal);
  }

  confirmDelete(): void {
    if (!this.selectedMaterialId) return;

    this.adminService.deleteMaterial(this.selectedMaterialId).subscribe({
      next: () => {
        this.materials = this.materials.filter(
          (m) => m.id !== this.selectedMaterialId
        );
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error('Failed to delete material', err);
        this.modalService.dismissAll();
      },
    });
  }

  applyFilters(): void {
    this.isLoading = true;
    let params: any = {};

    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.materialsService
      .getAllMaterials(
        1,
        params.search,
        params.category,
        undefined,
        params.status
      )
      .subscribe({
        next: (response) => {
          this.materials = response.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to apply filters';
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.searchTerm = '';
    this.loadMaterials();
  }

  getCategoryName(category: string | Category): string {
    return typeof category === 'string' ? category : category?.name || 'N/A';
  }
}
