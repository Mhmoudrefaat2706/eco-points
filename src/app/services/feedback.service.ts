import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = 'http://127.0.0.1:8000/api/feedback';
  private materialIdSubject = new BehaviorSubject<number | null>(null);
  materialId$ = this.materialIdSubject.asObservable();
  feedbackComment!: string;
  feedbackRating!: number;

  constructor(private http: HttpClient) {}

  // جلب كل الفيدباك لبائع معين
  getFeedbacksForSeller(sellerId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/seller/${sellerId}`, { headers });
  }

  // جلب كل الفيدباك لباير معين
  getFeedbacksForBuyer(buyerId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/buyer/${buyerId}`, { headers });
  }

  // إضافة فيدباك جديدة
  addFeedback(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.apiUrl, data, {
      headers,
    });
  }

  // تعديل فيدباك
  editFeedback(feedbackId: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.apiUrl}/${feedbackId}`, data, { headers });
  }

  // حذف فيدباك
  deleteFeedback(feedbackId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiUrl}/${feedbackId}`, { headers });
  }
  setMaterialId(id: number) {
    this.materialIdSubject.next(id);
  }

  getMaterialId(): number | null {
    return this.materialIdSubject.value;
  }
}
