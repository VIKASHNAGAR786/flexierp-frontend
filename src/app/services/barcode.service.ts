import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateReceiptpdf } from '../MODEL/MODEL';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
private apiUrl = 'http://127.0.0.1:5001';  // Python exe service

  constructor(private http: HttpClient) {}

  generateBarcode(text: string, barcodeType: string = 'code128', moduleWidth: number = 0.2, moduleHeight: number = 15) {
  const url = `${this.apiUrl}/barcode/png/${text}?barcode_type=${barcodeType}&module_width=${moduleWidth}&module_height=${moduleHeight}`;
  return this.http.get(url, { responseType: 'blob' }); // Get the PNG as a Blob
}

generateBarcodePDF(barcodeItems: { code: string; name: string }[]): Observable<Blob> {
  return this.http.post(`${this.apiUrl}/barcode/pdf`, barcodeItems, { responseType: 'blob' });
}

   generateReceiptPDF(data: generateReceiptpdf): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-receipt`, data, { responseType: 'blob' });
  }

}
