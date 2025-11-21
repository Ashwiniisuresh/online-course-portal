import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  error = '';
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}
submit() {
  this.error = '';
  if (this.form.invalid) { this.error = 'Please fill required fields'; return; }

  // Build a payload with explicit non-null assertion / fallback
  const payload = {
    email: this.form.get('email')!.value as string,
    password: this.form.get('password')!.value as string
  };

  this.auth.login(payload).subscribe({
    next: () => this.router.navigateByUrl('/'),
    error: (e) => this.error = e?.error?.message || 'Login failed'
  });
}

}
