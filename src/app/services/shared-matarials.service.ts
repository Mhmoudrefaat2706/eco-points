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
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // If item already exists, increment quantity
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // If new item, add with quantity 1
      this.cartItems.push({ ...item, quantity: 1 });
    }
    
    this.updateCartData();
  }

  getCartItems() {
    return this.cartItems;
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCartData();
  }

  clearCart() {
    this.cartItems = [];
    this.updateCartData();
  }

  updateCartItem(id: number, quantity: number) {
    const item = this.cartItems.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
      this.updateCartData();
    }
  }

  isInCart(materialId: number): boolean {
    return this.cartItems.some(item => item.id === materialId);
  }

  private updateCartData() {
    this.cartItemsSubject.next([...this.cartItems]);
    this.cartCountSubject.next(this.cartItems.length);
  }
}