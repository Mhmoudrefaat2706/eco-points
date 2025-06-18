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

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  @ViewChild('addEditForm') addEditForm!: ElementRef;

  showAddForm = false;
  isEditing = false;
  currentMaterialId: number | null = null;
  showNotification = false;
  notificationMessage = '';
  notificationType = ''; // 'success' or 'error'

  // New properties for filtering and pagination
  searchTerm = '';
  selectedCategory = '';
  currentPage = 1;
  itemsPerPage = 8; // You can adjust this number
  Math = Math;

  // Form model
  materialForm = {
    name: '',
    category: '',
    image: '',
    desc: '',
  };

  allMaterials: any[] = [];

  // Add to your constructor
    constructor(
    private modalService: NgbModal,
    private materialsService: MaterialsService
  ) {}

  getUniqueCategories(): string[] {
    const allCategories = this.allMaterials.map((m) => m.category);
    return [...new Set(allCategories)]; // Returns unique categories
  }

  selectCategory(category: string) {
    this.materialForm.category = category;
  }

  // User-added materials (saved in localStorage)
  userMaterials: any[] = [];

  ngOnInit() {
    this.loadMaterials();
  }

  loadMaterials() {
    this.allMaterials = this.materialsService.getAllMaterials();
  }

  saveMaterials() {
    localStorage.setItem('userMaterials', JSON.stringify(this.userMaterials));
    this.loadMaterials(); // Refresh the combined list
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.isEditing = false;
    this.resetForm();
  }

  resetForm() {
    this.materialForm = {
      name: '',
      category: '',
      image: '',
      desc: '',
    };
    this.currentMaterialId = null;
  }

  addMaterial() {
    const newMaterial = this.materialsService.addUserMaterial(this.materialForm);
    this.showNotificationMessage('Material added successfully!', 'success');
    this.resetForm();
    this.showAddForm = false;
    this.loadMaterials();
  }


  editMaterial(material: any) {
    this.isEditing = true;
    this.showAddForm = true;
    this.currentMaterialId = material.id;
    this.materialForm = {
      name: material.name,
      category: material.category,
      image: material.image,
      desc: material.desc,
    };
    
    // Scroll to form after a small delay to allow it to render
    setTimeout(() => {
      this.addEditForm.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  updateMaterial() {
    if (this.currentMaterialId) {
      const updated = this.materialsService.updateUserMaterial(
        this.currentMaterialId,
        this.materialForm
      );
      if (updated) {
        this.showNotificationMessage('Material updated successfully!', 'success');
        this.resetForm();
        this.showAddForm = false;
        this.loadMaterials();
      }
    }
  }

  // Add this new method
  private showNotificationMessage(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    // Hide notification after 3 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  // Replace your existing deleteMaterial method with this:
  deleteMaterial(id: number) {
    const material = this.allMaterials.find(m => m.id === id);
    if (!material) return;

    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.material = material;

    modalRef.result.then((result) => {
      if (result) {
        this.materialsService.deleteUserMaterial(id);
        this.showNotificationMessage('Material deleted successfully!', 'success');
        this.loadMaterials();
      }
    }).catch(() => {});
  }

  // Add this method to handle file selection and conversion
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate image type
    if (!file.type.match('image.*')) {
      this.showNotificationMessage('Please select an image file', 'error');
      return;
    }

    // Validate file size (e.g., 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      this.showNotificationMessage('Image must be less than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      // This will store the image as a base64 data URL
      this.materialForm.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Add these methods for filtering and pagination
  get filteredMaterials() {
    let filtered = this.allMaterials;

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.category.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter((m) => m.category === this.selectedCategory);
    }

    return filtered;
  }

  get paginatedMaterials() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMaterials.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredMaterials.length / this.itemsPerPage);
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
  }

  viewDetails(material: any) {
    const modalRef = this.modalService.open(MaterialDetailsModalComponent, {
      size: 'lg', // Large modal
      centered: true, // Center the modal vertically
    });
    modalRef.componentInstance.material = material;
  }

  openImageModal(imageUrl: string) {
    const modalRef = this.modalService.open(ImageModalComponent);
    modalRef.componentInstance.imageUrl = imageUrl;
  }
}
