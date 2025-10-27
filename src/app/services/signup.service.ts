import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { RegisterUser } from '../MODEL/MODEL';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
 private readonly apiUrl = environment.AccountApiUrl + 'Register';  // API Endpoint

  constructor(private http: HttpClient) {}

  Register(user: RegisterUser): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}
