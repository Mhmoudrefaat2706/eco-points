import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { FooterComponent } from '../../seller/footer/footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';

@Component({
  selector: 'app-b-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule , BNavbarComponent],
  templateUrl: './b-checkout.component.html',
  styleUrls: ['./b-checkout.component.css'],
})
export class BCheckoutComponent implements OnInit {
  name = '';
  address = '';
  phone = '';

  cartItems: any[] = [];
  subtotal = 0;
  shippingCost = 5;
  total = 0;

  constructor(
    private router: Router,
    private materialsService: SharedMatarialsService
  ) {}

  ngOnInit() {
    this.cartItems = this.materialsService.getCartItems();
    this.calcSubtotal();
  }

  calcSubtotal() {
    this.subtotal = this.cartItems.reduce(
      (total, item) => total + item.price,
      0
    );
    this.total = this.subtotal + this.shippingCost;
  }

  placeOrder() {
    if (!this.name || !this.address || !this.phone) {
      alert('Please fill in all fields.');
      return;
    }

    alert(`Order placed successfully!\nTotal: EGP ${this.total}`);
    this.materialsService.clearCart();
    this.router.navigate(['/']);
  }
}

