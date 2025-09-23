import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-sale',
  imports: [CommonModule, FormsModule],
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

  // Recalculate grand total
  updateGrandTotal() {
    this.grandTotal = this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  // Submit sale (dummy)
  submitSale() {
    console.log('🛒 Sale Submitted:', {
      customer: this.customer,
      paymentMethod: this.paymentMethod,
      cart: this.cart,
      grandTotal: this.grandTotal
    });

    alert('Sale submitted successfully!');
    this.clearSale();
  }

  // Clear the screen
  clearSale() {
    this.saleProduct = {
      barcode: '',
      name: '',
      qty: 1,
      price: 100,
      discount: 0,
      tax: 0
    };
    this.cart = [];
    this.customer = { name: '' };
    this.paymentMethod = 'Cash';
    this.grandTotal = 0;
  }
}