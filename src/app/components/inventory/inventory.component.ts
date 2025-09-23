import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddProductComponent } from '../inventory/add-product/add-product.component';
import { ProductListComponent } from '../inventory/product-list/product-list.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, AddProductComponent, ProductListComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  activeTab: string = 'add';

  // dummy data for the product list view
 products: any[] = [];

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onProductAdded(product: any) {
    this.products.push(product);
    this.activeTab = 'list'; // auto switch
  }
}
