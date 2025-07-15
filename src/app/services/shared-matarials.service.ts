// shared-matarials.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class SharedMatarialsService {
  private cartItems: any[] = [];
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private cartService: CartService) {}

  addToCart(item: any): Observable<any> {
    return this.cartService.addToCart(item.id).pipe(
      tap(() => {
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
          this.cartItems.push({ ...item, quantity: 1 });
        }
        this.updateCartData();
      })
    );
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.cartService.removeFromCart(itemId).pipe(
      tap(() => {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.updateCartData();
      })
    );
  }

  clearCart(): Observable<any> {
    return this.cartService.clearCart().pipe(
      tap(() => {
        this.cartItems = [];
        this.updateCartData();
      })
    );
  }

  updateCartItem(id: number, quantity: number): Observable<any> {
    return this.cartService.updateCartItem(id, quantity).pipe(
      tap(() => {
        const item = this.cartItems.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
          this.updateCartData();
        }
      })
    );
  }

  isInCart(materialId: number): boolean {
    return this.cartItems.some(item => item.id === materialId);
  }

  private updateCartData() {
    this.cartItemsSubject.next([...this.cartItems]);
    this.cartCountSubject.next(this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0));
  }

  // Add this method to sync with backend
  loadCartItems(): Observable<any> {
    return this.cartService.viewCart().pipe(
      tap((items: any) => {
        this.cartItems = items.map((item: any) => ({
          id: item.id,
          name: item.material.name,
          price: item.material.price,
          image: item.material.image_url,
          category: item.material.category_id,
          quantity: item.quantity,
        }));
        this.updateCartData();
      })
    );
  }
}