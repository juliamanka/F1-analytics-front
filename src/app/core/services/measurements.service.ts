import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { MeasurementDto } from '../../models/measurement.dto';
import { PagedResult } from 'src/app/models/paged-result.dto';
import { Observable } from 'rxjs';

export interface MeasurementFilter {
  seriesId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

@Injectable({ providedIn: 'root' })
export class MeasurementsService {
  private api = inject(ApiService);

  listPaged(filter: any): Observable<PagedResult<MeasurementDto>> {
    const params: any = {};

    if (Array.isArray(filter.seriesIds)) params['SeriesIds'] = filter.seriesIds;
    if (filter.startDate) params['StartDate'] = filter.startDate;
    if (filter.endDate) params['EndDate'] = filter.endDate;
    if (filter.page) params['Page'] = filter.page;
    if (filter.pageSize) params['PageSize'] = filter.pageSize;

    return this.api.get<PagedResult<MeasurementDto>>('/measurement', params);
  }

  listAll(filter: any): Observable<MeasurementDto[]> {
    const params: any = {};

    if (Array.isArray(filter.seriesIds)) params['SeriesIds'] = filter.seriesIds;
    if (filter.startDate) params['StartDate'] = filter.startDate;
    if (filter.endDate) params['EndDate'] = filter.endDate;

    return this.api.get<MeasurementDto[]>('/measurement/all', params);
  }

  get(id: number){ return this.api.get<MeasurementDto>(`/measurement/${id}`); }
  create(payload: { seriesId: string; timestamp: string; value: number; }){
    return this.api.post<MeasurementDto>('/measurement', payload);
  }
  update(id: number, payload: Partial<{ seriesId: string; timestamp: string; value: number; notes?: string; }>){
    return this.api.put<void>(`/measurement/${id}`, payload);
  }
  remove(id: number){ return this.api.delete<void>(`/measurement/${id}`); }
  export(filter: MeasurementFilter = {}){
    const params = new URLSearchParams(filter as any).toString();
    window.open(`${location.origin}/api/measurement/export?${params}`, '_blank');
  }
}
