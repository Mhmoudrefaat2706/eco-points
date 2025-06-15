import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedMatarialsService {
  private cartItems: any[] = [];
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();
  constructor() {}

  addToCart(item: any) {
    this.cartItems.push(item);
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.cartItems.length);
  }

  getCartItems() {
    return this.cartItems;
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.cartItems.length);
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
    this.cartCountSubject.next(0);
  }
}
