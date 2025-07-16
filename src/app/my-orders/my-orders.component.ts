import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BNavbarComponent } from '../components/buyer/b-navbar/b-navbar.component';
import { BFooterComponent } from '../components/buyer/b-footer/b-footer.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, BNavbarComponent, BFooterComponent],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading: boolean = false;
  cancellingOrderId: number | null = null;
payingOrderId: number | null = null;
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
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
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
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



// أضف هذه الدالة
payForOrder(order: any): void {
  this.payingOrderId = order.id;

  this.orderService.createPayPalOrder(order.id).subscribe({
    next: (response: any) => {
      if (response.approval_url) {
        // توجيه المستخدم لصفحة الدفع في PayPal
        window.location.href = response.approval_url;
      } else {
        console.error('لم يتم العثور على رابط الدفع:', response);
        alert('فشل في بدء عملية الدفع');
      }
      this.payingOrderId = null;
    },
    error: (err) => {
      console.error('خطأ في إنشاء طلب PayPal:', err);
      alert('حدث خطأ أثناء محاولة الدفع. راجع الكونسول للتفاصيل');
      this.payingOrderId = null;
    }
  });
}
}
