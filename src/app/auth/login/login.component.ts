// login.component.ts
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../components/alert/alert.component';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { LoginService, LoginRequest } from '../../services/login.service';
import { PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, AlertComponent, CommonModule],
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private userInfo: UserinfowithloginService,

  ) {}

   themeColor = '#2563eb'; // Tailwind blue-600 (you can change it here)
  themeHover = '#1d4ed8'; // Tailwind blue-700
  
  login() {
    this.loginService.login(this.loginData).subscribe({
      next: () => {
        this.alertService.showAlert('Login successful!', 'success');
        const userRole = this.userInfo.getUserRole();
        if (userRole === 'FARMER') {
          this.router.navigate(['components/product']);
        } else {
          this.router.navigate(['/buyer']);
        }
      },
      error: () => {
        this.alertService.showAlert('Login failed! Please check your credentials.', 'error');
      }
    });
  }

  testSuccess() {
    this.alertService.showAlert('Test success alert!', 'success');
  }

  testError() {
    this.alertService.showAlert('Test error alert!', 'error');
  }
}
