import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProfileViewComponent {
  // Dummy data - later connect with backend
  username = 'John Doe';
  email = 'john.doe@example.com';
  phone = '+91 98765 43210';

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
