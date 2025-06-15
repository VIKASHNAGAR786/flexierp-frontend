import { Component } from '@angular/core';
import { FarmerService } from '../../services/signup.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule,CommonModule],
  providers: [FarmerService] // <-- Add this line
})
export class SignupComponent {
  farmer = {
  name: '',
  userName: '',
  password: '',
  role: '',
  email: '',
  companyName: '',
  companyType: '',

  };

  constructor(private farmerService: FarmerService, private alertService: AlertService) {}
  signup() {
    this.farmerService.Register(this.farmer).subscribe(
      (response) => {
        console.log('✅ Farmer registered:', response);
        this.alertService.showAlert('Signup successful!', 'success');
      },
      (error) => {
        console.error('❌ Signup failed:', error);
        this.alertService.showAlert('Signup failed! Please try again.', 'error');
      }
    );
  }
  field = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'User Name', name: 'userName', type: 'text' },
    { label: 'Password', name: 'password', type: 'text' },
    { label: 'Role', name: 'Role', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Company Name', name: 'companyName', type: 'text' },
    { label: 'Company Type', name: 'companyType', type: 'text' },
  ];
  
  testSuccess() {
    this.alertService.showAlert('Test success alert!', 'success');
  }

  testError() {
    this.alertService.showAlert('Test error alert!', 'error');
  }
}
