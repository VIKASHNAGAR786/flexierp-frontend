// login.component.ts
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../components/alert/alert.component';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { LoginService, LoginRequest } from '../../services/login.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, AlertComponent],
  providers: [LoginService]
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  constructor(
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login() {
    this.loginService.login(this.loginData).subscribe({
      next: () => {
        this.alertService.showAlert('Login successful!', 'success');
        this.router.navigate(['components/product']);
      },
      error: () => {
        this.alertService.showAlert('Login failed! Please check your credentials.', 'error');
      }
    });
  }
}
