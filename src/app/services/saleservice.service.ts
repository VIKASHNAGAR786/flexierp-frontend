import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from './userinfowithlogin.service';
import { Observable, of } from 'rxjs';
import { ProductByBarcodeDTO } from '../DTO/DTO';
import { environment } from '../../environments/environment';
import { Sale } from '../MODEL/MODEL';

@Injectable({
  providedIn: 'root'
})
export class SaleserviceService {
 constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
     private userInfo: UserinfowithloginService
  ) { }

  private GetProductByBarcodeUrl = environment.BASE_URL + '/Sale/GetProductByBarcode';
  private InsertSaleUrl = environment.BASE_URL + '/Sale/InsertSale';
   private getAuthHeaders(): HttpHeaders | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.userInfo.getToken();
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return null;
  }

   GetProductByBarcode(barcode: string): Observable<ProductByBarcodeDTO | null> {
      const headers = this.getAuthHeaders();
      if (!headers) return of(null);
  
      // Send filter as query parameters
      const params = {
        barcode: barcode
      };

      return this.http.get<ProductByBarcodeDTO>(this.GetProductByBarcodeUrl, { headers, params });
    }

    InsertSale(sale: Sale): Observable<number> {
        const headers = this.getAuthHeaders();
        return headers ? this.http.post<number>(this.InsertSaleUrl, sale, { headers }) : of(0);
      }

}
