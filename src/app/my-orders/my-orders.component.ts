import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BNavbarComponent } from '../components/buyer/b-navbar/b-navbar.component';
import { BFooterComponent } from '../components/buyer/b-footer/b-footer.component';

interface OrderItem {
  material?: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  orderedMaterials?: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, BNavbarComponent, BFooterComponent],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = false;
  cancellingOrderId: number | null = null;
  payingOrderId: number | null = null;
  paymentStatus: string | null = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        this.paymentStatus = 'success';
        setTimeout(() => this.paymentStatus = null, 5000);
      } else if (params['payment'] === 'cancelled') {
        this.paymentStatus = 'cancelled';
        setTimeout(() => this.paymentStatus = null, 5000);
      }
    });

    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getUserOrders().subscribe({
      next: (response: any) => {
        this.processOrderResponse(response);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.isLoading = false;
      },
    });
  }

  private processOrderResponse(response: any): void {
    if (Array.isArray(response)) {
      this.orders = response;
    } else if (response.orders) {
      this.orders = response.orders;
    } else {
      console.error('Unexpected response structure:', response);
      return;
    }

    this.orders.forEach((order) => {
      order.orderedMaterials = order.items.map((item: OrderItem) => ({
        name: item.material?.name || 'Unknown',
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));
    });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      approved: 'badge bg-success',
      rejected: 'badge bg-danger',
      pending: 'badge bg-warning',
      cancelled: 'badge bg-danger',
    };
    return statusMap[status.toLowerCase()] || 'badge bg-secondary';
  }

  getStatusText(status: string): string {
    const statusTextMap: Record<string, string> = {
      approved: 'Accepted',
      rejected: 'Rejected',
      pending: 'Pending',
      cancelled: 'Cancelled',
    };
    return statusTextMap[status.toLowerCase()] || 'Unknown';
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

  payForOrder(order: Order): void {
    this.payingOrderId = order.id;

    this.orderService.createPayPalOrder(order.id).subscribe({
      next: (response: any) => {
        if (response.approval_url) {
          // Redirect user to PayPal payment page
          window.location.href = response.approval_url;
        } else {
          console.error('Payment URL not found:', response);
          alert('Failed to initiate payment process');
        }
        this.payingOrderId = null;
      },
      error: (err) => {
        console.error('Error creating PayPal order:', err);
        alert('An error occurred during payment. Please check console for details');
        this.payingOrderId = null;
      }
    });
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((total: number, item: OrderItem) => {
      return total + item.price * item.quantity;
    }, 0);
  }
}