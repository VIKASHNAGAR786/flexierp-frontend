import {
  Component,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ColorserviceService } from '../../services/colorservice.service';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
   imports: [
    CommonModule,
    RouterModule
  ],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  sidebarVisible = true;
  selectedColor = '';

  // Navigation Links
  coreLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Inventory', path: '/inventory', icon: 'bi bi-box-seam' },
    { label: 'Sales', path: '/sales', icon: 'bi bi-cash-coin' },
    { label: 'Customers', path: '/customers', icon: 'bi bi-people' },
    { label: 'Vendors', path: '/vendors', icon: 'bi bi-truck' },
    { label: 'Settings', path: '/settings', icon: 'bi bi-gear' },
  ];
  
  futureLinks = [
    { label: 'Reports', path: '/reports', icon: 'bi bi-graph-up-arrow' },
    { label: 'Purchases', path: '/purchases', icon: 'bi bi-cart-check' },
    { label: 'Accounting', path: '/accounts', icon: 'bi bi-bank' },
    { label: 'HR Management', icon: 'bi bi-people-fill', badge: 'Planned', badgeClass: 'bg-yellow-500 text-black' },
    { label: 'Payroll System', icon: 'bi bi-wallet2', badge: 'Planned', badgeClass: 'bg-yellow-500 text-black' },
    { label: 'Support Tickets', icon: 'bi bi-headset', badge: 'Beta Soon', badgeClass: 'bg-gray-500 text-white' },
    { label: 'Inventory Insights', icon: 'bi bi-bar-chart-line', badge: 'In Design', badgeClass: 'bg-gray-500 text-white' },
    { label: 'Audit Logs', icon: 'bi bi-clock-history', badge: 'Admin', badgeClass: 'bg-pink-500 text-white' },
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private colorService: ColorserviceService,
    private userInfo: UserinfowithloginService
  ){
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.checkLoginStatus());
  }

  ngOnInit(): void {
    // Update theme color
    this.colorService.selectedColor$.subscribe((color) => {
      this.selectedColor = color;
    });

    // Check login status on navigation
    this.checkLoginStatus();
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout() {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.clear();
  }

  // Clear in-memory cached data
  this.userInfo.clear();

  this.isLoggedIn = false;

  this.router.navigate(['/auth/login']).then(() => {
    window.location.reload(); // refresh the entire page
  });
}

checkLoginStatus() {
  if (isPlatformBrowser(this.platformId)) {
    this.userInfo.refresh(); // ✅ Always load latest from localStorage
    this.isLoggedIn = !!this.userInfo.getToken();
  }
}

}
