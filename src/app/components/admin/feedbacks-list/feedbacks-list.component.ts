import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from '../../../models/feedback.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedbacks-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feedbacks-list.component.html',
  styleUrls: ['./feedbacks-list.component.css'],
})
export class FeedbacksListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  isLoading = true;
  errorMessage = '';
  feedbackToDelete: number | null = null;
  isDeleting = false; // Add this for delete loading state

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAllFeedbacks().subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks.map((f) => ({
          ...f,
          seller: f.seller || { first_name: 'Unknown', last_name: 'Seller' },
          buyer: f.buyer || { first_name: 'Unknown', last_name: 'Buyer' },
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.errorMessage = 'Failed to load feedbacks';
        this.isLoading = false;
        this.toastr.error('Failed to load feedbacks', 'Error');
      },
    });
  }

  deleteFeedback(id: number, content: any): void {
    this.feedbackToDelete = id;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  confirmDelete(): void {
    if (this.feedbackToDelete) {
      this.isDeleting = true; // Start loading
      this.adminService.deleteFeedback(this.feedbackToDelete).subscribe({
        next: () => {
          this.feedbacks = this.feedbacks.filter(
            (f) => f.id !== this.feedbackToDelete
          );
          this.toastr.success('Feedback deleted successfully');
          this.modalService.dismissAll();
          this.feedbackToDelete = null;
          this.isDeleting = false; // End loading
        },
        error: (error) => {
          console.error('Error deleting feedback:', error);
          this.toastr.error('Failed to delete feedback', 'Error');
          this.modalService.dismissAll();
          this.feedbackToDelete = null;
          this.isDeleting = false; // End loading
        },
      });
    }
  }
}
