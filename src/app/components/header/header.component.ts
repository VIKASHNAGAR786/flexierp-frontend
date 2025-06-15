import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
onLogout() {
  // TODO: Implement logout logic here
  console.log('Logout clicked');
}
}
