import 'zone.js'; // required for Angular change detection

import { bootstrapApplication } from '@angular/platform-browser';
import { ShellComponent } from './app/layout/shell.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';     // ✅ new
import { MatButtonModule } from '@angular/material/button';     // ✅ new

bootstrapApplication(ShellComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      HttpClientModule,
      MatNativeDateModule,
      MatDialogModule,  // ✅ add
      MatButtonModule   // ✅ add (for dialog buttons)
    )
  ]
}).catch(err => console.error(err));