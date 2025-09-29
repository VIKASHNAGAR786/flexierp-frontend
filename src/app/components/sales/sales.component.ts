import { CommonModule } from '@angular/common';
import { Component, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddSaleComponent } from "./add-sale/add-sale.component";
import { ScanBarcodeComponent } from './scan-barcode/scan-barcode.component';
import { SaleReportComponent } from "./sale-report/sale-report.component";
import { Tab } from '../../MODEL/MODEL';

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
}
