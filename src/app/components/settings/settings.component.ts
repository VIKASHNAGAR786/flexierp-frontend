import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCategory } from '../../MODEL/MODEL';
import { InventoryService } from '../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { InventorySettingsComponent } from "./inventory-settings/inventory-settings.component";
import { SaleSettingsComponent } from "./sale-settings/sale-settings.component";

interface Tab {
  id: string;
  label: string;
  component: any;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InventorySettingsComponent, SaleSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  activeTab: string = 'inventory';

  // Array of tabs
  tabs: Tab[] = [
    { id: 'inventory', label: 'Inventory Settings', component: InventorySettingsComponent },
    { id: 'sale', label: 'Sale Settings', component: SaleSettingsComponent }
  ];

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }
}
