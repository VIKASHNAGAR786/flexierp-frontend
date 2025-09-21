import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent {
  @Output() productAdded = new EventEmitter<any>();

 newProduct = {
  productID: 0,
  productCode: '',
  barcode: '',
  productName: '',
  productDescription: '',
  productCategory: '',
  reorderQuantity: 0,
  packedWeight: 0,
  packedHeight: 0,
  packedWidth: 0,
  packedDepth: 0,
  refrigerated: false,
  location: {
    locationID: 0,
    locationName: '',
    locationAddress: ''
  },
  warehouse: {
    warehouseID: 0,
    warehouseName: '',
    isRefrigerated: false
  },
  // Financial Fields
  purchasePrice: 0,   // Cost Price
  sellingPrice: 0,    // Retail Price
  taxRate: 0,         // e.g., 18% GST
  discount: 0         // Discount amount or %
};


  addProduct() {
    if (!this.newProduct.productName) {
      alert('Product Name is required!');
      return;
    }
    this.productAdded.emit({ ...this.newProduct });
    // Reset form
    this.newProduct = {
      productID: 0,
      productCode: '',
      barcode: '',
      productName: '',
      productDescription: '',
      productCategory: '',
      reorderQuantity: 0,
      packedWeight: 0,
      packedHeight: 0,
      packedWidth: 0,
      packedDepth: 0,
      refrigerated: false,
      location: {
        locationID: 0,
        locationName: '',
        locationAddress: ''
      },
      warehouse: {
        warehouseID: 0,
        warehouseName: '',
        isRefrigerated: false
      },
      // Financial Fields
  purchasePrice: 0,   // Cost Price
  sellingPrice: 0,    // Retail Price
  taxRate: 0,         // e.g., 18% GST
  discount: 0         // Discount amount or %
    };
  }
}
