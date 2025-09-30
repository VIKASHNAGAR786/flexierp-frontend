import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private userInfo: UserinfowithloginService,
     @Inject(PLATFORM_ID) private platformId: Object,
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
   if (isPlatformBrowser(this.platformId)) {
    localStorage.clear();
  }

  // Clear in-memory cached data
  this.userInfo.clear();
  this.router.navigate(['/auth/login']).then(() => {
    window.location.reload(); // refresh the entire page
  });
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
