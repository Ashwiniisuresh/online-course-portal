import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: number;
  courseId: number;
  quantity: number;
  course?: {
    id: number;
    title: string;
    description: string;
    price: number;
  } | null;
  Course?: CartItem['course'];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCart() {
    return this.http.get<CartItem[]>(`${this.api}/cart`);
  }

  add(courseId: number, quantity = 1) {
    return this.http.post<CartItem>(`${this.api}/cart/add`, { courseId, quantity });
  }

  remove(id: number) {
    return this.http.delete<{ message: string }>(`${this.api}/cart/${id}`);
  }

  clear() {
    return this.http.delete<{ message: string }>(`${this.api}/cart`);
  }
}
