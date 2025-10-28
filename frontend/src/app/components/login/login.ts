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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule // <-- Add to imports!
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  error: string | null = null;

  submit() {
    if (this.form.invalid) return;
    this.error = null;
    const payload = {
      username: this.form.get('username')?.value ?? '',
      password: this.form.get('password')?.value ?? ''
    };
    this.auth.login(payload).subscribe({
      next: (token: any) => {
        if (token) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (_err: any) => {
        this.error = 'Invalid credentials';
      }
    });
  }

  gotoSignup() {
    this.router.navigate(['/signup']);
  }
}
