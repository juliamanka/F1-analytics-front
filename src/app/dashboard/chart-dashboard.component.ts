import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MeasurementsService } from '../core/services/measurements.service';
import { SeriesService } from '../core/services/series.service';
import { SeriesDto } from '../models/series.dto';
import { MeasurementDto } from '../models/measurement.dto';
import { MeasurementsDashboardViewComponent } from '../measurements-dashboard-view/measurements-dashboard-view.component';

@Component({
  standalone: true,
  selector: 'app-chart-dashboard',
  imports: [NgIf, MatButtonModule, MeasurementsDashboardViewComponent],
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.scss']
})
export class ChartDashboardComponent implements OnInit {
  private measurements = inject(MeasurementsService);
  private seriesSvc = inject(SeriesService);

  results: MeasurementDto[] = [];
  series: SeriesDto[] = [];

  ngOnInit() {
    this.seriesSvc.list().subscribe({
      next: (s) => {
        this.series = s;
        this.measurements.listAll({ all: true }).subscribe((r) => (this.results = r));
      },
      error: (err) => console.error('Error loading series:', err)
    });
  }

  printCurrentView() {
    window.print();
  }
}