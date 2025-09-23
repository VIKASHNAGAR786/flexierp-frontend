import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const params = {
      pageNo: filter.pageNo.toString(),
      pageSize: filter.pageSize.toString(),
      searchTerm: filter.searchTerm || '',
      startDate: filter.startDate || '',
      endDate: filter.endDate || ''
    };

    return this.http.get<ProductDTO[]>(this.GetProductsUrl, { headers, params });
  }
  
}