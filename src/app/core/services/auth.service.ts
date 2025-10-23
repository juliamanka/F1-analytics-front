import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest { userName: string; password: string; }
export interface LoginResponse { token?: string; Token?: string; expiration?: string; Expiration?: string; }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string; }
export interface RegisterRequest { userName: string, email: string, password: string}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;


  private _token = signal<string | null>(localStorage.getItem('token'));
  readonly isLoggedIn = computed(() => !!this._token());

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
  }
}