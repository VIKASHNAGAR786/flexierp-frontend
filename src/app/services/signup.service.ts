import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  private apiUrl = environment.AccountApiUrl + 'Register/Register';  // API Endpoint

  constructor(private http: HttpClient) {}

  Register(userdata: any): Observable<any> {
    return this.http.post(this.apiUrl, userdata);
  }
}
