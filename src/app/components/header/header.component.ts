import { Component, OnInit } from '@angular/core';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userInfo: UserinfowithloginService
  ) { }
  public username: string = 'Guest';  
  ngOnInit() {
    this.username = this.userInfo.getUserName() || 'Guest';
  }
onLogout() {
  // TODO: Implement logout logic here
  console.log('Logout clicked');
}
}
