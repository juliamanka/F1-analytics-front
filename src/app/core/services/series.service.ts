import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { SeriesDto } from '../../models/series.dto';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  list(): Observable<SeriesDto[]> {
    return this.api.get<SeriesDto[]>('/series');
  }

  get(id: number): Observable<SeriesDto> {
    return this.api.get<SeriesDto>(`/series/${id}`);
  }

  create(payload: Partial<SeriesDto>): Observable<SeriesDto> {
    return this.api.post<SeriesDto>('/series', payload).pipe(
      tap(() => this.snack.open('Series successfully created', 'OK', { duration: 3000 })),
      catchError(err => {
        this.handleError(err, 'Failed to create series');
        return throwError(() => err);
      })
    );
  }

  update(id: number, payload: Partial<SeriesDto>): Observable<SeriesDto> {
    return this.api.put<SeriesDto>(`/series/${id}`, payload).pipe(
      tap(() => this.snack.open('Series successfully updated', 'OK', { duration: 3000 })),
      catchError(err => {
        this.handleError(err, 'Failed to update series');
        return throwError(() => err);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/series/${id}`).pipe(
      tap(() => this.snack.open('🗑️ Series deleted', 'OK', { duration: 3000 })),
      catchError(err => {
        this.handleError(err, 'Failed to delete series');
        return throwError(() => err);
      })
    );
  }

  private handleError(err: any, defaultMessage: string) {
    const message = err.error?.title ?? err.error?.message ?? defaultMessage;
    console.error('API Error:', err);
    this.snack.open(message, 'Close', { duration: 4000 });
  }
}