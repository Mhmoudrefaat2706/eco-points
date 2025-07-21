import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-orders',
  standalone: true,

imports: [CommonModule, RouterModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchSellerOrders();
  }

  fetchSellerOrders(): void {
    this.isLoading = true;
    this.orderService.getSellerOrders().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading seller orders', err);
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
      case 'paid': return 'badge bg-info text-dark';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'paid': return 'Paid';
      default: return 'Unknown';
    }
  }
updateStatus(orderId: number, status: string): void {
  const orderIndex = this.orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return;

  if (status === 'approved') {
    this.orders[orderIndex].approving = true;
  } else if (status === 'rejected') {
    this.orders[orderIndex].rejecting = true;
  }

  this.orderService.updateOrderStatus(orderId, status).subscribe({
    next: () => {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        status,
        approving: false,
        rejecting: false
      };
    },
    error: (err) => {
      console.error('Error updating order status', err);
      this.orders[orderIndex].approving = false;
      this.orders[orderIndex].rejecting = false;
    }
  });
}

filterStatus: string = 'all'; // الحالة المختارة
get filteredOrders(): any[] {
  if (this.filterStatus === 'all') return this.orders;
  return this.orders.filter(order => order.status === this.filterStatus);
}


}
