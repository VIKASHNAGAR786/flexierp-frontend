import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlertComponent } from './components/alert/alert.component';
import { DesignComponent } from './components/design/design.component';
import { WheelComponent } from './components/wheel/wheel.component';
import { ColorserviceService } from './services/colorservice.service';
import * as AOS from 'aos';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    AlertComponent,
    DesignComponent,
    // WheelComponent,
    HeaderComponent
],
  styleUrls: ['./app.component.css'],
  template: `
  <!-- Top Navbar -->
<header>
  <app-header></app-header>
</header>
    <!-- Animated Background Layer -->
    <app-design></app-design>

    <!-- Sidebar + Navigation -->
    <app-navbar></app-navbar>

    <!-- Main Content Wrapper (Pushes content to the right of sidebar) -->
    <div class="pt-20 md:pt-6 md:pl-64 min-h-screen bg-slate-100 text-gray-900 dark:bg-slate-900 dark:text-white transition-colors">
      <main class="p-4">
        <div class="relative z-10">
        <router-outlet></router-outlet>
        </div>
      </main>
    </div>

    <!-- Floating Color Wheel -->
    <!-- <app-wheel></app-wheel> -->

    <!-- Global Alert -->
    <app-alert></app-alert>

    <!-- Footer -->
    <footer class="text-white text-center py-3" [ngStyle]="{ 'background-color': selectedColor || '#198754' }">
      <div class="container">
        <p class="mb-1">🌱 <strong>AgriMandi</strong> - Empowering Farmers with Technology</p>
        <p class="mb-0">&copy; {{ currentYear }} AgriMandi. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class AppComponent implements OnInit {
  selectedColor: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(private colorService: ColorserviceService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      AOS.init();
    }

    this.colorService.selectedColor$.subscribe(color => {
      this.selectedColor = color;
    });
  }
public title = 'flexierp-frontend';
}
