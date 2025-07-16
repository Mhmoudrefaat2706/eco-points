import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

// order.service.ts
getUserOrders(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/user`, {
    headers: this.getHeaders()
  });
}
cancelOrder(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'cancelled' }, {
    headers: this.getHeaders()
  });
}








// أضف هذه الدالة
createPayPalOrder(orderId: number): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}/paypal/create-order`,
    { order_id: orderId },
    { headers: this.getHeaders() }
  );
}

}
