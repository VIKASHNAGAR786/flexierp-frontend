import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanBarcodeComponent } from "../scan-barcode/scan-barcode.component";
import { SaleserviceService } from '../../../services/saleservice.service';
import { catchError } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { ProductByBarcodeDTO } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';
import { CartItemDTO, Customer, generateReceiptpdf, Sale, SaleDetail, SaveChequePaymentDto } from '../../../MODEL/MODEL';
import { OldCustomerPopupComponent } from "../old-customer-popup/old-customer-popup.component";
import { BarcodeService } from '../../../services/barcode.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// 🟩 Added for extra charges handling
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../shared/tooltip.directive';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,   // ✅ Add this line
    ScanBarcodeComponent,
    OldCustomerPopupComponent,
    TooltipDirective
  ],
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})

export class AddSaleComponent {

  saleProduct: ProductByBarcodeDTO | any = {};
  saledata: Sale | any = {};
  cart: CartItemDTO[] = [];

  customer: Customer | any = {
    paymentMode: '',
    balanceDue: 0,
    paidAmt: 0,
    totalAmt: 0
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
    private fb: FormBuilder // 🟩 Added for creating extra charges form
  ) {
    this.extraChargesForm = this.fb.group({
      extraCharges: this.fb.array([]),
    });
  }

  // --------------------------------------
  // Existing code (unchanged)
  fetchProductByBarcode(barcode: string) {
    if (!barcode) return;

    this.saleservice.GetProductByBarcode(barcode)
      .pipe(catchError(err => {
        console.error("Error fetching product:", err);
        return of(null);
      }))
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

  
  addToCart() {
    if (!this.saleProduct.productID || !this.saleProduct.productName) {
      alert('Please enter valid product details');
      return;
    }

    const price = (this.saleProduct.sellingPrice ?? 0);
    const discountAmt = (this.saleProduct.discount ?? 0) * (this.saleProduct.quantity ?? 1);
    const taxAmt = (price * (this.saleProduct.taxRate ?? 0)) / 100;
    const finalPrice = (this.saleProduct.sellingPrice ?? 0) * (this.saleProduct.quantity ?? 1);

    const weight = this.saleProduct.packedWeight;
    const name = `${this.saleProduct.productName ?? ''}${weight ? ` (${weight} kg)` : ''}`;

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
    if(this.cart.length===0){
      this.totalExtraCharges = 0;
      this.extraCharges.clear();
      this.updateGrandTotal();
    }
  }

  clearSale() {
    this.saleProduct = {};
    this.customer = { paymentMode: '' };
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
      customerID: this.customer.customerID,
      totalAmount: this.cart.reduce((sum, item) => sum + item.total, 0), // 🟩 added extra charges
      totalDiscount: this.cart.reduce((sum, item) => sum + (item.discountAmt || 0), 0),
      orderDate: new Date(),
      extracharges: this.extraChargesForm.value.extraCharges.length ? this.extraChargesForm.value.extraCharges : null
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
    let productTotal = this.cart.reduce((sum, item) => sum + item.total, 0);
    productTotal += this.totalExtraCharges; // 🟩 include extra charges in grand total
    this.grandTotal = productTotal; // 🟩 include extra charges in grand total

     this.customer.paymentMode = "";
    this.customer.totalAmt = this.grandTotal;
    this.customer.paidAmt = this.grandTotal - (this.customer.balanceDue || 0);
  }

  showOldCustomer = false;
  openOldCustomerSale() {
    this.showOldCustomer = true;
  }

  onCustomerSelected(customer: any) {
    this.customer = customer;
    this.customer.paymentMode = "";
    this.customer.totalAmt = this.grandTotal;
    this.customer.paidAmt = this.grandTotal;
    this.customer.balanceDue = 0;
    this.saledata.customerID = customer.customerID;
  }

  editingIndex: number | null = null;

  editCartItem(index: number) {
    this.editingIndex = index;
    const item = this.cart[index];
    this.saleProduct = this.editfromcartdata[index];
    this.updateGrandTotal();
    this.removeFromCart(index);
  }

  showPdfPopup: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;
  pdfBlobUrl!: string;
  async generateReceipt(barcode: string) {
    try {
      this.receiptPdfData.barcode = barcode;
      this.receiptPdfData.customer = this.customer;
      this.receiptPdfData.cart = this.cart;

      const blob = await firstValueFrom(this.pythonservice.generateReceiptPDF(this.receiptPdfData));
      this.pdfBlobUrl = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfBlobUrl);
      this.showPdfPopup = true;
    } catch (error) {
      console.error('Error generating receipt PDF:', error);
    }
  }

  closePdfPopup() {
    this.showPdfPopup = false;
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl);
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
    if(this.customer.paidAmt <= 0){
     this.customer.cheque= this.resetCheque();
    }
  }

  onDueChange(value: number) {
    this.customer.balanceDue = value < 0 ? 0 : value;
    this.customer.paidAmt = this.customer.totalAmt - this.customer.balanceDue;
  }

  showChequePopup = false;
  cheque: SaveChequePaymentDto = this.resetCheque();

  onPaymentModeChange(event: any) {
    this.cheque = this.resetCheque();
    if (this.customer.paymentMode === '2') {
      this.showChequePopup = true;
    }
  }

  saveCheque() {
    console.log('Cheque Details:', this.cheque);
    this.showChequePopup = false;
    this.customer.chequepayment = this.cheque;
    this.customer.paidAmt = this.cheque.amount;
    this.customer.balanceDue = this.customer.totalAmt - this.customer.paidAmt;
  }

  cancelCheque() {
    this.showChequePopup = false;
    this.customer.paymentMode = "1";
    this.cheque = this.resetCheque();
  }

  resetCheque(): SaveChequePaymentDto {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return {
      chequeNumber: '',
      bankName: '',
      branchName: '',
      chequeDate: formattedDate,
      amount: 0,
      ifsc_Code: '',
      createdBy: 0
    };
  }


  // 🟩 Extra Charges Handling

  showExtraChargesPopup = false;
  extraChargesForm: FormGroup;
  totalExtraCharges = 0;

  get extraCharges(): FormArray {
    return this.extraChargesForm.get('extraCharges') as FormArray;
  }

  openExtraChargesPopup() {
    this.showExtraChargesPopup = true;
    if (this.extraCharges.length === 0) {
      this.addCharge();
    }
  }

  closeExtraChargesPopup() {
    this.showExtraChargesPopup = false;
  }

  addCharge() {
    const chargeGroup = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });

    this.extraCharges.push(chargeGroup);
    this.calculateTotalExtraCharges();
  }

  removeCharge(index: number) {
    this.extraCharges.removeAt(index);
    this.calculateTotalExtraCharges();
    
  }

  calculateTotalExtraCharges() {
    this.totalExtraCharges = this.extraCharges.controls
      .map((c) => c.get('amount')?.value || 0)
      .reduce((a, b) => a + b, 0);
      this.updateGrandTotal();
  }

  saveExtraCharges() {
    this.calculateTotalExtraCharges();
    console.log('Saved Extra Charges:', this.extraChargesForm.value);
    console.log('Total:', this.totalExtraCharges);
    this.closeExtraChargesPopup();
  }

isFormValid(): boolean {
  if (this.extraCharges.length === 0) {
    return false;
  }

  return this.extraCharges.controls.every(
    ctrl =>
      ctrl.get('amount')?.value >= 1 &&
      ctrl.get('name')?.value?.trim()
  );
}

}

