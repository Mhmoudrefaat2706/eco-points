import { Component, OnInit } from '@angular/core';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-b-cart',
  imports: [BNavbarComponent, BFooterComponent, RouterModule],
  templateUrl: './b-cart.component.html',
  styleUrls: ['./b-cart.component.css'],
})
export class BCartComponent implements OnInit {
  constructor(protected items: SharedMatarialsService) {}
  materails: any;
  subtotal!: number;
  ngOnInit() {
    this.materails = this.items.getCartItems();
    this.calcPrice();
    console.log(this.materails);
  }
  calcPrice() {
    this.subtotal = this.items
      .getCartItems()
      .reduce((accu, item) => accu + item.price, 0);
  }
removeFromCart(id: number) {
  const confirmed = confirm('Are you sure you want to remove this item from the cart?');
  if (confirmed) {
    this.items.removeFromCart(id);
    this.materails = this.items.getCartItems();
    this.calcPrice();
  }
}

}
