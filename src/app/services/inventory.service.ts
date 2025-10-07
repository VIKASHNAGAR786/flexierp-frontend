import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from './userinfowithlogin.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationFilter, ProductCategory, ProductModel, ProviderModel, WarehouseModel } from '../MODEL/MODEL';
import { ProductCategoryDTO, ProductCategoryListDto, ProductDTO, ProviderDTO, WarehouseDTO } from '../DTO/DTO';

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
  private GetWarehousesUrl = environment.BASE_URL + '/Inventrory/GetWarehouses';
  private AddCategoriesUrl = environment.BASE_URL + '/Inventrory/AddCategory';
  private AddWarehouseUrl = environment.BASE_URL + '/Inventrory/AddWarehouse';
  private AddproductUrl = environment.BASE_URL + '/Inventrory/AddProduct';
  private GetProductsUrl = environment.BASE_URL + '/Inventrory/GetProducts';
  private GetSoldProductsUrl = environment.BASE_URL + '/Inventrory/GetSoldProductsList';
  private GetProductReportPdfUrl = environment.BASE_URL + '/Inventrory/GetProductReportPdf';
  private GetProductReportExcelUrl = environment.BASE_URL + '/Inventrory/GetProductReportExcel';

   private GetSoldProductReportPdfUrl = environment.BASE_URL + '/Inventrory/GetSoldProductReportPdf';
  private GetSoldProductReportExcelUrl = environment.BASE_URL + '/Inventrory/GetSoldProductReportExcel';
  private AddProviderUrl = environment.BASE_URL + '/Inventrory/AddProvider';
  private GetProvidersUrl = environment.BASE_URL + '/Inventrory/GetProviders';
  private GetProductCategoryListUrl = environment.BASE_URL + '/Inventrory/GetProductCategoryList';

  saveProductCategory(categorydata: ProductCategory): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post(this.AddCategoriesUrl, categorydata, { headers }) : of(null);
  }

  AddWarehouse(warehouseData: WarehouseModel): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post(this.AddWarehouseUrl, warehouseData, { headers }) : of(null);
  }

  GetCategories(): Observable<ProductCategoryDTO[] | null> {
    const headers = this.getAuthHeaders();
    return headers
      ? this.http.get<ProductCategoryDTO[]>(this.GetCategoriesUrl, { headers })
      : of(null);
  }

  GetWarehouses(): Observable<WarehouseDTO[] | null> {
    const headers = this.getAuthHeaders();
    return headers
      ? this.http.get<WarehouseDTO[]>(this.GetWarehousesUrl, { headers })
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

  AddProvider(provider: ProviderModel): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post(this.AddProviderUrl, provider, { headers }) : of(null);
  }

  GetProviders(filter: PaginationFilter): Observable<ProviderDTO[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    // Send filter as query parameters
    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');

    return this.http.get<ProviderDTO[]>(this.GetProvidersUrl, { headers, params });
  }

  GetSoldProducts(filter: PaginationFilter): Observable<ProductDTO[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    // Send filter as query parameters
    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');


    return this.http.get<ProductDTO[]>(this.GetSoldProductsUrl, { headers, params });
  }

  getSoldProductReportPdf(filter: PaginationFilter): Observable<Blob | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');

    return this.http.get(this.GetSoldProductReportPdfUrl, { headers, params, responseType: 'blob' });
  }

  // --- Get Excel Report ---
  getSoldProductReportExcel(filter: PaginationFilter): Observable<Blob | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      .set('startDate', filter.startDate || '')
      .set('endDate', filter.endDate || '');

    return this.http.get(this.GetSoldProductReportExcelUrl, { headers, params, responseType: 'blob' });
  }

   GetProductCategoryList(): Observable<ProductCategoryListDto[] | null> {
    const headers = this.getAuthHeaders();
    return headers
      ? this.http.get<ProductCategoryListDto[]>(this.GetProductCategoryListUrl, { headers })
      : of(null);
  }

}