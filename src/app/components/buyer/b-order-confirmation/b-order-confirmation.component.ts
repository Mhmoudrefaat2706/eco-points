import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BNavbarComponent } from "../b-navbar/b-navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-b-order-confirmation',
  imports: [BNavbarComponent, CommonModule],
  templateUrl: './b-order-confirmation.component.html',
  styleUrl: './b-order-confirmation.component.css'
})
export class BOrderConfirmationComponent {

  orderData: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.orderData = navigation?.extras.state?.['orderData'];
  }

  continueShopping() {
    this.router.navigate(['/b-materials']);
  }
  
  get orderNumber() {
    return '#' + Math.floor(Math.random() * 1000000);
  }
  
}
