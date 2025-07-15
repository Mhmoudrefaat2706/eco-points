import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../../../services/feedback.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-feedbacks',
  standalone: true,
  templateUrl: './seller-feedbacks.component.html',
  styleUrls: ['./seller-feedbacks.component.css'],
  imports: [FormsModule, CommonModule],
})
export class SellerFeedbacksComponent implements OnInit {
  sellerId: number = 0;
  feedbacks: any[] = [];
  isLoading = true;

  newRating: number = 0;
  newComment: string = '';
  feedbackError: string = '';

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const seller = params.get('seller_id');
      if (seller) {
        this.sellerId = +seller;
        this.loadFeedbacks();
      }
    });
  }

  loadFeedbacks() {
    this.isLoading = true;
    this.feedbackService.getFeedbacksForSeller(this.sellerId).subscribe({
      next: (res) => {
        this.feedbacks = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error loading feedbacks');
        console.error(err);
      },
    });
  }

  submitFeedback() {
    this.feedbackError = '';
    if (this.newRating === 0 || !this.newComment.trim()) {
      this.feedbackError = 'Please provide both rating and comment';
      return;
    }

    const newFeedback = {
      material_id: 1, // ثابت مؤقتًا لو الباك إند محتاجه
      rating: this.newRating,
      comment: this.newComment.trim(),
    };

    this.feedbackService.addFeedback(newFeedback).subscribe({
      next: () => {
        alert('Feedback added successfully!');
        this.newRating = 0;
        this.newComment = '';
        this.loadFeedbacks();
      },
      error: (err) => {
        alert('Error adding feedback');
        console.error(err);
      },
    });
  }
}
