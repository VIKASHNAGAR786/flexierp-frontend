import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from './userinfowithlogin.service';
import { Observable, of } from 'rxjs';
import { CustomerWithSalesDTO, OldCustomerDTO, ProductByBarcodeDTO, SaleDTO } from '../DTO/DTO';
import { environment } from '../../environments/environment';
import { PaginationFilter, Sale } from '../MODEL/MODEL';

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
  private GetSaleUrl = environment.BASE_URL + '/Sale/GetSales';
  private GetSalesReportPdfUrl = environment.BASE_URL + '/Sale/GetSalesReportPdf';
  private GetSalesReportExcelUrl = environment.BASE_URL + '/Sale/GetSalesReportExcel';
  private getOldCustomersUrl = environment.BASE_URL + '/Sale/GetOldCustomers';
  private getCustomersWithSalesUrl = environment.BASE_URL + '/Sale/GetCustomersWithSales';
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


  GetSale(filter: PaginationFilter): Observable<SaleDTO[] | null> {
      const headers = this.getAuthHeaders();
      if (!headers) return of(null);
  
      // Send filter as query parameters
      const params = {
        pageNo: filter.pageNo.toString(),
        pageSize: filter.pageSize.toString(),
        searchTerm: filter.searchTerm || '',
        startDate: filter.startDate || '',
        endDate: filter.endDate || ''
      };
  
      return this.http.get<SaleDTO[]>(this.GetSaleUrl, { headers, params });
    }

// 🔹 Get Old Customers
  getOldCustomers(filter: PaginationFilter): Observable<OldCustomerDTO[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    const params = {
      pageNo: filter.pageNo.toString(),
      pageSize: filter.pageSize.toString(),
      searchTerm: filter.searchTerm || ''
    };

    return this.http.get<OldCustomerDTO[]>(this.getOldCustomersUrl, { headers, params });
  }

  // 🔹 Get Customers with Sales
  getCustomersWithSales(filter: PaginationFilter): Observable<CustomerWithSalesDTO[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    const params = {
      pageNo: filter.pageNo.toString(),
      pageSize: filter.pageSize.toString(),
      searchTerm: filter.searchTerm || '',
      startDate: filter.startDate || '',
      endDate: filter.endDate || ''
    };

    return this.http.get<CustomerWithSalesDTO[]>(this.getCustomersWithSalesUrl, { headers, params });
  }

  GetSalesReportPdf(filter: PaginationFilter): Observable<Blob | null> {
      const headers = this.getAuthHeaders();
      if (!headers) return of(null);
  
      let params = new HttpParams()
        .set('pageNo', filter.pageNo.toString())
        .set('pageSize', filter.pageSize.toString())
        .set('searchTerm', filter.searchTerm || '')
        .set('startDate', filter.startDate || '')
        .set('endDate', filter.endDate || '');
  
      return this.http.get(this.GetSalesReportPdfUrl, { headers, params, responseType: 'blob' });
    }
  
    // --- Get Excel Report ---
    GetSalesReportExcel(filter: PaginationFilter): Observable<Blob | null> {
      const headers = this.getAuthHeaders();
      if (!headers) return of(null);
  
      let params = new HttpParams()
        .set('pageNo', filter.pageNo.toString())
        .set('pageSize', filter.pageSize.toString())
        .set('searchTerm', filter.searchTerm || '')
        .set('startDate', filter.startDate || '')
        .set('endDate', filter.endDate || '');
  
      return this.http.get(this.GetSalesReportExcelUrl, { headers, params, responseType: 'blob' });
    }
    
  // --- Utility to download blob as file ---
  downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
