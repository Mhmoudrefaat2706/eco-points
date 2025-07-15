import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  name: string; // Will combine first_name + last_name
  email: string;
  role: 'seller' | 'buyer';
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:8000/api';
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('loggedInUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  initializeCsrf(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { headers: this.headers }).pipe(
      tap((response) => {
        if (response.status && response.user && response.access_token) {
          const user = {
            id: response.user.id,
            name: `${response.user.first_name} ${response.user.last_name}`,
            email: response.user.email,
            role: response.user.role,
            token: response.access_token,
          };
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          localStorage.setItem('token', response.access_token);
          this.currentUserSubject.next(user);
        }
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        const user = {
          id: response.user.id,
          name: `${response.user.first_name} ${response.user.last_name}`,
          email: response.user.email,
          role: response.user.role,
          token: response.access_token,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string
  ): Observable<any> {
    const data = {
    return this.http.post(`${this.apiUrl}/register`, {
      first_name,
      last_name,
      email,
      password,
      role
    };
    return this.http.post(`${this.apiUrl}/register`, data, { headers: this.headers });
      role,
    });

  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
=======
    this.currentUserSubject.next(null);
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  getLoggedInUser(): User | null {
    return this.currentUserValue;
  }

  getUserRole(): 'seller' | 'buyer' | null {
    return this.currentUserValue?.role ?? null;
  }
}