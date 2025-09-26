import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-scan-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './scan-barcode.component.html',
  styleUrls: ['./scan-barcode.component.css']
})
export class ScanBarcodeComponent {

  barcode: string = '';
   @Output() barcodeScanned: EventEmitter<string> = new EventEmitter<string>();

   sendBarcode() {
    if (this.barcode) {
      this.barcodeScanned.emit(this.barcode);
    }
  }
  saleProduct = { barcode: '' };
  scannerEnabled: boolean = false;

  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  formats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
  ];
  constraints: MediaTrackConstraints = {
  width: { ideal: 640 },
  height: { ideal: 480 },
  facingMode: 'environment'
};

  // When barcode is scanned
  onCodeResult(resultString: string) {
    this.saleProduct.barcode = resultString;
    this.scannerEnabled = false; // close camera after scanning
    this.barcodeScanned.emit(resultString);
  }

   onEnterBarcode() {
    if (this.saleProduct.barcode) {
      this.barcodeScanned.emit(this.saleProduct.barcode);
    }
  }
  // Switch camera
  onDeviceSelectChange(event: Event) {
    const selectedDeviceId = (event.target as HTMLSelectElement).value;
    this.selectedDevice = this.availableDevices.find(device => device.deviceId === selectedDeviceId);
  }

  submitSale() {
    console.log('Submitting sale for barcode:', this.saleProduct.barcode);
    // Add your logic to fetch product details using the barcode
  }
}
