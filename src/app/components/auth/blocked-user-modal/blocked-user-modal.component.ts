import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blocked-user-modal',
  standalone: true,
  imports: [CommonModule, NgbModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Account Blocked</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="d-flex align-items-center">
        <i class="bi bi-shield-lock fs-1 text-danger me-3"></i>
        <div>
          <p class="mb-0">{{ message }}</p>
          <p class="small text-muted mt-2">Please contact support for assistance.</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close()">OK</button>
      <button type="button" class="btn btn-outline-secondary" (click)="contactSupport()">
        Contact Support
      </button>
    </div>
  `,
  styles: [`
    .bi-shield-lock {
      font-size: 2.5rem;
    }
  `]
})
export class BlockedUserModalComponent {
  message: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  contactSupport() {
    window.location.href = 'mailto:support@example.com';
    this.activeModal.close();
  }
}