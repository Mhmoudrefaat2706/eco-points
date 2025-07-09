import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'seller' | 'buyer';
 
}
export interface loginUser {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      try {
        this.loggedInUser = JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('loggedInUser');
      }
    }
  }

  private readonly _HttpClient= inject(HttpClient);

  headers = new HttpHeaders({
    'accept': 'application/json',
    'Content-Type': 'application/json', 
    'Accept': "*/*" ,
    'Content-Length': '<calcuulated when request is sent>',
  })

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





  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
  }

  isAuthenticated(): boolean {
    return this.loggedInUser !== null;
  }


  getLoggedInUser(): User | null {
  const savedUser = localStorage.getItem('loggedInUser');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
}

  getUserRole(): 'seller' | 'buyer' | null {
    return this.loggedInUser?.role ?? null;
  }

  register(data:User): Observable<any> {
    return this._HttpClient.post('http://localhost:8000/api/register',data , {headers:this.headers} )
  }

  login(data: object): Observable<any> {
  return this._HttpClient.post('http://localhost:8000/api/login', data, { headers: this.headers }).pipe(
    tap((res: any) => {
      if (res.status && res.user) {
        localStorage.setItem('loggedInUser', JSON.stringify(res.user));
      }
    })
  );
}

}