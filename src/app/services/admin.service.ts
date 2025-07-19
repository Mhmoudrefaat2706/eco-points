import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUser, User } from '../models/user.model';
import { Material } from '../models/material.model';
import { DashboardStats } from '../models/dashboard.model';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  createUser(userData: CreateUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  blockUser(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/users/${id}/block`,
      {}
    );
  }

  unblockUser(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/users/${id}/unblock`,
      {}
    );
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`);
  }

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials`);
  }

  blockMaterial(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/materials/${id}/block`,
      {}
    );
  }

  unblockMaterial(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/materials/${id}/unblock`,
      {}
    );
  }

  deleteMaterial(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/materials/${id}`
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  updateMaterialStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/materials/${id}/status`, { status });
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/feedbacks`);
  }

  deleteFeedback(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/feedbacks/${id}`
    );
  }
}
