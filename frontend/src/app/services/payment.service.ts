import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  course?: {
    id: number;
    title: string;
    description: string;
    price: number;
  } | null;
}

export interface Order {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  sessionId?: string;
  items: OrderItem[];
}

export interface CheckoutResponse {
  order: Order;
  checkoutUrl?: string;
  requiresPayment: boolean;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createCheckout() {
    return this.http.post<CheckoutResponse>(`${this.api}/purchase/checkout`, {});
  }

  confirm(sessionId: string) {
    return this.http.post<{ order: Order }>(`${this.api}/purchase/confirm`, { sessionId });
  }

  getPurchases() {
    return this.http.get<Order[]>(`${this.api}/purchases`);
  }
}
