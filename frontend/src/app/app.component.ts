import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell">
      <header class="glass-panel app-nav">
        <div class="app-nav__brand">
          <span>OP</span>
          <div>
            <strong>Online Portal</strong>
            <p>Curated learning marketplace</p>
          </div>
        </div>
        <nav class="app-nav__links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Courses</a>
          <a routerLink="/cart" routerLinkActive="active" *ngIf="isLoggedIn()">Cart</a>
          <a routerLink="/purchased" routerLinkActive="active" *ngIf="isLoggedIn()">Purchased</a>
          <ng-container *ngIf="isLoggedIn(); else guestLinks">
            <button class="btn secondary" type="button" (click)="logout()">Logout</button>
          </ng-container>
          <ng-template #guestLinks>
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          </ng-template>
        </nav>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  isLoggedIn() {
    return Boolean(this.auth.getToken());
  }

  logout() {
    this.auth.logout();
  }
}
