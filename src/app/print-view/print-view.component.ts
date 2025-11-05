import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MeasurementsService } from '../core/services/measurements.service';
import { SeriesService } from '../core/services/series.service';
import { SeriesDto } from '../models/series.dto';
import { MeasurementDto } from '../models/measurement.dto';
import { MeasurementsDashboardViewComponent } from '../measurements-dashboard-view/measurements-dashboard-view.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-print-view',
  imports: [NgIf, MeasurementsDashboardViewComponent],
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.scss']
})
export class PrintViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private measurements = inject(MeasurementsService);
  private seriesSvc = inject(SeriesService);

  results: MeasurementDto[] = [];
  series: SeriesDto[] = [];

  ngOnInit() {
    const seriesIds = this.route.snapshot.queryParamMap.getAll('seriesIds');
    const startDate = this.route.snapshot.queryParamMap.get('startDate') || undefined;
    const endDate = this.route.snapshot.queryParamMap.get('endDate') || undefined;

    this.seriesSvc.list().subscribe({
      next: (s) => {
        this.series = s;

        this.measurements.listAll({ seriesIds, startDate, endDate }).subscribe({
          next: (data) => {
            this.results = data.sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            setTimeout(() => {
              window.print();
              setTimeout(() => this.router.navigateByUrl('/'), 1000);
            }, 600);
          },
          error: (err) => console.error('Error loading measurements:', err)
        });
      },
      error: (err) => console.error('Error loading series:', err)
    });
  }
}