import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { ShellComponent } from './app/layout/shell.component';
import { appConfig } from './app/app.config';   

bootstrapApplication(ShellComponent, appConfig)
  .catch(err => console.error(err));