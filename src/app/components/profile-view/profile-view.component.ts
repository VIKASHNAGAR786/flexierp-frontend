import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProfileViewComponent implements OnInit {
  constructor(
    private userInfo: UserinfowithloginService
  ) { }
  // Dummy data - later connect with backend
  username = '';
  email = 'john.doe@example.com';
  phone = '+91 00000 00000';
  
  ngOnInit() {
    this.username = this.userInfo.getUserName() || 'Guest';
    this.email = this.userInfo.getUserEmail() || 'john.doe@example.com';
    this.phone = this.userInfo.getUserMobileNo() || '+91 00000 00000';
  }
  showwditprofile = false;

  editableProfile : any = {};

  editingProfile() {
    this.showwditprofile = !this.showwditprofile;
  }
  closeEdit() {
    this.showwditprofile = false;
  }
  saveProfile() {
    // Save logic here
    this.showwditprofile = false;
  }
}
