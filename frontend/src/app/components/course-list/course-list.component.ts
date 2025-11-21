import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  message = '';
  needsLogin = false;
  constructor(
    private courseSrv: CourseService,
    private cartSrv: CartService,
    private auth: AuthService
  ) {}
  ngOnInit() { this.courseSrv.list().subscribe({ next: c => this.courses = c as any[] , error: () => this.message = 'Failed to load' }); }
  addToCart(courseId: number) {
    if (!this.auth.getToken()) {
      this.needsLogin = true;
      this.message = '';
      return;
    }
    this.needsLogin = false;
    this.cartSrv.add(courseId).subscribe({
      next: () => this.message = 'Added to cart',
      error: () => this.message = 'Failed to add'
    });
  }
}
