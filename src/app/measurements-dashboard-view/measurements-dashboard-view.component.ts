import { Component, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MeasurementsService } from '../core/services/measurements.service';
import { MeasurementDto } from '../models/measurement.dto';
import { SeriesDto } from '../models/series.dto';
import { Chart, ChartConfiguration, registerables, ScatterDataPoint } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MeasurementFormComponent } from '../measurement-form/measurement-form.comopnent';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-measurements-dashboard-view',
  standalone: true,
  imports: [
    NgIf, NgFor, FormsModule, DatePipe, NgChartsModule,
    MatPaginatorModule, MatTableModule,
    MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule, MatIconModule 
  ],  
  templateUrl: './measurements-dashboard-view.component.html',
  styleUrls: ['./measurements-dashboard-view.component.scss']
})
export class MeasurementsDashboardViewComponent implements OnChanges {
  private measurements = inject(MeasurementsService);

  @Input() results: MeasurementDto[] = [];
  @Input() series: SeriesDto[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

selectedSeriesIds: string[] = [];
startDate?: Date;
endDate?: Date;

private dialog = inject(MatDialog);
private snack = inject(MatSnackBar);
protected auth = inject(AuthService);

applyFilters() {
  const toLocalDateString = (d?: Date) =>
    d ? d.toISOString().split('T')[0] : undefined;

   const filter = {
    seriesIds: this.selectedSeriesIds.length ? this.selectedSeriesIds : undefined,
    startDate: toLocalDateString(this.startDate),
    endDate: toLocalDateString(this.endDate)
  };

  this.measurements.listAll(filter).subscribe({
    next: (data) => {
      this.results = data
        .slice()
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      this.buildChart();
      this.updatePage();
    },
    error: (err) => console.error('Error loading filtered data:', err)
  });
}

resetFilters() {
  this.selectedSeriesIds = [];
  this.startDate = undefined;
  this.endDate = undefined;

  this.applyFilters();
}

  displayedColumns = ['seriesName', 'value', 'timestamp'];
  pagedData: MeasurementDto[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalCount = 0;

  chartData: ChartConfiguration['data'] = { datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 20, bottom: 30, left: 15, right: 15 } },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 16,
          font: {
            size: 13,
            weight: 500
          }
        }
      },
      tooltip: { mode: 'nearest', intersect: false }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMM d, yyyy HH:mm',
          displayFormats: {
            second: 'HH:mm:ss',
            minute: 'HH:mm',
            hour: 'MMM d HH:mm',
            day: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        ticks: {
          autoSkip: true,
          maxRotation: 30,
          color: '#555',
          font: { size: 12 }
        },
        title: {
          display: true,
          text: 'Timestamp',
          font: { size: 14, weight: 'bold' }
        },
        grid: { color: '#eee' }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Value',
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          color: '#555',
          font: { size: 12 },
          callback: (value) => Number(value).toFixed(2)
        },
        grid: { color: '#eee' }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['results'] && this.results?.length) {
      this.buildChart();
      this.updatePage();
    }
  }

  // === CHART BUILDING ===
  buildChart() {
    if (!this.results?.length) {
      this.chartData = { datasets: [] };
      return;
    }

    const bySeries = new Map<string, MeasurementDto[]>();
    this.results.forEach(r => {
      if (!bySeries.has(r.seriesId)) bySeries.set(r.seriesId, []);
      bySeries.get(r.seriesId)!.push(r);
    });

    const allValues = this.results.map(r => Number(r.value)).filter(v => !isNaN(v));
    const minY = Math.min(...allValues);
    const maxY = Math.max(...allValues);
    const range = maxY - minY;
    const buffer = range * 0.1;
    
    if (!this.chartOptions) {
      this.chartOptions = {};
    }
    if (!this.chartOptions.scales) {
      this.chartOptions.scales = {};
    }
    
    const yScale = (this.chartOptions.scales['y'] ?? { type: 'linear' }) as any;
    
    if (Number.isFinite(minY) && Number.isFinite(maxY)) {
      yScale.min = minY - buffer;
      yScale.max = maxY + buffer;
    }
    
    this.chartOptions.scales['y'] = yScale;

    this.chartData = {
      datasets: Array.from(bySeries.entries()).map(([seriesId, arr]) => {
        const s = this.series.find(x => x.seriesId === seriesId);
        const data: ScatterDataPoint[] = arr
          .filter(r => r.timestamp && !isNaN(new Date(r.timestamp).getTime()))
          .map(r => ({
            x: new Date(r.timestamp).getTime(),
            y: Number(r.value)
          }));

        return {
          label: s?.name ?? seriesId,
          data,
          showLine: true,
          borderColor: s?.color || '#3f51b5',
          backgroundColor: s?.color || '#3f51b5',
          pointRadius: 2,
          tension: 0.2
        } as any;
      })
    };

    setTimeout(() => this.chart?.chart?.update(), 100);
  }

  updatePage() {
    this.totalCount = this.results.length;
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.results.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePage();
  }

  printCurrentView() {
    window.print();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(MeasurementFormComponent, {
      width: '420px',
      data: null
    });
  
    dialogRef.componentInstance.seriesOptions = this.series;
    dialogRef.componentInstance.saved.subscribe(() => this.applyFilters());
  }
  
  openEditDialog(m: MeasurementDto) {
    const dialogRef = this.dialog.open(MeasurementFormComponent, {
      width: '420px',
      data: m
    });
  
    dialogRef.componentInstance.measurement = m;
    dialogRef.componentInstance.seriesOptions = this.series;
    dialogRef.componentInstance.saved.subscribe(() => this.applyFilters());
  }
  
  deleteMeasurement(m: MeasurementDto) {
    if (!confirm(`Delete measurement for ${m.seriesName}?`)) return;
    this.measurements.remove(m.id).subscribe({
      next: () => {
        this.snack.open('Measurement deleted', 'Close', { duration: 2000 });
        this.applyFilters();
      },
      error: err => {
        console.error(err);
        this.snack.open('Failed to delete measurement', 'Close', { duration: 2500 });
      }
    });
  }
}