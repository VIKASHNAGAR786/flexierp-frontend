// login.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userName: string;
  name: string;
  role: string;
  isActive: boolean;
  token: string;
  password: string;
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = environment.AccountApiUrl + 'Login/login';
  private readonly tokenKey = 'auth_token';
  private readonly expiryKey = 'auth_token_expiry';
  private readonly expiryDays = 7;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(logindata: LoginRequest): Observable<LoginResponse> {
    return new Observable<LoginResponse>((observer) => {
      this.http.post<LoginResponse>(this.apiUrl, logindata).subscribe({
        next: (response: LoginResponse) => {
          if (isPlatformBrowser(this.platformId)) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + this.expiryDays);
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.expiryKey, expiryDate.getTime().toString());
            localStorage.setItem('user_name', response.name);
            localStorage.setItem('user_role', response.role);
            localStorage.setItem('user_email', response.email);
            localStorage.setItem('nameid', response.id.toString());
          }
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.expiryKey);
    const now = new Date().getTime();

    if (!token || !expiry || now > +expiry) {
      this.logout(); // Clear expired data
      return false;
    }

    return true;
  }

  getToken(): string | null {
    if (!this.isLoggedIn()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const keys = [
      this.tokenKey,
      this.expiryKey,
      'user_name',
      'user_role',
      'user_email',
      'nameid'
    ];

    keys.forEach((key) => localStorage.removeItem(key));
  }
}
