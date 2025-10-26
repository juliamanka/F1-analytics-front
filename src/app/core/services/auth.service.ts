import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {jwtDecode} from 'jwt-decode';

export interface LoginRequest { userName: string; password: string; }
export interface LoginResponse { token?: string; Token?: string; expiration?: string; Expiration?: string; }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string; }
export interface RegisterRequest { userName: string, email: string, password: string}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiBaseUrl;


  private _token = signal<string | null>(localStorage.getItem('token'));
  readonly isLoggedIn = computed(() => !!this._token());

  private logoutTimer?: any;

  isAuthenticated(): boolean {
    return !!this._token();
  }

  getToken(): string | null {
    return this._token();
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/account/login`, body).pipe(
      tap(res => {
        const token = res.token ?? res.Token ?? null;
        if (token) {
          localStorage.setItem('token', token);
          this._token.set(token);
        }
      })
    );
  }

  register(body: RegisterRequest): Observable<void> {
    const payload = {
      userName: body.userName,
      email: body.email,
      password: body.password,
    };

    return this.http.post<void>(`${this.base}/account/register`, payload);
  }

  changePassword(body: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/account/change-password`, body);
  }

  logout(): void {
    localStorage.removeItem('token');
    this._token.set(null);

    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    this.router.navigate(['/dashboard']); 
  }

  private getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return null;
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return false;
      const expiry = decoded.exp * 1000; 
      return Date.now() > expiry;
    } catch (err) {
      return true;
    }
  }

  private startAutoLogoutTimer(token: string) {
    const expiry = this.getTokenExpiration(token);
    if (!expiry) return;

    const expiresIn = expiry.getTime() - new Date().getTime();
    console.log(`🕒 Token will expire in ${Math.round(expiresIn / 1000)} seconds`);

    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    this.logoutTimer = setTimeout(() => {
      console.warn('🔒 Token expired, logging out automatically.');
      this.logout();
    }, expiresIn);
  }

  initAutoLogoutOnStartup() {
    const token = this.getToken();
    if (token) this.startAutoLogoutTimer(token);
  }
}