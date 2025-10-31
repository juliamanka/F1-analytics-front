import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  registerForm = this.fb.group({
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      strongPasswordValidator()
    ]]
  });

  loading = false;
  success?: string;
  error?: string;

  register() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.auth.register(this.registerForm.value as any).subscribe({
      next: () => {
        this.success = 'Account successfully created!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.title ?? 'Registration failed';
        this.loading = false;
      }
    });
  }
}

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    const isLongEnough = value.length >= 8;

    const valid = hasUpper && hasLower && hasSpecial && isLongEnough;
    return valid ? null : { weakPassword: true };
  };
}