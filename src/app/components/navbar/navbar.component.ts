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
import { CommonService } from '../../services/common.service';
import { AlertService } from '../../services/alert.service';


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
    { label: 'Accounting', path: '/accounts', icon: 'bi bi-bank' },
    { label: 'Customers', path: '/customers', icon: 'bi bi-people' },
    { label: 'Vendors', path: '/vendors', icon: 'bi bi-truck' },
    { label: 'Settings', path: '/settings', icon: 'bi bi-gear' },
  ];

futureLinks = [
  { label: 'Reports', path: '/reports', icon: 'bi bi-graph-up-arrow', badge: 'Planned', badgeClass: 'bg-yellow-500 text-black' },
  // { label: 'Purchases', path: '/purchases', icon: 'bi bi-cart-check', badge: 'Planned', badgeClass: 'bg-yellow-500 text-black' },
  // { label: 'HR Management', path: '/hr', icon: 'bi bi-people-fill', badge: 'Planned', badgeClass: 'bg-yellow-500 text-black' },
  // { label: 'Payroll System', path: '/payroll', icon: 'bi bi-wallet2', badge: 'Planned', badgeClass: 'bg-yellow-500 text-black' },
  // { label: 'Support Tickets', path: '/support', icon: 'bi bi-headset', badge: 'Beta Soon', badgeClass: 'bg-gray-500 text-white' },
  // { label: 'Inventory Insights', path: '/inventory', icon: 'bi bi-bar-chart-line', badge: 'In Design', badgeClass: 'bg-gray-500 text-white' },
  // { label: 'Audit Logs', path: '/audit', icon: 'bi bi-clock-history', badge: 'Admin', badgeClass: 'bg-pink-500 text-white' },
];


  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private colorService: ColorserviceService,
    private userInfo: UserinfowithloginService,
    private commonservice: CommonService,
    private alertservices: AlertService
  ) {
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
    this.commonservice.logout().subscribe({
      next: (res) => {
        this.alertservices.showAlert("Server logout successful", "success");
      },
      error: (err) => {
        this.alertservices.showAlert("Server logout failed", "error");
      },
      complete: () => {

        if (isPlatformBrowser(this.platformId)) {
          localStorage.clear();
        }

        // Clear in-memory cached data
        this.userInfo.clear();

        this.isLoggedIn = false;
        // Navigate to login page after API call completes
        this.router.navigate(['/auth/login']).then(() => {
          window.location.reload(); // refresh the entire page
        });
      }
    });
  }

  checkLoginStatus() {
    if (isPlatformBrowser(this.platformId)) {
      this.userInfo.refresh(); // ✅ Always load latest from localStorage
      this.isLoggedIn = !!this.userInfo.getToken();
    }
  }

}
