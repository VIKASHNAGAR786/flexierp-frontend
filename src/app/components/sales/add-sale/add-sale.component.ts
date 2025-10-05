
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanBarcodeComponent } from "../scan-barcode/scan-barcode.component";
import { SaleserviceService } from '../../../services/saleservice.service';
import { catchError } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { ProductByBarcodeDTO } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';
import { CartItemDTO, Customer, generateReceiptpdf, Sale, SaleDetail } from '../../../MODEL/MODEL';
import { OldCustomerPopupComponent } from "../old-customer-popup/old-customer-popup.component";
import { BarcodeService } from '../../../services/barcode.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ScanBarcodeComponent, OldCustomerPopupComponent],
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent {

  saleProduct: ProductByBarcodeDTO | any = {};
  saledata: Sale | any = {};
  cart: CartItemDTO[] = [];

  // ✅ FIX: Initialize customer with paymentMode = '' so placeholder shows
  customer: Customer | any = {
    paymentMode: ''
  };

  saledetails: SaleDetail[] | any = [];
  grandTotal: number = 0;
  receiptPdfData: generateReceiptpdf | any = {};
  barcode: string = '';

  constructor(
    private saleservice: SaleserviceService,
    private alertservice: AlertService,
    private pythonservice: BarcodeService,
    private sanitizer: DomSanitizer,
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
          if (this.saleProduct.availableQuantity === 0) {
            this.alertservice.showAlert("Product is out of stock", 'error');
          }
          this.saleProduct.packedDate = this.saleProduct.packedDate ? this.saleProduct.packedDate.split('T')[0] : '';
          this.barcode = this.saleProduct.barCode || '';
        } else {
          alert('Product not found');
          this.saleProduct = {
            barcode: '',
            name: '',
            qty: 0,
            price: 0,
            discount: 0,
            tax: 0
          };
        }
      });
  }

  editfromcartdata: ProductByBarcodeDTO[] = [];

  // -------------------------------
  addToCart() {
    if (!this.saleProduct.productID || !this.saleProduct.productName) {
      alert('Please enter valid product details');
      return;
    }

    

    const price = (this.saleProduct.sellingPrice ?? 0);
    const discountAmt = (this.saleProduct.discount ?? 0) * (this.saleProduct.quantity ?? 1);
    const taxAmt = (price * (this.saleProduct.taxRate ?? 0)) / 100;
    const finalPrice =  (this.saleProduct.sellingPrice ?? 0) * (this.saleProduct.quantity ?? 1);

    const weight = this.saleProduct.packedWeight;
    const name = `${this.saleProduct.productName ?? ''}${weight ? ` (${weight} kg)` : ''}`;

    // 🔹 Check if product already exists in cart by productID
    const existingItem = this.cart.find(item => item.productID === this.saleProduct.productID);

    if (existingItem) {
      this.alertservice.showAlert(`"${this.saleProduct.productName}" is already in the cart.`, 'warning');
      return;
    }

    const newItem: CartItemDTO = {
      productID: this.saleProduct.productID,
      name: name,
      qty: this.saleProduct.quantity,
      total: finalPrice,
      weight: this.saleProduct.weight,
      discountAmt: discountAmt,
      taxAmt: taxAmt,
      sellingPrice: price,
    };

    this.cart.push(newItem);
    const detail: SaleDetail = {
      productID: this.saleProduct.productID,
      createdBy: 2,
      productquantity: this.saleProduct.quantity
    };
    this.saledetails.push(detail);
    this.updateGrandTotal();
    this.editfromcartdata.push(this.saleProduct);

    this.customer.paymentMode = "";
    this.customer.totalAmt = this.grandTotal;
    this.customer.paidAmt = this.grandTotal;
    // Reset for next scan
    this.saleProduct = {
      barcode: '',
      name: '',
      qty: 0,
      price: 0,
      discount: 0,
      tax: 0
    };
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.updateGrandTotal();
  }

  clearSale() {
    this.saleProduct = {};
    this.customer = { paymentMode: '' }; // reset with empty paymentMode
    this.cart = [];
    this.grandTotal = 0;
  }

  calculateTotal(product: any) {
    let total = product.price || 0;
    if (product.discount) total -= (total * product.discount) / 100;
    if (product.tax) total += (total * product.tax) / 100;
    return total;
  }

  MakeTheSale(): void {
    const sale: Sale = {
      saleDetails: this.saledetails,
      customer: this.customer, // ✅ includes paymentMode now
      totalItems: this.cart.length,
      customerID:this.customer.customerID,
      totalAmount: this.cart.reduce((sum, item) => sum + item.total, 0),
      totalDiscount: this.cart.reduce((sum, item) => sum + (item.discountAmt || 0), 0),
      orderDate: new Date()
    };

    this.saleservice.InsertSale(sale)
      .subscribe({
        next: (res) => {
          this.alertservice.showAlert('✅ Record Save successfully!', 'success');
          this.generateReceipt(this.barcode);
          this.clearSale();
        },
        error: (err) => {
          this.alertservice.showAlert('Record Not Save', 'error');
        }
      });
  }

  updateGrandTotal() {
    this.grandTotal = this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  showOldCustomer = false;

  openOldCustomerSale() {
    this.showOldCustomer = true;
  }

  // binding customer ID
  onCustomerSelected(customer: any) {
    this.customer = customer;
    this.customer.paymentMode = "";
    this.customer.totalAmt = this.grandTotal;
    this.customer.paidAmt = this.grandTotal;
    this.saledata.customerID = customer.customerID;
    console.log('Selected customer:', customer);
  }

  editingIndex: number | null = null;

  editCartItem(index: number) {
    this.editingIndex = index;
    const item = this.cart[index];
    this.saleProduct = this.editfromcartdata[index];
    this.updateGrandTotal();
    console.log(this.saleProduct);
    this.removeFromCart(index);
  }

  showPdfPopup: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;
  pdfBlobUrl!: string; // Normal string for download/print
  async generateReceipt(barcode: string) {
    try {
      this.receiptPdfData.barcode = barcode;
      this.receiptPdfData.customer = this.customer;
      this.receiptPdfData.cart = this.cart;

      const blob = await firstValueFrom(this.pythonservice.generateReceiptPDF(this.receiptPdfData));

      // Create both versions
      this.pdfBlobUrl = URL.createObjectURL(blob); // raw blob URL
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfBlobUrl); // safe for iframe

      this.showPdfPopup = true;
    } catch (error) {
      console.error('Error generating receipt PDF:', error);
    }
  }
  closePdfPopup() {
    this.showPdfPopup = false;
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl); // cleanup
      this.pdfBlobUrl = '';
    }
  }

  downloadPdf() {
    if (this.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = this.pdfBlobUrl;
      link.download = 'party-statement.pdf';
      link.click();
    }
  }

  printPdf() {
    if (this.pdfBlobUrl) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = this.pdfBlobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
  }

  onPaidChange(value: number) {
    this.customer.paidAmt = value < 0 ? 0 : value;
    this.customer.balanceDue = this.customer.totalAmt - this.customer.paidAmt;
  }

  // Called when Balance Due changes
  onDueChange(value: number) {
    this.customer.balanceDue = value < 0 ? 0 : value;
    this.customer.paidAmt = this.customer.totalAmt - this.customer.balanceDue;
  }

}

