import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';

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

  private userProfileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  private apiUrl = 'http://localhost:8000/api';
  userData: any;

  constructor(private http: HttpClient, private LoaderService: LoaderService) {
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
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          const user = {
            id: response.user.id,
            name: `${response.user.first_name} ${response.user.last_name}`,
            email: response.user.email,
            role: response.user.role,
            token: response.access_token,
            city: response.user.city,
          };
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          localStorage.setItem('token', response.access_token);
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
      first_name,
      last_name,
      email,
      password,
      role,
    };
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: data,
    });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
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
  updateProfile(data: any): Observable<any> {
    const user = localStorage.getItem('loggedInUser');
    const token = user ? JSON.parse(user).token : null;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.apiUrl}/user/profile`, data, {
      headers,
    });
  }
  getUserData(): void {
    const user = localStorage.getItem('loggedInUser');
    const token = user ? JSON.parse(user).token : null;

    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.LoaderService.show();
    this.http.get(`${this.apiUrl}/user/profile`, { headers }).subscribe({
      next: (res) => {
        console.log('✅ User profile data:', res);
        this.userProfileSubject.next(res); // نحفظ البيانات هنا
        this.LoaderService.hide();
      },
      error: (err) => {
        console.error('❌ Failed to fetch user profile:', err);
        this.userProfileSubject.next(null); // نمرر null في حالة الخطأ
        this.LoaderService.hide();
      },
    });
  }
}
