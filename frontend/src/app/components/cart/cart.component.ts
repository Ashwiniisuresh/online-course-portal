import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { Order } from '../../services/payment.service';
import { RazorpayOrder, RazorpayService } from '../../services/razorpay.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  message = '';
  total = 0;
  loading = false;
  razorpayProcessing = false;
  lastOrder?: Order;

  constructor(
    private cartSrv: CartService,
    private razorpaySrv: RazorpayService
  ) {}

  ngOnInit() {
    this.load();
  }

  startRazorpayCheckout() {
    if (!this.items.length) {
      this.message = 'Add a course to proceed.';
      return;
    }

    this.message = '';
    this.razorpayProcessing = true;

    const amount = Math.round(this.total);

    const openWidget = (order?: Partial<RazorpayOrder>) => {
      const options = {
        key: 'rzp_test_RiJMEyz2bhnFax',
        amount: order?.amount ?? amount * 100,
        currency: order?.currency || 'INR',
        name: 'Online Course Portal',
        description: 'Course purchase',
        order_id: order?.id,
        handler: (response: any) => {
          console.log('Razorpay payment success', response);
          this.message = 'Payment successful via Razorpay!';
          this.load();
        },
        prefill: {
          name: 'Demo User',
          email: 'demo@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#7c5dff',
        },
        modal: {
          ondismiss: () => (this.message = 'Razorpay checkout dismissed'),
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    };

    this.razorpaySrv.createOrder(amount, 'INR').subscribe({
      next: (order) => {
        this.razorpayProcessing = false;
        openWidget(order);
      },
      error: (err) => {
        this.razorpayProcessing = false;
        console.error('Razorpay order error', err);
        this.message = 'Order API unavailable. Opening direct Razorpay test checkout.';
        openWidget();
      },
    });
  }

  private computeTotal(items: CartItem[]) {
    this.total = items.reduce((sum, item) => {
      const course = item.course || item.Course;
      const price = course?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }

  load() {
    this.loading = true;
    this.cartSrv.getCart().subscribe({
      next: (r) => {
        this.items = r || [];
        this.computeTotal(this.items);
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load cart';
        this.loading = false;
      },
    });
  }

  courseTitle(item: CartItem) {
    return item.course?.title || item.Course?.title || 'Course';
  }

  coursePrice(item: CartItem) {
    return item.course?.price ?? item.Course?.price ?? 0;
  }

  remove(id: number) {
    this.message = '';
    this.cartSrv.remove(id).subscribe({
      next: () => this.load(),
      error: () => (this.message = 'Remove failed'),
    });
  }

}
