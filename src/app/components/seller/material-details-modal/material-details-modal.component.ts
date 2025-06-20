// material-details-modal.component.ts
import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-material-details-modal',
  imports: [CurrencyPipe],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ material?.name }}</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-4">
          <img [src]="material?.image" class="img-fluid rounded mb-3" alt="{{ material?.name }}">
        </div>
        <div class="col-md-8">
          <div class="mb-3">
            <h6 class="text-muted">Category</h6>
            <span class="badge bg-primary">{{ material?.category }}</span>
          </div>
          <div class="mb-3">
            <h6 class="text-muted">Price</h6>
            <p class="price-value">{{ material?.price | currency:'EUR':'symbol':'1.2-2' }}</p>
          </div>
          <div class="mb-3">
            <h6 class="text-muted">Description</h6>
            <p>{{ material?.desc }}</p>
          </div>
          <div class="mb-3" *ngIf="material?.id">
            <h6 class="text-muted">Material ID</h6>
            <p>{{ material?.id }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">Close</button>
    </div>
  `,
  styles: [`
    .modal-header {
      border-bottom: none;
      padding-bottom: 0;
    }
    .modal-title {
      font-weight: 600;
    }
    .modal-body {
      padding-top: 0;
    }
    h6.text-muted {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
      color: #6c757d;
    }
    .price-value {
      font-weight: bold;
      color: #28a745;
      font-size: 1.1rem;
    }
  `]
})
export class MaterialDetailsModalComponent {
  @Input() material: any;
  
  constructor(public activeModal: NgbActiveModal) {}
}