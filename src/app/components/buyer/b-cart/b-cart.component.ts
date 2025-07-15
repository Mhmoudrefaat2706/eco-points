import { Component, OnInit } from '@angular/core';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { RouterModule } from '@angular/router';
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
    private dialog: MatDialog
  ) {}

  materails: any[] = [];
  subtotal!: number;
  shippingFee: number = 5.0;
  taxRate: number = 0.14;
  showSnackbar = false;
  snackbarMessage = '';
  snackbarActionType: 'add' | 'remove' | 'clear' | 'update' | null = null;

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
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
      },
      error: (err) => {
        console.error(' Failed to load cart items', err);
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
    }, 3000);
  }

  incrementQuantity(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.calcPrice();
    this.showCustomSnackbar('Quantity increased', 'update');
    // You can add a backend update if needed
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.calcPrice();
      this.showCustomSnackbar('Quantity decreased', 'update');
    }
  }

  async removeFromCart(id: number) {
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
      this.cartService.removeFromCart(id).subscribe({
        next: () => {
          this.loadCartItems();
          this.showCustomSnackbar('Item removed from cart', 'remove');
        },
        error: (err) => {
          console.error('❌ Error removing item from cart', err);
        },
      });
    }
  }

  async clearCart() {
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
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCartItems();
          this.showCustomSnackbar('Cart cleared', 'clear');
        },
        error: (err) => {
          console.error(' Error clearing cart', err);
        },
      });
    }
  }
}
