import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/cart';

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartCount();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headersConfig: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headersConfig);
  }

  addToCart(material_id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`,
      { material_id },
      { headers: this.getHeaders() }
    );
  }

  viewCart(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  removeFromCart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${id}`, {
      headers: this.getHeaders(),
    });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, {
      headers: this.getHeaders(),
    });
  }

  updateCartItem(itemId: number, quantity: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update/${itemId}`,
      { quantity },
      { headers: this.getHeaders() }
    );
  }

  loadCartCount(): void {
    // Instead of reloading the entire cart, just increment/decrement the count
    // based on the current value
    this.viewCart().subscribe({
      next: (cartItems: any) => {
        const total = cartItems.reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0
        );
        this.cartCountSubject.next(total);
      },
      error: (err: any) => {
        this.cartCountSubject.next(0);
      },
    });
  }

  // Add a new method to update count without reloading the entire cart
  updateCartCount(change: number): void {
    const current = this.cartCountSubject.value;
    this.cartCountSubject.next(current + change);
  }
  checkout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkout`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
