// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';  // ✅ Import routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),   // ✅ use routes from app.routes.ts
    provideClientHydration(),
    provideHttpClient(withInterceptors([])),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ]
};
