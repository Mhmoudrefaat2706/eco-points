import { Component, OnInit } from '@angular/core';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-b-cart',
  imports: [
    BNavbarComponent,
    BFooterComponent,
    RouterModule,
    DecimalPipe,
    CommonModule,
  ],
  templateUrl: './b-cart.component.html',
  styleUrls: ['./b-cart.component.css'],
})
export class BCartComponent implements OnInit {
  
  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  materails: any[] = [];
  subtotal!: number;
  shippingFee: number = 5.0;
  taxRate: number = 0.14;
  showSnackbar = false;
  snackbarMessage = '';
  snackbarActionType: 'add' | 'remove' | 'clear' | 'update' | null = null;
  loadingCart: boolean = true;
  deletingItemId: number | null = null;
  clearingCart: boolean = false;

  ngOnInit() {
    this.loadCartItems();
  }

  // Update loadCartItems method
  loadCartItems() {
    this.loadingCart = true;
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.materails = res.map((item: any) => ({
          id: item.id,
          name: item.material.name,
          price: +item.material.price,
          image: item.material.image_url,
          category: item.material.category_id,
          quantity: item.quantity,
        }));
        this.calcPrice();
        this.loadingCart = false;
      },
      error: (err) => {
        console.error('Failed to load cart items', err);
        this.loadingCart = false;
      },
    });
  }

  calcPrice() {
    this.subtotal = this.materails.reduce(
      (acc: number, item: any) => acc + item.price * (item.quantity || 1),
      0
    );
  }

  getTotalItems(): number {
    return this.materails.reduce(
      (acc: number, item: any) => acc + (item.quantity || 1),
      0
    );
  }

  getTax(): number {
    return this.subtotal * this.taxRate;
  }

  getTotal(): number {
    return this.subtotal + this.getTax() + this.shippingFee;
  }

  private showCustomSnackbar(
    message: string,
    actionType: 'add' | 'remove' | 'clear' | 'update'
  ) {
    this.snackbarMessage = message;
    this.snackbarActionType = actionType;
    this.showSnackbar = true;

    setTimeout(() => {
      this.showSnackbar = false;
    }, 2500);
  }

  // Update the updateCartItem method to handle types properly
  private updateCartItem(item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cartService.updateCartItem(item.id, item.quantity).subscribe({
        next: () => {
          this.calcPrice();
          this.showCustomSnackbar('Quantity updated', 'update');
          this.cartService.loadCartCount();
          resolve();
        },
        error: (err: Error) => {
          console.error('Error updating quantity', err);
          reject(err);
        },
      });
    });
  }

  // Update the incrementQuantity method
  incrementQuantity(item: any): void {
    const newQuantity = (item.quantity || 1) + 1;
    this.cartService.updateCartItem(item.id, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.calcPrice();
        this.showCustomSnackbar('Quantity increased', 'update');
        this.cartService.loadCartCount();
      },
      error: (err: Error) => {
        console.error('Error increasing quantity', err);
      },
    });
  }

  // Update the decrementQuantity method
  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.cartService.updateCartItem(item.id, newQuantity).subscribe({
        next: () => {
          item.quantity = newQuantity;
          this.calcPrice();
          this.showCustomSnackbar('Quantity decreased', 'update');
          this.cartService.loadCartCount();
        },
        error: (err: Error) => {
          console.error('Error decreasing quantity', err);
        },
      });
    }
  }

  // Update the removeFromCart method
  async removeFromCart(id: number) {
    if (this.deletingItemId !== null) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?',
        confirmText: 'Remove',
        cancelText: 'Keep',
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.deletingItemId = id;
      this.cartService.removeFromCart(id).subscribe({
        next: () => {
          this.loadCartItems();
          this.showCustomSnackbar('Item removed from cart', 'remove');
          this.deletingItemId = null;
          this.cartService.loadCartCount(); // Update the cart counter
        },
        error: (err) => {
          console.error('❌ Error removing item from cart', err);
          this.deletingItemId = null;
        },
      });
    }
  }

  // Update the clearCart method
  async clearCart() {
    if (this.clearingCart) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Clear Cart',
        message: 'Are you sure you want to clear your entire cart?',
        confirmText: 'Clear All',
        cancelText: 'Cancel',
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.clearingCart = true;
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCartItems();
          this.showCustomSnackbar('Cart cleared', 'clear');
          this.clearingCart = false;
          this.cartService.loadCartCount(); // Update the cart counter
        },
        error: (err) => {
          console.error(' Error clearing cart', err);
          this.clearingCart = false;
        },
      });
    }
  }

  // Add this method to b-cart.component.ts
  proceedToCheckout() {
    const cartData = {
      items: this.materails,
      subtotal: this.subtotal,
      shippingFee: this.shippingFee,
      tax: this.getTax(),
      total: this.getTotal(),
    };

    this.router.navigate(['/b-checkout'], {
      state: { cartData },
    });
  }
}
