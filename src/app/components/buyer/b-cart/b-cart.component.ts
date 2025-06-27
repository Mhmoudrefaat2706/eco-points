import { Component, OnInit } from '@angular/core';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
    protected items: SharedMatarialsService,
    private dialog: MatDialog
  ) {}

  materails: any;
  subtotal!: number;
  shippingFee: number = 5.0;
  taxRate: number = 0.14; // 14% tax
  showSnackbar = false;
  snackbarMessage = '';
  snackbarActionType: 'add' | 'remove' | 'clear' | 'update' | null = null;

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.materails = this.items.getCartItems().map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    this.calcPrice();
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

  // Update the showSnackbar method
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

  // Update all methods that show snackbars
  incrementQuantity(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.items.updateCartItem(item.id, item.quantity);
    this.calcPrice();
    this.showCustomSnackbar('Quantity increased', 'update');
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.items.updateCartItem(item.id, item.quantity);
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
      this.items.removeFromCart(id);
      this.loadCartItems();
      this.showCustomSnackbar('Item removed from cart', 'remove');
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
      this.items.clearCart();
      this.loadCartItems();
      this.showCustomSnackbar('Cart cleared', 'clear');
    }
  }
}
