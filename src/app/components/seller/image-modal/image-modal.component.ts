import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <div class="modal-header">
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body text-center">
      <img [src]="imageUrl" class="img-fluid" alt="Enlarged view">
    </div>
  `
})
export class ImageModalComponent {
  @Input() imageUrl!: string;
  
  constructor(public activeModal: NgbActiveModal) {}
}