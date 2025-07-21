import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, BNavbarComponent, BFooterComponent , FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading: boolean = false;
  cancellingOrderId: number | null = null;
  payingOrderId: number | null = null;
  paymentStatus: string | null = null;
  filterStatus: string = 'all';

  constructor(private orderService: OrderService,
     private router: Router,
     private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        this.paymentStatus = 'success';
        setTimeout(() => this.paymentStatus = null, 5000); // Hide message after 5 seconds
      } else if (params['payment'] === 'cancelled') {
        this.paymentStatus = 'cancelled';
        setTimeout(() => this.paymentStatus = null, 5000);
      }
    });

    this.loadOrders();
  }
setFilter(status: string): void {
  this.filterStatus = status;
}
get filteredOrders(): any[] {
  if (this.filterStatus === 'all') {
    return this.orders;
  }
  return this.orders.filter(order => order.status === this.filterStatus);
}


  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getUserOrders().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.orders = response;
        } else if (response.orders) {
          this.orders = response.orders;
        } else {
          console.error('Unexpected response structure:', response);
        }

        this.orders.forEach(order => {
          order.orderedMaterials = order.items.map((item: any) => ({
            name: item.material?.name || 'Unknown',
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          }));
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      case 'pending': return 'badge bg-warning';
      case 'cancelled': return 'badge bg-danger';
      case 'paid': return 'badge bg-blue';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'paid': return 'paid';
      default: return 'Unknown';
    }
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.cancellingOrderId = orderId;

      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {

          const orderIndex = this.orders.findIndex(order => order.id === orderId);
          if (orderIndex !== -1) {
            this.orders[orderIndex].status = 'cancelled';
          }
          this.cancellingOrderId = null;
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.cancellingOrderId = null;
        }
      });
    }
  }

  payForOrder(order: any): void {
    this.payingOrderId = order.id;

    this.orderService.createPayPalOrder(order.id).subscribe({
      next: (response: any) => {
        if (response.approval_url) {
          window.location.href = response.approval_url;
        } else {
          console.error('Payment link not found:', response);
          alert('Failed to initiate payment process');
        }
        this.payingOrderId = null;
      },
      error: (err) => {
        console.error('Error creating PayPal order:', err);
        alert('An error occurred while trying to pay. Check the console for details.');
        this.payingOrderId = null;
      }
    });
  }
}
