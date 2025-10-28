import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- Import RouterModule

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule // <-- Add to imports!
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  error: string | null = null;
  message: string | null = null;

  submit() {
  if (this.form.invalid) return;
  this.error = null;
  this.message = null;
  const payload = {
    username: this.form.get('username')?.value ?? '',
    password: this.form.get('password')?.value ?? '',
    email: this.form.get('email')?.value ?? '',
    roleName: 'ROLE_USER'  //passed by default
  };
this.auth.signup(payload).subscribe({
  next: (msg) => {
    this.message = msg ?? 'Signup successful! Redirecting..';
    this.router.navigate(['/dashboard']);

  },
  error: (err) => {
    console.error('Signup error', err);
    this.error = 'Signup failed. Try again.';
  }
});

}

gotoLogin() {
    this.router.navigate(['/login']);
  }
}
