import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <form [formGroup]="form" (ngSubmit)="submit()" style="padding:16px; display:grid; gap:12px; max-width:420px;">
    <mat-form-field appearance="outline">
      <mat-label>Username</mat-label>
      <input matInput formControlName="userName" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Password</mat-label>
      <input matInput type="password" formControlName="password" (keyup.enter)="submit()">
    </mat-form-field>
    <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Login</button>
  </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(){
    if (this.form.invalid) return;
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => alert('Login failed')
    });
  }
}