import { Component, OnInit, inject } from '@angular/core';
import { SeriesService } from '../core/services/series.service';
import { SeriesDto } from '../models/series.dto';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SeriesFormComponent } from './series-form.component';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, SeriesFormComponent],
  template: `
  <div style="padding:16px;">
    <h2>Series</h2>
    <button mat-raised-button color="primary" (click)="newSeries()">Add series</button>
    <app-series-form *ngIf="editing" [model]="editing" (save)="save($event)" (cancel)="editing=null"></app-series-form>
    <ul>
      <li *ngFor="let s of series">
        <span [style.color]="s.color">{{s.name}}</span>
        ({{s.seriesId}}) min={{s.minValue}}, max={{s.maxValue}}, unit={{s.unit}}
        <button mat-button (click)="edit(s)">Edit</button>
      </li>
    </ul>
  </div>
  `
})
export class SeriesAdminComponent implements OnInit {
  private service = inject(SeriesService);
  series: SeriesDto[] = [];
  editing: SeriesDto | null = null;
  ngOnInit(){ this.reload(); }
  reload(){ this.service.list().subscribe(s => this.series = s); }
  newSeries(){ this.editing = { id: 0, seriesId: '', name: '', description: '', minValue: 0, maxValue: 100, unit: 'N', color: '#1976d2', measurementType: 'Front Wing Downforce', measurementCount: 0 }; }
  edit(s: SeriesDto){ this.editing = { ...s }; }
  save(model: SeriesDto){
    const payload = { ...model };
    if (model.id && model.id !== 0) this.service.update(model.id, payload).subscribe(()=>{ this.editing=null; this.reload(); });
    else this.service.create(payload).subscribe(()=>{ this.editing=null; this.reload(); });
  }
}
