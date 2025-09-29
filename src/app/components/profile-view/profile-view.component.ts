import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent {
  // Dummy data - later connect with backend
  username = 'John Doe';
  email = 'john.doe@example.com';
  phone = '+91 98765 43210';
}
