import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserinfowithloginService } from './userinfowithlogin.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackupRequest, PaginationFilter, ProductCategory, ProductModel, ProviderModel, SaveNote, UpdateCompanyInfo, WarehouseModel } from '../MODEL/MODEL';
import { CompanyInfoDTO, DashboardMetricsDto, NoteDetailsDto, NoteDto, ProductCategoryDTO, ProductDTO, ProviderDTO, ReceivedChequeDto, UserLoginHistoryDTO, WarehouseDTO } from '../DTO/DTO';

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
  private readonly GetCompanyInfoUrl = environment.AccountApiUrl + 'GetCompanyInfo';
  private readonly UpdateCompanyInfoUrl = environment.AccountApiUrl + 'UpdateCompanyInfo';
  private readonly GenerateDashboardPdfUrl = environment.BASE_URL + '/CommonMaster/GenerateDashboardPdf';
  private readonly GetDashboardMetricsAsyncUrl = environment.BASE_URL + '/CommonMaster/GetDashboardMetricsAsync';
  private readonly GenerateDashboardExcelUrl = environment.BASE_URL + '/CommonMaster/GenerateDashboardExcel';
  private readonly GetReceivedChequesAsyncUrl = environment.BASE_URL + '/CommonMaster/GetReceivedChequesAsync';
  private readonly backupurl = environment.BASE_URL + '/Backup/backup';
  private readonly savenotesUrl = environment.BASE_URL + '/CommonMaster/SaveNote';
  private readonly GetAllNotesUrl = environment.BASE_URL + '/CommonMaster/GetAllNotes';
  private readonly GetNoteDetailsByIdAsyncUrl = environment.BASE_URL + '/CommonMaster/GetNoteDetailsByIdAsync';
  private readonly DeleteNotesByIdUrl = environment.BASE_URL + '/CommonMaster/DeleteNotesById';

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

  GetCompanyInfo(): Observable<CompanyInfoDTO | null> {
    const headers = this.getAuthHeaders();

    if (headers) {
      // Send empty body {} and pass headers correctly
      return this.http.get<CompanyInfoDTO>(this.GetCompanyInfoUrl, { headers });
    }

    return of(null); // No token, return empty observable
  }

  UpdateCompanyInfo(updateCompanyInfo: any): Observable<string> {
  const headers = this.getAuthHeaders(); // should NOT set Content-Type manually

  const formData = new FormData();
  formData.append("Company_Name", updateCompanyInfo.company_Name ?? "");
  formData.append("Contact_No", updateCompanyInfo.contact_No ?? "");
  formData.append("WhatsApp_No", updateCompanyInfo.whatsApp_No ?? "");
  formData.append("Email", updateCompanyInfo.email ?? "");
  formData.append("Address", updateCompanyInfo.address ?? "");
  formData.append("row_id", updateCompanyInfo.row_id?.toString() ?? "0");

  if (updateCompanyInfo.file) {
    formData.append("file", updateCompanyInfo.file); // <-- actual file
  }

  return this.http.post<string>(this.UpdateCompanyInfoUrl, formData, { headers: headers ?? undefined });
}

  GetDashboardMetricsAsync(startdate:string, enddate:string): Observable<DashboardMetricsDto | null> {
     const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    // Send filter as query parameters
    let params = new HttpParams()
      .set('startDate', startdate)
      .set('endDate', enddate)

    return this.http.get<DashboardMetricsDto>(this.GetDashboardMetricsAsyncUrl, { headers, params });
  }


  GenerateDashboardPdf(startDate:string, endDate:string): Observable<Blob | null> {
      const headers = this.getAuthHeaders();
      if (!headers) return of(null);
  
      let params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);

      return this.http.get(this.GenerateDashboardPdfUrl, { headers, params, responseType: 'blob' });
    }

    GenerateDashboardExcel(startDate:string, endDate:string): Observable<Blob | null> {
        const headers = this.getAuthHeaders();
        if (!headers) return of(null);
    
        let params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);

        return this.http.get(this.GenerateDashboardExcelUrl, { headers, params, responseType: 'blob' });
      }
    
       downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  GetReceivedCheques(filter: PaginationFilter): Observable<ReceivedChequeDto[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    // Send filter as query parameters
    let params = new HttpParams()
      .set('pageNo', filter.pageNo.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('searchTerm', filter.searchTerm || '')
      


    return this.http.get<ReceivedChequeDto[]>(this.GetReceivedChequesAsyncUrl, { headers, params });
  }

  backup(request: BackupRequest): Observable<string> {
    const headers = this.getAuthHeaders();
    if (!headers) return of("");

    return this.http.post<string>(this.backupurl, request, { headers });
  }

 savenotes(notes: SaveNote): Observable<string> {
  const headers = this.getAuthHeaders(); // should include 'Authorization' if needed
  if (!headers) return of("");
  return this.http.post<string>(this.savenotesUrl, notes, { headers });
}


GetAllNotes(): Observable<NoteDto[] | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    return this.http.get<NoteDto[]>(this.GetAllNotesUrl, { headers });
  }

  GetNoteDetailsByIdAsync(rowid: number): Observable<NoteDetailsDto | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);
    let params = new HttpParams()
      .set('rowid', rowid.toString());
    return this.http.get<NoteDetailsDto>(this.GetNoteDetailsByIdAsyncUrl, { headers, params });
  }

  DeleteNotesById(deletednotsid: number): Observable<number | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);
    let params = new HttpParams()
      .set('deletednotsid', deletednotsid.toString());
    return this.http.delete<number>(this.DeleteNotesByIdUrl, { headers, params });
  }

}