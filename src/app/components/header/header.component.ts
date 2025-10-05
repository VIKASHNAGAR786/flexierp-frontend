import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { AlertService } from '../../services/alert.service';

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
     private commonservice:CommonService,
     private alertservice:AlertService
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
   this.commonservice.logout().subscribe({
      next: (res) => {
        this.alertservice.showAlert("Server logout successful", "success");
      },
      error: (err) => {
        this.alertservice.showAlert("Server logout failed", "error");
      },
      complete: () => {

        if (isPlatformBrowser(this.platformId)) {
          localStorage.clear();
        }

        // Clear in-memory cached data
        this.userInfo.clear();

        // Navigate to login page after API call completes
        this.router.navigate(['/auth/login']).then(() => {
          window.location.reload(); // refresh the entire page
        });
      }
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
