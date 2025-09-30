import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from './userinfowithlogin.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationFilter, ProductCategory, ProductModel, ProviderModel, WarehouseModel } from '../MODEL/MODEL';
import { ProductCategoryDTO, ProductDTO, ProviderDTO, UserLoginHistoryDTO, WarehouseDTO } from '../DTO/DTO';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

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

  private readonly logouturl = environment.AccountApiUrl + 'logout';
  private readonly GetUserLoginHistoryUrl = environment.AccountApiUrl + 'GetUserLoginHistory';

  logout(): Observable<string> {
  const headers = this.getAuthHeaders();

  if (headers) {
    // Send empty body {} and pass headers correctly
    return this.http.patch<string>(this.logouturl, {}, { headers });
  }

  return of(""); // No token, return empty observable
}

GetUserLoginHistory(filter: PaginationFilter): Observable<UserLoginHistoryDTO[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    // Send filter as query parameters
    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())

    return this.http.get<UserLoginHistoryDTO[]>(this.GetUserLoginHistoryUrl, { headers, params });
  }

}
