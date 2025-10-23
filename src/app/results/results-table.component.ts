import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common';
import { MeasurementDto } from '../models/measurement.dto';

@Component({
  selector: 'app-results-table',
  standalone: true,
  imports: [NgFor, DatePipe],
  template: `
  <table class="results-table">
    <thead><tr><th>Series</th><th>Value</th><th>Timestamp</th></tr></thead>
    <tbody>
      <tr *ngFor="let r of results" (click)="rowClick.emit(r)" [class.active]="r.id === activeId">
        <td>{{r.seriesId}}</td>
        <td>{{r.value}}</td>
        <td>{{r.timestamp | date:'short'}}</td>
      </tr>
    </tbody>
  </table>
  `,
  styles: [`
    .results-table { width:100%; border-collapse: collapse; }
    .results-table th, .results-table td { padding:8px; border-bottom: 1px solid #eee; }
    .results-table tr.active { background: rgba(25,118,210,0.1); }
    .results-table tr { cursor: pointer; }
  `]
})
export class ResultsTableComponent {
  @Input() results: MeasurementDto[] = [];
  @Input() activeId: number | null = null;
  @Output() rowClick = new EventEmitter<MeasurementDto>();
}
