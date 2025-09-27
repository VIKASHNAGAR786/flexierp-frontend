import { Component } from '@angular/core';
import { Tab } from '../../MODEL/MODEL';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { CommonModule } from '@angular/common';
import { VendorsListComponent } from './vendors-list/vendors-list.component';

@Component({
  selector: 'app-vendors',
  imports: [CommonModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css'
})
export class VendorsComponent {
activeTab: string = 'addvendor';

  // Array of tabs
  tabs: Tab[] = [
    { id: 'addvendor', label: 'Add Vendor', component: AddVendorComponent },
    { id: 'vendorslist', label: 'Vendors List', component: VendorsListComponent },
  ];

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }
}
