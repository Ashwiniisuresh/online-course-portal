import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { PurchasedComponent } from './components/purchased/purchased.component';

export const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'purchased', component: PurchasedComponent },
  { path: 'checkout/:status', component: PurchasedComponent },
  { path: '**', redirectTo: '' }
];
