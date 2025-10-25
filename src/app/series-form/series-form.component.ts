import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SeriesService } from '../core/services/series.service';
import { SeriesDto } from '../models/series.dto';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-series-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './series-form.component.html',
  styleUrls: ['./series-form.component.scss']
})
export class SeriesFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seriesSvc = inject(SeriesService);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    id: [0],
    seriesId: ['', Validators.required],
    name: ['', Validators.required],
    unit: [''],
    color: ['#3f51b5'],
    description: [''],
    minValue: [0],
    maxValue: [0]
  });

  loading = false;
  editing = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.loading = true;
      this.seriesSvc.get(+id).subscribe({
        next: (s) => {
          this.form.patchValue(s);
          this.loading = false;
        },
        error: () => {
          this.snack.open('Failed to load series details', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (this.form.invalid) return;
  
    const payload = this.form.value as Partial<SeriesDto>;
    this.loading = true;
  
    let obs$: Observable<SeriesDto>;
    if (this.editing) {
      obs$ = this.seriesSvc.update(payload.id!, payload);
    } else {
      obs$ = this.seriesSvc.create(payload);
    }
  
    obs$.subscribe({
      next: () => {
        const msg = this.editing
          ? 'Series updated successfully!'
          : 'Series created successfully!';
        this.snack.open(msg, 'OK', { duration: 3000 });
        this.router.navigate(['/series']);
      },
      error: (err: any) => {
        console.error('❌ Error saving series:', err);
        const msg = err.error?.title ?? 'Error saving series';
        this.snack.open(msg, 'Close', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/series']);
  }
}