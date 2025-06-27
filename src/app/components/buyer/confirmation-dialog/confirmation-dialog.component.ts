import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="confirmation-dialog">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button class="cancel-btn" (click)="onDismiss()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button class="confirm-btn" (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 24px;
      font-family: 'Roboto', sans-serif;
      border-radius: 12px;
      max-width: 400px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .warning-icon {
      color: #FF9800;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    h2 {
      color: #333;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    mat-dialog-content {
      padding: 16px 0;
    }

    p {
      color: #616161;
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
    }

    mat-dialog-actions {
      margin-top: 24px;
      padding: 0;
      gap: 12px;
    }

    .cancel-btn {
      border: 1px solid #E0E0E0;
      color: #424242;
      padding: 8px 20px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .cancel-btn:hover {
      background-color: #F5F5F5;
      border-color: #BDBDBD;
    }

    .confirm-btn {
      background-color: #F44336;
      color: white;
      padding: 8px 20px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .confirm-btn:hover {
      background-color: #D32F2F;
    }

    /* Animation for dialog appearance */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .confirmation-dialog {
      animation: fadeIn 0.3s ease-out;
    }
  `],
  styleUrl: './confirmation-dialog.component.css'
})

export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}