import { CommonModule } from '@angular/common';
import { Component, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tab } from '../../../MODEL/MODEL';
import { AddSaleComponent } from '../Tabs/add-sale/add-sale.component';
import { SaleReportComponent } from '../Tabs/sale-report/sale-report.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  // 🔹 Tabs array (future-proof)
  tabs: Tab[] = [
    { id: 'add', label: 'Make Sale', component: AddSaleComponent },
    { id: 'report', label: 'Sale Report', component: SaleReportComponent }
    // 🔹 Add more tabs here easily
  ];

  activeTab: string = 'add';

  switchTab(tabKey: string) {
    this.activeTab = tabKey;
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
