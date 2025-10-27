import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: '',
    username: ''
  };

  themeColor = '#2563eb'; // Tailwind blue-600
  themeHover = '#1d4ed8'; // Tailwind blue-700

  // Loading flag to disable button
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userInfo: UserinfowithloginService,
  ) { }

  async login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.alertService.showAlert('Please fill in all fields!', 'error');
      return;
    }

    this.isLoading = true;

    try {
      // Using async/await for the API call
      const response = await this.loginService.login(this.loginData).toPromise();

      // If login succeeds
      this.alertService.showAlert('Login successful!', 'success');
      this.userInfo.setLoggedIn(true);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.alertService.showAlert('Login failed! Please check your credentials.', 'error');
    } finally {
      this.isLoading = false; // Re-enable button regardless of success or failure
    }
  }

  goToSignup() {
    this.router.navigate(['/auth/signup']); // navigates to the signup component
  }

  
}
