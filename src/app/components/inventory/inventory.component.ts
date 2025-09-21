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
 products: any[] = [
  {
    productID: 1,
    productCode: 'RICE001',
    barcode: '8901234567890',
    productName: 'Basmati Rice',
    productCategory: 'Grains',
    productDescription: 'Premium long-grain basmati rice.',
    reorderQuantity: 50,
    stock: 100,
    packedWeight: 5.0,
    packedHeight: 10.0,
    packedWidth: 20.0,
    packedDepth: 30.0,
    refrigerated: false,
    location: {
      locationID: 1,
      locationName: 'Main Warehouse',
      locationAddress: '123 Storage St, City, Country'
    },
    warehouse: {
      warehouseID: 1,
      warehouseName: 'Warehouse A',
      isRefrigerated: false
    }
  },
  {
    productID: 2,
    productCode: 'WHEAT001',
    barcode: '8909876543210',
    productName: 'Whole Wheat Flour',
    productCategory: 'Flour',
    productDescription: 'Stone-ground whole wheat flour.',
    reorderQuantity: 30,
    stock: 20,
    packedWeight: 2.5,
    packedHeight: 8.0,
    packedWidth: 15.0,
    packedDepth: 25.0,
    refrigerated: false,
    location: {
      locationID: 1,
      locationName: 'Main Warehouse',
      locationAddress: '123 Storage St, City, Country'
    },
    warehouse: {
      warehouseID: 2,
      warehouseName: 'Warehouse B',
      isRefrigerated: false
    }
  },
  {
    productID: 3,
    productCode: 'MILK001',
    barcode: '8901122334455',
    productName: 'Full Cream Milk',
    productCategory: 'Dairy',
    productDescription: 'Fresh full cream milk in 1L pack.',
    reorderQuantity: 100,
    stock: 120,
    packedWeight: 1.0,
    packedHeight: 20.0,
    packedWidth: 10.0,
    packedDepth: 10.0,
    refrigerated: true,
    location: {
      locationID: 2,
      locationName: 'Cold Storage',
      locationAddress: '45 Dairy Lane, City, Country'
    },
    warehouse: {
      warehouseID: 3,
      warehouseName: 'Warehouse C',
      isRefrigerated: true
    }
  },
  {
    productID: 3,
    productCode: 'MILK001',
    barcode: '8901122334455',
    productName: 'Full Cream Milk',
    productCategory: 'Dairy',
    productDescription: 'Fresh full cream milk in 1L pack.',
    reorderQuantity: 100,
    stock: 120,
    packedWeight: 1.0,
    packedHeight: 20.0,
    packedWidth: 10.0,
    packedDepth: 10.0,
    refrigerated: true,
    location: {
      locationID: 2,
      locationName: 'Cold Storage',
      locationAddress: '45 Dairy Lane, City, Country'
    },
    warehouse: {
      warehouseID: 3,
      warehouseName: 'Warehouse C',
      isRefrigerated: true
    }
  },
  {
    productID: 3,
    productCode: 'MILK001',
    barcode: '8901122334455',
    productName: 'Full Cream Milk',
    productCategory: 'Dairy',
    productDescription: 'Fresh full cream milk in 1L pack.',
    reorderQuantity: 100,
    stock: 120,
    packedWeight: 1.0,
    packedHeight: 20.0,
    packedWidth: 10.0,
    packedDepth: 10.0,
    refrigerated: true,
    location: {
      locationID: 2,
      locationName: 'Cold Storage',
      locationAddress: '45 Dairy Lane, City, Country'
    },
    warehouse: {
      warehouseID: 3,
      warehouseName: 'Warehouse C',
      isRefrigerated: true
    }
  },
  {
    productID: 3,
    productCode: 'MILK001',
    barcode: '8901122334455',
    productName: 'Full Cream Milk',
    productCategory: 'Dairy',
    productDescription: 'Fresh full cream milk in 1L pack.',
    reorderQuantity: 100,
    stock: 120,
    packedWeight: 1.0,
    packedHeight: 20.0,
    packedWidth: 10.0,
    packedDepth: 10.0,
    refrigerated: true,
    location: {
      locationID: 2,
      locationName: 'Cold Storage',
      locationAddress: '45 Dairy Lane, City, Country'
    },
    warehouse: {
      warehouseID: 3,
      warehouseName: 'Warehouse C',
      isRefrigerated: true
    }
  }
];

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onProductAdded(product: any) {
    this.products.push(product);
    this.activeTab = 'list'; // auto switch
  }
}
