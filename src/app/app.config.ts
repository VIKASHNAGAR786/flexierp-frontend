import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';

// ⛔️ Removed ProductinventoryComponent — it's standalone and lazy-loaded



const routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },

  // Catch-all for undefined routes
  { path: '**', redirectTo: '' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([])),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ]
};
