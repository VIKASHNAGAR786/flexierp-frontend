import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventorySettingsComponent } from '../settings/inventory-settings/inventory-settings.component';
import { SaleSettingsComponent } from '../settings/sale-settings/sale-settings.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { Tab } from '../../MODEL/MODEL';


@Component({
  selector: 'app-customers',
 imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  activeTab: string = 'Customer';
  
    // Array of tabs
    tabs: Tab[] = [
      { id: 'Customer', label: 'Customer List', component: CustomerListComponent },
    ];
  
    switchTab(tabId: string) {
      this.activeTab = tabId;
    }
}
