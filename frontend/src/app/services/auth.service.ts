import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  register(payload: { name: string; email: string; password: string; }) {
    return this.http.post(`${this.api}/auth/register`, payload);
  }

  login(payload: { email: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${this.api}/auth/login`, payload).pipe(
      tap(res => { if (res?.token) localStorage.setItem('token', res.token); })
    );
  }

  logout() { localStorage.removeItem('token'); }

  getToken() { return localStorage.getItem('token'); }
}
