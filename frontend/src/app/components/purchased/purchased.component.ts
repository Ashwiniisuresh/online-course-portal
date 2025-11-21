import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order, PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-purchased',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.scss'],
})
export class PurchasedComponent implements OnInit {
  orders: Order[] = [];
  message = '';
  confirming = false;
  today = new Date();

  constructor(private payment: PaymentService, private route: ActivatedRoute) {}

  ngOnInit() {
    const status = this.route.snapshot.paramMap.get('status');
    if (status === 'success') {
      const sessionId = this.route.snapshot.queryParamMap.get('session_id');
      if (!sessionId) {
        this.message = 'Missing payment session. Unable to confirm.';
      } else {
        this.confirm(sessionId);
      }
    } else if (status === 'cancel') {
      this.message = 'Payment cancelled. Your cart still contains your items.';
    }
    this.load();
  }

  private load() {
    this.payment.getPurchases().subscribe({
      next: (orders) => (this.orders = orders || []),
      error: () => (this.message = 'Failed to load purchases'),
    });
  }

  private confirm(sessionId: string) {
    this.confirming = true;
    this.payment.confirm(sessionId).subscribe({
      next: () => {
        this.message = 'Payment confirmed!';
        this.confirming = false;
        this.load();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Unable to confirm payment.';
        this.confirming = false;
      },
    });
  }
}
