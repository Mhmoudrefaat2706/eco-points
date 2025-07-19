import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from '../../../models/feedback.model';

@Component({
  selector: 'app-feedbacks-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feedbacks-list.component.html',
  styleUrls: ['./feedbacks-list.component.css']
})
export class FeedbacksListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getAllFeedbacks().subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.errorMessage = 'Failed to load feedbacks';
        this.isLoading = false;
        this.toastr.error('Failed to load feedbacks', 'Error');
      }
    });
  }

  deleteFeedback(id: number): void {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.adminService.deleteFeedback(id).subscribe({
        next: () => {
          this.feedbacks = this.feedbacks.filter(f => f.id !== id);
          this.toastr.success('Feedback deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting feedback:', error);
          this.toastr.error('Failed to delete feedback', 'Error');
        }
      });
    }
  }
}