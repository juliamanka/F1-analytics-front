import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementsService } from '../core/services/measurements.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MeasurementDto, CreateMeasurement, UpdateMeasurement } from '../models/measurement.dto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-measurement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,       
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss']
})
export class MeasurementFormComponent implements OnInit {
  @Input() measurement?: MeasurementDto;        
  @Input() seriesOptions: any[] = [];        
  @Output() saved = new EventEmitter<void>(); 

  form!: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: MeasurementsService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<MeasurementFormComponent>
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.measurement;

    this.form = this.fb.group({
      seriesId: [
        this.measurement?.seriesId || '',
        [Validators.required]
      ],
      value: [
        this.measurement?.value ?? '',
        [Validators.required, Validators.min(-5000), Validators.max(0)]
      ],
      timestamp: [
        this.measurement?.timestamp ? new Date(this.measurement.timestamp) : '',
        [Validators.required, notInFutureValidator]
      ]
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    if (this.isEditMode && this.measurement) {
      const payload: UpdateMeasurement = {
        seriesId: formValue.seriesId,
        value: formValue.value,
        timestamp: formValue.timestamp
      };

      this.service.update(this.measurement.id, payload).subscribe({
        next: () => {
          this.snack.open('Measurement updated successfully', 'Close', { duration: 2500 });
          this.saved.emit();
          this.dialogRef.close();
        },
        error: err => {
          console.error(err);
          this.snack.open('Failed to update measurement', 'Close', { duration: 3000 });
        },
        complete: () => (this.loading = false)
      });
    } else {
      const payload: CreateMeasurement = {
        seriesId: formValue.seriesId,
        value: formValue.value,
        timestamp: formValue.timestamp
      };

      this.service.create(payload).subscribe({
        next: () => {
          this.snack.open('Measurement added successfully', 'Close', { duration: 2500 });
          this.saved.emit();
          this.dialogRef.close();
        },
        error: err => {
          console.error(err);
          this.snack.open('Failed to add measurement', 'Close', { duration: 3000 });
        },
        complete: () => (this.loading = false)
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

export function notInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = new Date(control.value);
      return date.getTime() > Date.now()
        ? { futureDate: true }
        : null;
    };
  }