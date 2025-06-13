import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [
    { name: 'Seller User', email: 'seller@example.com', password: '123456', role: 'seller' },
    { name: 'Buyer User', email: 'buyer@example.com', password: '123456', role: 'buyer' },
  ];

  private loggedInUser: any = null;

  constructor() {
   
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      this.loggedInUser = JSON.parse(savedUser);
    }
  }

  login(email: string, password: string, role: string): boolean {
    const user = this.users.find(
      u => u.email === email && u.password === password && u.role === role
    );
    if (user) {
      this.loggedInUser = user;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string, role: string): boolean {
    const exists = this.users.some(u => u.email === email);
    if (exists) return false;

    this.users.push({ name, email, password, role });
    return true;
  }

  logout() {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
  }

  isAuthenticated(): boolean {
    return this.loggedInUser !== null;
  }

  getUserRole(): string | null {
    return this.loggedInUser ? this.loggedInUser.role : null;
  }
}
