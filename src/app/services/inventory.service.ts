import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from './userinfowithlogin.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationFilter, ProductCategory, ProductModel } from '../MODEL/MODEL';
import { ProductCategoryDTO, ProductDTO } from '../DTO/DTO';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
     private userInfo: UserinfowithloginService
  ) { }

   private getAuthHeaders(): HttpHeaders | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.userInfo.getToken();
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return null;
  }


  private GetCategoriesUrl = environment.BASE_URL + '/Inventrory/GetCategories';
  private AddCategoriesUrl = environment.BASE_URL + '/Inventrory/AddCategory';
  private AddproductUrl = environment.BASE_URL + '/Inventrory/AddProduct';
   private GetProductsUrl = environment.BASE_URL + '/Inventrory/GetProducts';

 private GetProductReportPdfUrl = environment.BASE_URL + '/Inventrory/GetProductReportPdf';
 private GetProductReportExcelUrl = environment.BASE_URL + '/Inventrory/GetProductReportExcel';

  saveProductCategory(categorydata: ProductCategory): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post(this.AddCategoriesUrl, categorydata, { headers }) : of(null);
  }

  GetCategories(): Observable<ProductCategoryDTO[] | null> {
  const headers = this.getAuthHeaders();
  return headers 
    ? this.http.get<ProductCategoryDTO[]>(this.GetCategoriesUrl, { headers }) 
    : of(null);
}

 AddProduct(product: ProductModel): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post(this.AddproductUrl, product, { headers }) : of(null);
  }

  GetProducts(filter: PaginationFilter): Observable<ProductDTO[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    // Send filter as query parameters
    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');


    return this.http.get<ProductDTO[]>(this.GetProductsUrl, { headers, params });
  }
  
   getProductReportPdf(filter: PaginationFilter): Observable<Blob | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');

    return this.http.get(this.GetProductReportPdfUrl, { headers, params, responseType: 'blob' });
  }

  // --- Get Excel Report ---
  getProductReportExcel(filter: PaginationFilter): Observable<Blob | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');

    return this.http.get(this.GetProductReportExcelUrl, { headers, params, responseType: 'blob' });
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