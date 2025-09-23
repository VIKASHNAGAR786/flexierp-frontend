import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanBarcodeComponent } from "./scan-barcode/scan-barcode.component";

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ScanBarcodeComponent],
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css'
})
export class AddSaleComponent {
// Current product being scanned/entered
  saleProduct: any = {
    barcode: '',
    name: '',
    qty: 1,
    price: 100,      // default price for testing
    discount: 0,     // %
    tax: 0           // %
  };

  // Cart items
  cart: any[] = [];

  // Customer & payment info
  customer: any = {
    name: ''
  };

  paymentMethod: string = 'Cash';

  // Grand total
  grandTotal: number = 0;

  // Add product to cart
  addToCart() {
    if (!this.saleProduct.name || this.saleProduct.qty <= 0) {
      alert('Please enter valid product details');
      return;
    }

    // Calculate total with discount & tax
    const price = this.saleProduct.price;
    const discountAmt = (price * this.saleProduct.discount) / 100;
    const taxAmt = (price * this.saleProduct.tax) / 100;
    const finalPrice = (price - discountAmt + taxAmt) * this.saleProduct.qty;

    const newItem = {
      ...this.saleProduct,
      total: finalPrice
    };

    this.cart.push(newItem);
    this.updateGrandTotal();

    // Reset saleProduct (keep price optional for next scan)
    this.saleProduct = {
      barcode: '',
      name: '',
      qty: 1,
      price: 100,
      discount: 0,
      tax: 0
    };
  }

  // Remove product from cart
  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.updateGrandTotal();
  }

  // Submit sale (dummy)
  saveProduct() {
  // Add current product to cart
  if (this.saleProduct.productName && this.saleProduct.sellingPrice) {
    const item = {
      name: this.saleProduct.productName,
      qty: 1,
      price: this.saleProduct.sellingPrice,
      discount: this.saleProduct.discount || 0,
      tax: this.saleProduct.taxRate || 0,
      total: this.calculateTotal(this.saleProduct)
    };
    this.cart.push(item);
    this.updateGrandTotal();

    // Reset product form
    this.saleProduct = {};
  }
}

submitSale() {
  // Final submission with customer + cart
  const saleData = {
    customer: this.customer,
    cart: this.cart,
    paymentMethod: this.paymentMethod,
    grandTotal: this.grandTotal
  };

  console.log("Submitting Sale:", saleData);
  // TODO: send to API
}

clearSale() {
  this.saleProduct = {};
  this.customer = {};
  this.cart = [];
  this.grandTotal = 0;
}

calculateTotal(product: any) {
  let total = product.sellingPrice || 0;
  if (product.discount) {
    total -= (total * product.discount) / 100;
  }
  if (product.taxRate) {
    total += (total * product.taxRate) / 100;
  }
  return total;
}

updateGrandTotal() {
  this.grandTotal = this.cart.reduce((sum, item) => sum + item.total, 0);
}

}