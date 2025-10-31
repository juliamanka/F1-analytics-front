import { Routes } from '@angular/router';
import { ChartDashboardComponent } from './dashboard/chart-dashboard.component';
import { PrintViewComponent } from './print-view/print-view.component';
import { SeriesAdminComponent } from './series/series-admin.component';
import { SeriesFormComponent } from './series/series-form.component';
import { LoginComponent } from './auth/login.component';
import { ChangePasswordComponent } from './auth/change-password.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { MeasurementFormComponent } from './measurement-form/measurement-form.comopnent';

export const routes: Routes = [
  { path: '', component: ChartDashboardComponent },
  { path: 'print', component: PrintViewComponent },
  { path: 'series', component: SeriesAdminComponent, canActivate: [authGuard] },
  { path: 'series/:id', component: SeriesFormComponent, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'series/new', component: SeriesFormComponent,   canActivate: [authGuard]  },
  { path: 'series/:id', component: SeriesFormComponent,   canActivate: [authGuard]  },
  { path: 'measurements', component: MeasurementFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];