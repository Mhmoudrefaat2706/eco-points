import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  name: string; // Will combine first_name + last_name
  email: string;
  role: 'seller' | 'buyer';

}
export interface loginUser {
  email: string;
  password: string;

  token?: string;

}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {

    const savedUser = localStorage.getItem('loggedInUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }


  private readonly _HttpClient = inject(HttpClient);

  headers = new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
    Accept: '*/*',
    'Content-Length': '<calcuulated when request is sent>',
  });

  private users: User[] = [
    {
      first_name: 'Seller',
      last_name: 'User',
      email: 'seller@seller.com',
      password: '123456',
      role: 'seller',
    },
    {
      first_name: 'Buyer',
      last_name: 'User',
      email: 'buyer@buyer.com',
      password: '123456',
      role: 'buyer',
    },
  ];

  private loggedInUser: User | null = null;

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  initializeCsrf(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  login(email: string, password: string): Observable<any> {
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
    return this.http.post(`${this.apiUrl}/register`, {
      first_name,
      last_name,
      email,
      password,
      role,
    });
  }


  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.currentUserSubject.next(null);
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  getLoggedInUser(): User | null {

    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;

    return this.currentUserValue;

  }

  getUserRole(): 'seller' | 'buyer' | null {
    return this.currentUserValue?.role ?? null;
  }


  register(data: User): Observable<any> {
    return this._HttpClient.post('http://localhost:8000/api/register', data, {
      headers: this.headers,
    });
  }

  login(data: object): Observable<any> {
    return this._HttpClient
      .post('http://localhost:8000/api/login', data, { headers: this.headers })
      .pipe(
        tap((res: any) => {
          if (res.status && res.user) {
            localStorage.setItem('loggedInUser', JSON.stringify(res.user));
            localStorage.setItem('token', res.access_token);
          }
        })
      );
  }
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this._HttpClient.get('http://localhost:8000/api/user/profile', {
      headers,
    });
  }
  updateProfile(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this._HttpClient.put(
      'http://localhost:8000/api/user/profile',
      data,
      { headers }
    );
  }
}

}

