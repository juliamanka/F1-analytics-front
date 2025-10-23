import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <form [formGroup]="form" (ngSubmit)="submit()" style="padding:16px; display:grid; gap:12px; max-width:420px;">
    <mat-form-field appearance="outline">
      <mat-label>Current password</mat-label>
      <input matInput type="password" formControlName="currentPassword" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>New password</mat-label>
      <input matInput type="password" formControlName="newPassword" (keyup.enter)="submit()">
    </mat-form-field>
    <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Change</button>
  </form>
  `
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(){
    if(this.form.invalid) return;
    this.auth.changePassword(this.form.value as any).subscribe({ next: () => alert('Password changed') });
  }
}
