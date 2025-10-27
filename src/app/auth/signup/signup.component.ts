import { Component } from '@angular/core';
import {  SignupService } from '../../services/signup.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RegisterUser } from '../../MODEL/MODEL';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule,CommonModule],
  providers: [SignupService]
})
export class SignupComponent {

  user: RegisterUser = {
    fullName: '',
    username: '',
    email: '',
    passwordHash: '',
    mobileNo: '',
    gender: '',
    dateOfBirth: new Date(),
    address: '',
    city: '',
    state: '',
    country: '',
    profileImageUrl: '',
    lastLoginAt: new Date(),
    isActive: true,
    isEmailVerified: false
  };

  constructor(private signupservice: SignupService,
     private alertService: AlertService,
    private router: Router) {}
    isLoading = false;
  signup() {
    if(this.user.passwordHash !== this.confirmPassword) {
      this.alertService.showAlert('Passwords do not match!', 'error');
      return;
    }
    this.signupservice.Register(this.user).subscribe(
      (response) => {
        console.log('✅ User registered:', response);
        this.alertService.showAlert('Signup successful!', 'success');
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        console.error('❌ Signup failed:', error);
        this.alertService.showAlert('Signup failed! Please try again.', 'error');
      }
    );
  }

  confirmPassword: string = '';
  field = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'User Name', name: 'userName', type: 'text' },
    { label: 'Password', name: 'password', type: 'text' },
    { label: 'Role', name: 'Role', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Company Name', name: 'companyName', type: 'text' },
    { label: 'Company Type', name: 'companyType', type: 'text' },
  ];

   goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  currentStep = 1;
  nextStep() {
  if (this.user.fullName && this.user.username && this.user.email && this.user.mobileNo) {
    this.currentStep = 2;
  } else {
    alert('Please fill all required fields before continuing.');
  }
}

prevStep() {
  this.currentStep = 1;
}

checkPasswordMatch() {
  // This triggers the class binding on input change
}

passwordClass() {
  if (!this.user.passwordHash && !this.confirmPassword) {
    return 'border-gray-300 focus:ring-purple-500 bg-white text-gray-800';
  } else if (this.user.passwordHash === this.confirmPassword) {
    return 'border-green-500 focus:ring-green-400 bg-white text-gray-800';
  } else {
    return 'border-red-500 focus:ring-red-400 bg-white text-gray-800';
  }
}
}
