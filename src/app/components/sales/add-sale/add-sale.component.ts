import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanBarcodeComponent } from "../scan-barcode/scan-barcode.component";
import { SaleserviceService } from '../../../services/saleservice.service';
import { catchError } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { ProductByBarcodeDTO } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';
import { Customer, generateReceiptpdf, Sale, SaleDetail } from '../../../MODEL/MODEL';
import { OldCustomerPopupComponent } from "../old-customer-popup/old-customer-popup.component";
import { BarcodeService } from '../../../services/barcode.service';
import { debug } from 'console';
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
  cart: any[] = [];
  customer: Customer | any = {};
  saledetails: SaleDetail[] | any = [];
  paymentMethod: string = 'Cash';
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
          this.barcode = this.saleProduct.barCode || '';
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

  editfromcartdata: ProductByBarcodeDTO[] = [];
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
    const detail: SaleDetail = {
      productID: this.saleProduct.productID,
      createdBy: 2 // or whoever is logged in
    };
    this.saledetails.push(detail);
    this.updateGrandTotal();
    this.editfromcartdata.push(this.saleProduct);

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

  MakeTheSale(): void {
    const sale: Sale = {
      saleDetails: this.saledetails,
      customer: this.customer,
      totalItems: this.cart.length,
      totalAmount: this.cart.reduce((sum, item) => sum + item.total, 0),
      totalDiscount: this.cart.reduce((sum, item) => sum + (item.discountAmt || 0), 0),
      orderDate: new Date()
    };
    this.saleservice.InsertSale(sale)
      .subscribe({
        next: (res) => {
          this.alertservice.showAlert('✅ Record Save successfully!', 'success');
          this.generateReceipt(this.barcode); // Generate receipt after successful sale
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

  // binding cutomer ID
  onCustomerSelected(customer: any) {
    this.customer = customer;
    this.saledata.customerID = customer.customerID;
    console.log('Selected customer:', customer);
  }

  // Add this property to track currently edited index
  editingIndex: number | null = null;

  // Call this when Edit button is clicked
  editCartItem(index: number) {
    this.editingIndex = index;
    const item = this.cart[index];
    // Prefill saleProduct so the form can show existing values
    this.saleProduct = this.editfromcartdata[index];
    this.updateGrandTotal();
    console.log(this.saleProduct);
    this.removeFromCart(index); // Remove item from cart for editing
  }
  showPdfPopup: boolean = false;
  pdfUrl: SafeResourceUrl | null = null; // store blob URL
  async generateReceipt(barcode: string) {debugger
    try {
      this.receiptPdfData.barcode = barcode;
      this.receiptPdfData.customer = this.customer;
      this.receiptPdfData.cart = this.cart;

      const blob = await firstValueFrom(this.pythonservice.generateReceiptPDF(this.receiptPdfData));
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob)); // store blob URL
      this.showPdfPopup = true; // show popup
      // If you want, you can revoke the URL later after some delay
      // setTimeout(() => window.URL.revokeObjectURL(url), 10000);

    } catch (error) {
      console.error('Error generating receipt PDF:', error);
    }
  }
  closePdfPopup() {
    this.showPdfPopup = false;
  }
}
