import { Component, HostListener, OnInit } from '@angular/core';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private userInfo: UserinfowithloginService
  ) { }
  public username: string = 'Guest';
  ngOnInit() {
    this.username = this.userInfo.getUserName() || 'Guest';
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {  // closes if clicked outside
      this.isDropdownOpen = false;
    }
  }
  onLogout() {
    // TODO: Implement logout logic here
    console.log('Logout clicked');
  }

  isDropdownOpen = false;

  openProfile() {
    this.router.navigate(['/profileview']);
    this.isDropdownOpen = false;
  }

  openSettings() {
    this.router.navigate(['/settings']);
    this.isDropdownOpen = false;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
