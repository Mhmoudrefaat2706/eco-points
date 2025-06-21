// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password: string;
  role: 'seller' | 'buyer';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private users: User[] = [
    {
      name: 'Seller User',
      email: 'seller@seller.com',
      password: '123456',
      role: 'seller',
    },
    {
      name: 'Buyer User',
      email: 'buyer@buyer.com',
      password: '123456',
      role: 'buyer',
    },

  ];

  private loggedInUser: User | null = null;

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

login(email: string, password: string): boolean {
  const user = this.users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (user) {
    this.loggedInUser = user;
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    return true;
  }

  return false;
}


  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
  }

  isAuthenticated(): boolean {
    return this.loggedInUser !== null;
  }


  getLoggedInUser(): User | null {
    return this.loggedInUser;
  }

  getUserRole(): 'seller' | 'buyer' | null {
    return this.loggedInUser?.role ?? null;
  }

  register(name: string, email: string, password: string, role: string): boolean {
    const exists = this.users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) return false;

    const newUser: User = { name, email, password, role: role as 'seller' | 'buyer' };
    this.users.push(newUser);
    return true;

  }
}
