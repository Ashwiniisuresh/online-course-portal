import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  // NON-NULLABLE form controls: values are always strings
  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required])
  });

  msg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

submit() {
  if (this.form.invalid) {
    this.msg = 'Please fill all fields';
    return;
  }

  // Build a strongly typed payload
  const payload: { name: string; email: string; password: string } = {
    name: this.form.controls['name'].value,
    email: this.form.controls['email'].value,
    password: this.form.controls['password'].value
  };

  this.auth.register(payload).subscribe({
    next: () => {
      this.msg = 'Registered successfully.';
      this.router.navigateByUrl('/login');
    },
    error: (e) => {
      this.msg = e?.error?.message || 'Registration failed';
    }
  });
}

}
