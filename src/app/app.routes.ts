import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [

    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/login', component: LoginComponent },
];
