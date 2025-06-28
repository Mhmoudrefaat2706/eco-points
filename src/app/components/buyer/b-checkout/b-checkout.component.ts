import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { FooterComponent } from '../../seller/footer/footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BFooterComponent } from '../b-footer/b-footer.component';

@Component({
  selector: 'app-b-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BNavbarComponent,
    MatSnackBarModule,
    BFooterComponent,
  ],
  templateUrl: './b-checkout.component.html',
  styleUrls: ['./b-checkout.component.css'],
})
export class BCheckoutComponent implements OnInit {
  // Personal Information
  name = '';
  email = '';
  phone = '';

  // Shipping Information
  address = '';
  city = '';
  zipCode = '';
  country = 'Egypt';

  // Payment Information
  paymentMethod: 'credit' | 'paypal' | 'cash' = 'credit';
  cardNumber = '';
  cardName = '';
  expiryDate = '';
  cvv = '';

  // Order Summary
  cartItems: any[] = [];
  subtotal = 0;
  shippingCost = 5;
  taxRate = 0.14;
  tax = 0;
  total = 0;

  constructor(
    private router: Router,
    private materialsService: SharedMatarialsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cartItems = this.materialsService.getCartItems();
    this.calcPrices();
  }

  calcPrices() {
    this.subtotal = this.cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
    this.tax = this.subtotal * this.taxRate;
    this.total = this.subtotal + this.tax + this.shippingCost;
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }

  placeOrder() {
    if (!this.name || !this.address || !this.phone) {
      this.showSnackbar('Please fill in all required fields.');
      return;
    }

    if (
      this.paymentMethod === 'credit' &&
      (!this.cardNumber || !this.cardName || !this.expiryDate || !this.cvv)
    ) {
      this.showSnackbar('Please fill in all credit card details.');
      return;
    }

    const orderData = {
      customerInfo: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        address: this.address,
        city: this.city,
        zipCode: this.zipCode,
        country: this.country,
      },
      paymentMethod: this.paymentMethod,
      orderItems: this.cartItems,
      subtotal: this.subtotal,
      tax: this.tax,
      shippingCost: this.shippingCost,
      total: this.total,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    this.materialsService.clearCart();
    this.router.navigate(['/order-confirmation'], {
      state: { orderData },
    });
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['custom-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  backToCart() {
    this.router.navigate(['/b-cart']);
  }
}
