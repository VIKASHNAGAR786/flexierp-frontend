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

  saleProduct = { barcode: '' };
  scannerEnabled: boolean = false;

  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  formats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
  ];

  constraints: MediaTrackConstraints = {
    width: { ideal: 1280 },   // higher res for accuracy
    height: { ideal: 720 },
    facingMode: 'environment'
  };

  torchEnabled: boolean = false;
  torchAvailable: boolean = false;
  lastScanned: string = '';
  cooldown: boolean = false;

  // Toggle scanner
  toggleScanner() {
    this.scannerEnabled = !this.scannerEnabled;
  }

  // Torch toggle
  toggleTorch() {
    this.torchEnabled = !this.torchEnabled;
  }

  // When barcode is scanned
  onCodeResult(resultString: string) {
    // Prevent duplicate scans within 2 sec
    if (this.cooldown || resultString === this.lastScanned) return;

    this.lastScanned = resultString;
    this.saleProduct.barcode = resultString;
    this.barcodeScanned.emit(resultString);

    // Add cooldown
    this.cooldown = true;
    setTimeout(() => this.cooldown = false, 2000);

    // Auto-close scanner
    this.scannerEnabled = false;
  }

  // Manual entry
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
