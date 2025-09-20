import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlertComponent } from './components/alert/alert.component';
import { DesignComponent } from './components/design/design.component';
import { ColorserviceService } from './services/colorservice.service';
import * as AOS from 'aos';
import { HeaderComponent } from "./components/header/header.component";
import { UserinfowithloginService } from './services/userinfowithlogin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    AlertComponent,
    DesignComponent,
    HeaderComponent
  ],
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'   // ✅ now points to external file
})
export class AppComponent implements OnInit {
  selectedColor: string = '';
  currentYear: number = new Date().getFullYear();
  isLoggedIn: boolean = false;

  constructor(
    private colorService: ColorserviceService,
    private userService: UserinfowithloginService
  ) {
    this.userService.loggedIn$.subscribe(state => {
      this.isLoggedIn = state;
      // You can re-render navbar/sidebar automatically
    });
  }

  ngOnInit() {debugger
    if (typeof window !== 'undefined') {
      AOS.init();
    }

    this.colorService.selectedColor$.subscribe(color => {
      this.selectedColor = color;
    });

    this.isLoggedIn = this.userService.isLoggedIn();
  }
  
   public title = 'flexierp-frontend';
}
