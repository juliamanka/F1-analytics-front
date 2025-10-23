import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SeriesDto } from '../models/series.dto';

@Component({
  selector: 'app-series-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <form [formGroup]="form" (ngSubmit)="submit()" style="margin:12px 0; display:grid; gap:8px; max-width:640px;">
    <mat-form-field><mat-label>Series Code</mat-label>
      <input matInput formControlName="seriesId" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Name</mat-label>
      <input matInput formControlName="name" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Description</mat-label>
      <input matInput formControlName="description" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Min</mat-label>
      <input matInput type="number" formControlName="minValue" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Max</mat-label>
      <input matInput type="number" formControlName="maxValue" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Unit</mat-label>
      <input matInput formControlName="unit" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Color</mat-label>
      <input matInput formControlName="color" placeholder="#1976d2" (keyup.enter)="submit()">
    </mat-form-field>
    <mat-form-field><mat-label>Measurement Type</mat-label>
      <input matInput formControlName="measurementType" (keyup.enter)="submit()">
    </mat-form-field>
    <div style="display:flex; gap:8px;">
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      <button mat-button type="button" (click)="cancel.emit()">Cancel</button>
    </div>
  </form>
  `
})
export class SeriesFormComponent {
  private fb = new FormBuilder();
  @Input() set model(value: SeriesDto | null){ if (value) this.form.reset(value); }
  @Output() save = new EventEmitter<SeriesDto>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    id: [0],
    seriesId: ['', [Validators.required, Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    minValue: [0, Validators.required],
    maxValue: [100, Validators.required],
    unit: ['N', [Validators.required, Validators.maxLength(10)]],
    color: ['#1976d2', [Validators.required]],
    measurementType: ['Front Wing Downforce']
  });

  submit(){
    if(this.form.invalid) return;
    const v = this.form.value as SeriesDto;
    if (v.minValue > v.maxValue) { this.form.get('maxValue')?.setErrors({ range: true }); return; }
    this.save.emit(v);
  }
}
