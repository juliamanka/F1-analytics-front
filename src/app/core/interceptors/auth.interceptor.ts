import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  const snack = inject(MatSnackBar);
  const router = inject(Router);

  const token = auth.getToken();

  if (token && auth.isTokenExpired(token)) {
    auth.logout();
    snack.open('Session expired. Please log in again.', 'Close', { duration: 4000 });
    router.navigate(['/login']);
    return throwError(() => new Error('JWT expired'));
  }

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        snack.open('Unauthorized. Please log in again.', 'Close', { duration: 4000 });
        auth.logout();
        router.navigate(['/login']);
      } else if (err.status === 403) {
        snack.open('You are not authorized to perform this action.', 'Close', { duration: 4000 });
      }
      return throwError(() => err);
    })
  );
}