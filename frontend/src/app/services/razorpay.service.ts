import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class RazorpayService {
  private apiUrl = environment.razorpayApiUrl || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  createOrder(amount: number, currency: string): Observable<RazorpayOrder> {
    return this.http.post<RazorpayOrder>(`${this.apiUrl}/createOrder`, { amount, currency });
  }
}
