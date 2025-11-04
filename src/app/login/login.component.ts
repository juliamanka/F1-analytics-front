import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error?: string;

  form = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
  
    this.loading = true;
    this.error = undefined; 
  
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
  
        const backendMessage =
          err.error?.message ||
          err.error?.title ||
          err.error ||
          'Invalid username or password. Please try again.';
  
        this.error = backendMessage;
        this.loading = false;
      },
    });
  }
}