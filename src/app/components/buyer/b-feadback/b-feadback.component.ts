import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  date: Date;
  buyer: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule , BFooterComponent, BNavbarComponent],
  templateUrl: './b-feadback.component.html',
  styleUrls: ['./b-feadback.component.css'],
})
export class FeedbackComponent implements OnInit {
  seller = '';
  feedbackList: Feedback[] = [];
  newRating = 0;
  newComment = '';
  editingFeedbackId: number | null = null;
  editRating = 0;
  editComment = '';
  currentUser: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getLoggedInUser()?.name || null;

    this.route.paramMap.subscribe(params => {
      this.seller = params.get('seller') || '';
      this.loadFeedbacks();
    });
  }

  loadFeedbacks() {
    const saved = localStorage.getItem(`feedback_${this.seller.toLowerCase()}`);
    if (saved) {
      this.feedbackList = JSON.parse(saved);
      this.feedbackList = this.feedbackList.map(fb => ({
        ...fb,
        date: new Date(fb.date)
      }));
    } else {
      this.feedbackList = [];
    }
  }

  setRating(star: number) {
    this.newRating = star;
  }

  setEditRating(star: number) {
    this.editRating = star;
  }

  submitFeedback() {
    if (this.newRating === 0 || !this.newComment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    const newFeedback = {
      id: Date.now(),
      rating: this.newRating,
      comment: this.newComment.trim(),
      date: new Date(),
      buyer: this.currentUser || 'Anonymous'
    };

    this.feedbackList.push(newFeedback);
    this.saveFeedbacks();

    this.newRating = 0;
    this.newComment = '';
  }

  startEdit(feedback: Feedback) {
    this.editingFeedbackId = feedback.id;
    this.editRating = feedback.rating;
    this.editComment = feedback.comment;
  }

  cancelEdit() {
    this.editingFeedbackId = null;
    this.editRating = 0;
    this.editComment = '';
  }

  saveEdit() {
    if (this.editingFeedbackId === null) return;

    const feedbackIndex = this.feedbackList.findIndex(fb => fb.id === this.editingFeedbackId);
    if (feedbackIndex !== -1) {
      this.feedbackList[feedbackIndex] = {
        ...this.feedbackList[feedbackIndex],
        rating: this.editRating,
        comment: this.editComment.trim(),
        date: new Date()
      };

      this.saveFeedbacks();
      this.cancelEdit();
    }
  }

  deleteFeedback(feedbackId: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackList = this.feedbackList.filter(fb => fb.id !== feedbackId);
      this.saveFeedbacks();
    }
  }

  private saveFeedbacks() {
    localStorage.setItem(
      `feedback_${this.seller.toLowerCase()}`,
      JSON.stringify(this.feedbackList)
    );
  }
}
