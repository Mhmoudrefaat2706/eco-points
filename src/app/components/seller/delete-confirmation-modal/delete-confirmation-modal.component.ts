// delete-confirmation-modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm Deletion</h4>
      <button
        type="button"
        class="btn-close"
        (click)="activeModal.dismiss()"
      ></button>
    </div>
    <div class="modal-body">
      <div class="alert alert-warning" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Are you sure you want to delete this material? This action cannot be
        undone.
      </div>
      <div class="d-flex align-items-center mb-3" *ngIf="material">
        <img
          [src]="material.image"
          class="rounded me-3"
          style="width: 50px; height: 50px; object-fit: cover;"
        />
        <div>
          <strong>{{ material.name }}</strong
          ><br />
          <span class="text-muted">{{ material.category }}</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="activeModal.dismiss()"
      >
        <i class="bi bi-x-lg me-1"></i> Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        (click)="activeModal.close(true)"
      >
        <i class="bi bi-trash me-1"></i> Delete
      </button>
    </div>
  `,
  styles: [
    `
      .modal-header {
        border-bottom: none;
        padding-bottom: 0;
      }
      .modal-title {
        font-weight: 600;
        color: #dc3545;
      }
      .modal-body {
        padding-top: 0;
      }
      .alert-warning {
        background-color: rgba(255, 193, 7, 0.1);
        border-left: 4px solid #ffc107;
      }
    `,
  ],
})
export class DeleteConfirmationModalComponent {
  @Input() material: any;

  constructor(public activeModal: NgbActiveModal) {}
}
