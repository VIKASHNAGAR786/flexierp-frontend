import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddProductComponent } from '../inventory/add-product/add-product.component';
import { ProductListComponent } from '../inventory/product-list/product-list.component';
import { Tab } from '../../MODEL/MODEL';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, AddProductComponent, ProductListComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

 products: any[] = [];


  onProductAdded(product: any) {
    this.products.push(product);
    this.activeTab = 'productlist'; // auto switch
  }


  activeTab: string = 'addproduct';
  
    // Array of tabs
    tabs: Tab[] = [
      { id: 'addproduct', label: 'Add Product', component: AddProductComponent },
      { id: 'productlist', label: 'Product List', component: ProductListComponent },
      { id: 'soldproduct', label: 'Sold Products', component: ProductListComponent },
    ];
  
    switchTab(tabId: string) {
      this.activeTab = tabId;
    }

}
