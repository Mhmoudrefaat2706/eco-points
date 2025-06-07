import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [
    { name: 'John Doe', email: 'john@example.com', password: '123456' },
  ];

  private loggedInUser: any = null;

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.loggedInUser = user;
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const exists = this.users.some(u => u.email === email);
    if (exists) return false;
    this.users.push({ name, email, password });
    return true;
  }

  logout() {
    this.loggedInUser = null;
  }

  isAuthenticated(): boolean {
    return this.loggedInUser !== null;
  }
}
