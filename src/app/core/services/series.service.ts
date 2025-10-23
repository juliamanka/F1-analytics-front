import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { SeriesDto } from '../../models/series.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private api = inject(ApiService);
  list(): Observable<SeriesDto[]> { return this.api.get<SeriesDto[]>('/series'); }
  get(id: number){ return this.api.get<SeriesDto>(`/series/${id}`); }
  create(payload: Partial<SeriesDto>){ return this.api.post<SeriesDto>('/series', payload); }
  update(id: number, payload: Partial<SeriesDto>){ return this.api.put<void>(`/series/${id}`, payload); }
}
