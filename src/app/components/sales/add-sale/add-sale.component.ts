import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanBarcodeComponent } from "../scan-barcode/scan-barcode.component";
import { SaleserviceService } from '../../../services/saleservice.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductByBarcodeDTO } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ScanBarcodeComponent],
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent {

  saleProduct: ProductByBarcodeDTO | any = {};

  cart: any[] = [];
  customer: any = { name: '' };
  paymentMethod: string = 'Cash';
  grandTotal: number = 0;

  constructor(
    private saleservice: SaleserviceService,
    private alertservice: AlertService
  ) { }

  // -------------------------------
  // New method: Fetch product by barcode
  fetchProductByBarcode(barcode: string) {
    if (!barcode) return;

    this.saleservice.GetProductByBarcode(barcode)
      .pipe(
        catchError(err => {
          console.error("Error fetching product:", err);
          return of(null);
        })
      )
      .subscribe((product: ProductByBarcodeDTO | null) => {
        if (product) {
          this.saleProduct = product;
        } else {
          alert('Product not found');
          this.saleProduct = {
            barcode: '',
            name: '',
            qty: 1,
            price: 100,
            discount: 0,
            tax: 0
          };
        }
      });
  }

  // -------------------------------
 addToCart() {
  if (!this.saleProduct.productID || !this.saleProduct.productName) {
    alert('Please enter valid product details');
    return;
  }

  const price = this.saleProduct.sellingPrice ?? 0;
  const discountAmt = (price * (this.saleProduct.discount ?? 0)) / 100;
  const taxAmt = (price * (this.saleProduct.taxRate ?? 0)) / 100;
  const finalPrice = price - discountAmt + taxAmt;

  const weight = this.saleProduct.packedWeight;
  const name = `${this.saleProduct.productName ?? ''}${weight ? ` (${weight} kg)` : ''}`;

  // 🔹 Check if product already exists in cart by productID
  const existingItem = this.cart.find(item => item.productID === this.saleProduct.productID);

  if (existingItem) {
    // Instead of increasing qty → just alert
    this.alertservice.showAlert(`"${this.saleProduct.productName}" is already in the cart.`, 'warning');
    return;
  }

  // 🔹 If not exists → add as new item
  const newItem = {
    productID: this.saleProduct.productID,
    name: name,
    qty: 1,
    total: finalPrice,
    weight: weight,
    discountAmt: discountAmt,
    taxAmt: taxAmt,
    sellingPrice: price,
  };

  this.cart.push(newItem);
  this.updateGrandTotal();

  // Reset for next scan
  this.saleProduct = {
    barcode: '',
    name: '',
    qty: 1,
    price: 100,
    discount: 0,
    tax: 0
  };
}


  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.updateGrandTotal();
  }

  saveProduct() {
    if (this.saleProduct.name && this.saleProduct.price) {
      const item = {
        name: this.saleProduct.name,
        qty: 1,
        price: this.saleProduct.price,
        discount: this.saleProduct.discount || 0,
        tax: this.saleProduct.tax || 0,
        total: this.calculateTotal(this.saleProduct)
      };
      this.cart.push(item);
      this.updateGrandTotal();
      this.saleProduct = {};
    }
  }

  submitSale() {
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
    let total = product.price || 0;
    if (product.discount) total -= (total * product.discount) / 100;
    if (product.tax) total += (total * product.tax) / 100;
    return total;
  }

  updateGrandTotal() {
    this.grandTotal = this.cart.reduce((sum, item) => sum + item.total, 0);
  }
}
