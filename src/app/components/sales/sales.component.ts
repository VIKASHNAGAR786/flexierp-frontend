import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddSaleComponent } from "./add-sale/add-sale.component";
import { ScanBarcodeComponent } from './scan-barcode/scan-barcode.component';

@Component({
  selector: 'app-sales',
  standalone:true,
  imports: [CommonModule, FormsModule, AddSaleComponent, ScanBarcodeComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  // Current product being scanned/entered
    activeTab: string = 'add';
    switchTab(tab: string) {
    this.activeTab = tab;
  }

  MakeSale(saleitem: any) {
    console.log('Product added to cart:', saleitem);
  }
}