import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCategory, Tab } from '../../../MODEL/MODEL';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { InventorySettingsComponent } from '../Tabs/inventory-settings/inventory-settings.component';
import { SaleSettingsComponent } from '../Tabs/sale-settings/sale-settings.component';
import { VersionControlComponent } from '../Tabs/version-control/version-control.component';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  activeTab: string = 'inventory';

  // Array of tabs
  tabs: Tab[] = [
    { id: 'inventory', label: 'Inventory Settings', component: InventorySettingsComponent },
    { id: 'sale', label: 'Sale Settings', component: SaleSettingsComponent },
    { id: 'version', label: 'Version Control', component: VersionControlComponent }
  ];

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

      applyHover(event: MouseEvent) {
  const el = event.target as HTMLElement;
  if (!el) return;
  el.style.background = 'var(--tab-hover-bg)';  
}

removeHover(event: MouseEvent) {
  const el = event.target as HTMLElement;
  if (!el) return;
  el.style.background = 'transparent';
}

}
