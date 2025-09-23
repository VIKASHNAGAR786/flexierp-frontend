import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  saleProduct = { barcode: '' };
  scannerEnabled: boolean = false;

  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  formats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13
  ];

  // When barcode is scanned
  onCodeResult(resultString: string) {
    this.saleProduct.barcode = resultString;
    this.scannerEnabled = false; // close camera after scanning
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
