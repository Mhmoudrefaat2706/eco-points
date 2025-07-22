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
  checkingOut: boolean = false;
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

  // In b-cart.component.ts
  incrementQuantity(item: any): void {
    const newQuantity = (item.quantity || 1) + 1;
    item.quantity = newQuantity; // Update immediately for better UX
    this.calcPrice(); // Recalculate prices immediately

    this.cartService.updateCartItem(item.id, newQuantity).subscribe({
      next: () => {
        this.showCustomSnackbar('Quantity increased', 'update');
        this.cartService.updateCartCount(1); // Update count by +1 instead of reloading
      },
      error: (err: Error) => {
        console.error('Error increasing quantity', err);
        // Rollback if error occurs
        item.quantity = Math.max(1, (item.quantity || 1) - 1);
        this.calcPrice();
      },
    });
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      item.quantity = newQuantity; // Update immediately for better UX
      this.calcPrice(); // Recalculate prices immediately

      this.cartService.updateCartItem(item.id, newQuantity).subscribe({
        next: () => {
          this.showCustomSnackbar('Quantity decreased', 'update');
          this.cartService.updateCartCount(-1); // Update count by -1 instead of reloading
        },
        error: (err: Error) => {
          console.error('Error decreasing quantity', err);
          // Rollback if error occurs
          item.quantity = newQuantity + 1;
          this.calcPrice();
        },
      });
    }
  }

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
      const item = this.materails.find((i) => i.id === id);
      const quantityChange = -(item?.quantity || 1);

      this.cartService.removeFromCart(id).subscribe({
        next: () => {
          this.materails = this.materails.filter((i) => i.id !== id);
          this.calcPrice();
          this.showCustomSnackbar('Item removed from cart', 'remove');
          this.deletingItemId = null;
          this.cartService.updateCartCount(quantityChange);
        },
        error: (err) => {
          console.error('❌ Error removing item from cart', err);
          this.deletingItemId = null;
        },
      });
    }
  }

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
      const totalQuantity = this.getTotalItems();

      this.cartService.clearCart().subscribe({
        next: () => {
          this.materails = [];
          this.calcPrice();
          this.showCustomSnackbar('Cart cleared', 'clear');
          this.clearingCart = false;
          this.cartService.updateCartCount(-totalQuantity);
        },
        error: (err) => {
          console.error(' Error clearing cart', err);
          this.clearingCart = false;
        },
      });
    }
  }

  // Enhance the calcPrice method to be more precise
  calcPrice() {
    this.subtotal = this.materails.reduce(
      (acc: number, item: any) => acc + item.price * (item.quantity || 1),
      0
    );
    // Round to 2 decimal places to avoid floating point precision issues
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
  }

  // Update getTax and getTotal to be more precise
  getTax(): number {
    const tax = this.subtotal * this.taxRate;
    return parseFloat(tax.toFixed(2));
  }

  getTotal(): number {
    const total = this.subtotal + this.getTax() + this.shippingFee;
    return parseFloat(total.toFixed(2));
  }

  getTotalItems(): number {
    return this.materails.reduce(
      (acc: number, item: any) => acc + (item.quantity || 1),
      0
    );
  }
  getImageUrl(image: string | undefined): string {
    if (!image) return 'assets/images/placeholder.png';
    return `http://localhost:8000/materials/${image}`;
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

  proceedToCheckout() {
    if (this.checkingOut) return;

    this.checkingOut = true;

    this.cartService.checkout().subscribe({
      next: (res) => {
        this.checkingOut = false;
        this.showCustomSnackbar(
          'Order placed successfully! Order ID: ' + res.order_id,
          'update'
        );

        // Clear local cart
        this.materails = [];
        this.calcPrice();
        this.cartService.loadCartCount();
      },
      error: (err) => {
        this.checkingOut = false;
        console.error('Checkout failed', err);
        this.showCustomSnackbar(
          'Checkout failed: ' + err.error.message,
          'update'
        );
      },
    });
  }
}
