import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, NgIf],
  template: `
    <mat-toolbar color="primary">
      <span>Measurements Dashboard</span>
      <span class="spacer"></span>

      <a mat-button routerLink="/">Dashboard</a>
      <a mat-button routerLink="/series" *ngIf="auth.isAuthenticated()">Series</a>
      <a mat-button routerLink="/change-password" *ngIf="auth.isAuthenticated()">Change Password</a>
      <a mat-button routerLink="/login" *ngIf="!auth.isAuthenticated()">Login</a>
      <a mat-button routerLink="/register" *ngIf="!auth.isAuthenticated()">Register</a>
      <button mat-button (click)="logout()" *ngIf="auth.isAuthenticated()">Logout</button>
    </mat-toolbar>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    mat-toolbar { position: sticky; top: 0; z-index: 10; }
    .spacer { flex: 1 1 auto; }
    .content { padding: 20px; }
  `]
})
export class ShellComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}