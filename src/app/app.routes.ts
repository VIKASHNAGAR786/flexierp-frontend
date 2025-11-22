// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SalesComponent } from './components/sales/sales.component';
import { SettingsComponent } from './components/settings/main/settings.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { NotesComponent } from './components/COMMON/notes/notes.component';
import { MyBankAccountComponent } from './components/BankAccount/my-bank-account/my-bank-account.component';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth routes (login/signup)
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },

  // Protected routes (require login)
  {
    path: '',
    canActivate: [AuthGuard], // Ensure all child routes are protected
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'profileview', component: ProfileViewComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'my-bank-account', component: MyBankAccountComponent },
    ]
  },

  // Wildcard route (any unknown path goes to dashboard)
  { path: '**', redirectTo: 'dashboard' },
];
