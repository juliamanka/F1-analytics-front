import { Component, OnInit, inject } from '@angular/core';
import { SeriesService } from '../core/services/series.service';
import { SeriesDto } from '../models/series.dto';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SeriesFormComponent } from './series-form.component';

@Component({
  standalone: true,
  selector: 'app-series-admin',
  imports: [
    CommonModule,
    NgIf,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    SeriesFormComponent
  ],
  templateUrl: './series-admin.component.html' ,
  styleUrls: ['./series-admin.component.scss']
})
export class SeriesAdminComponent implements OnInit {
  private service = inject(SeriesService);
  private snack = inject(MatSnackBar);

  series: SeriesDto[] = [];
  editing: SeriesDto | null = null;
  displayedColumns = ['name', 'seriesId', 'unit', 'minValue', 'maxValue', 'color', 'measurementType', 'actions'];

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.service.list().subscribe({
      next: s => this.series = s,
      error: () => this.snack.open('Failed to load series', 'Close', { duration: 3000 })
    });
  }

  newSeries() {
    this.editing = {
      id: 0, seriesId: '', name: '', description: '',
      minValue: 0, maxValue: 100, unit: 'N', color: '#1976d2',
      measurementType: 'Front Wing Downforce', measurementCount: 0
    };
  }

  edit(s: SeriesDto) {
    this.editing = { ...s };
  }

  save(model: SeriesDto) {
    const payload = { ...model };
    const request = model.id && model.id !== 0
      ? this.service.update(model.id, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.snack.open('Series saved successfully', 'OK', { duration: 2500 });
        this.editing = null;
        this.reload();
      },
      error: () => this.snack.open('Failed to save series', 'Close', { duration: 3000 })
    });
  }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this series?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open('🗑️ Series deleted', 'OK', { duration: 2500 });
        this.reload();
      },
      error: () => this.snack.open('Failed to delete series', 'Close', { duration: 3000 })
    });
  }
}