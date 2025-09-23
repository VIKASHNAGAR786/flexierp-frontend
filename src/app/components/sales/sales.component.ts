import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddSaleComponent } from "./add-sale/add-sale.component";

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule, AddSaleComponent],
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