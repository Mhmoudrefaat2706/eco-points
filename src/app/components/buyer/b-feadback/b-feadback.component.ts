import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  date: Date;
  buyer: string;
  seller: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BFooterComponent,
    BNavbarComponent,
  ],
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
  showSnackbar = false;
  isDarkMode = false;
  feedbackToDelete: number | null = null;
  showDeleteDialog = false;
  snackbarMessage = '';
  currentAction: 'add' | 'edit' | 'delete' | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    //this.currentUser = this.authService.getLoggedInUser()?.name || null;
   const user = this.authService.getLoggedInUser();
   this.currentUser = user ? user.name : null;
    this.route.paramMap.subscribe((params) => {
      this.seller = params.get('seller') || '';
      this.loadFeedbacks();
    });
  }

  goBack() {
    this.router.navigate(['/materials']);
  }

  loadFeedbacks() {
    const storedFeedbacks = localStorage.getItem('feedbacks');
    if (storedFeedbacks) {
      this.feedbackList = JSON.parse(storedFeedbacks).filter(
        (fb: Feedback) => fb.seller === this.seller
      );
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

  // Update the submitFeedback method
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
      buyer: this.currentUser || 'Anonymous',
      seller: this.seller,
    };

    const storedFeedbacks = localStorage.getItem('feedbacks');
    let allFeedbacks = storedFeedbacks ? JSON.parse(storedFeedbacks) : [];
    allFeedbacks.push(newFeedback);
    localStorage.setItem('feedbacks', JSON.stringify(allFeedbacks));

    this.loadFeedbacks();

    this.newRating = 0;
    this.newComment = '';
    this.currentAction = 'add';
    this.snackbarMessage = 'Feedback submitted successfully!';
    this.showSnackbar = true;
    setTimeout(() => (this.showSnackbar = false), 3000);
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

  // Update the saveEdit method
  saveEdit() {
    if (this.editingFeedbackId === null) return;

    const storedFeedbacks = localStorage.getItem('feedbacks');
    if (storedFeedbacks) {
      let allFeedbacks = JSON.parse(storedFeedbacks);
      const feedbackIndex = allFeedbacks.findIndex(
        (fb: Feedback) => fb.id === this.editingFeedbackId
      );

      if (feedbackIndex !== -1) {
        const updatedFeedback = {
          ...allFeedbacks[feedbackIndex],
          rating: this.editRating,
          comment: this.editComment.trim(),
          date: new Date(),
        };

        allFeedbacks[feedbackIndex] = updatedFeedback;
        localStorage.setItem('feedbacks', JSON.stringify(allFeedbacks));
        this.loadFeedbacks();
        this.cancelEdit();
        this.currentAction = 'edit';
        this.snackbarMessage = 'Feedback updated successfully!';
        this.showSnackbar = true;
        setTimeout(() => (this.showSnackbar = false), 3000);
      }
    }
  }

  deleteFeedback(feedbackId: number) {
    this.feedbackToDelete = feedbackId;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.feedbackToDelete = null;
    this.showDeleteDialog = false;
  }

  // Update the confirmDelete method
  confirmDelete() {
    if (this.feedbackToDelete !== null) {
      const storedFeedbacks = localStorage.getItem('feedbacks');
      if (storedFeedbacks) {
        let allFeedbacks = JSON.parse(storedFeedbacks);
        allFeedbacks = allFeedbacks.filter(
          (fb: Feedback) => fb.id !== this.feedbackToDelete
        );
        localStorage.setItem('feedbacks', JSON.stringify(allFeedbacks));
        this.loadFeedbacks();
        this.currentAction = 'delete';
        this.snackbarMessage = 'Feedback deleted successfully!';
        this.showSnackbar = true;
        setTimeout(() => (this.showSnackbar = false), 3000);
      }
    }
    this.cancelDelete();
  }
}
