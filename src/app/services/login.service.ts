import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { UserinfowithloginService } from './userinfowithlogin.service';

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
  lang: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = environment.AccountApiUrl + 'Login/login';
  private readonly expiryDays = 7;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userInfo: UserinfowithloginService
  ) {}

  /** Check if running in browser */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /** Perform login and save data */
  login(logindata: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, logindata).pipe(
      tap(response => {
        if (!this.isBrowser()) return;

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.expiryDays);

        const storageData: Record<string, string> = {
          'auth_token': response.token,
          'auth_token_expiry': expiryDate.getTime().toString(),
          'user_name': response.name,
          'user_role': response.role,
          'user_email': response.email,
          'nameid': response.id.toString(),
          'lang' : 'en'
        };

        Object.entries(storageData).forEach(([key, value]) =>
          localStorage.setItem(key, value)
        );

        this.userInfo.refresh(); // Refresh cached data
      })
    );
  }

  /** Check if logged in */
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;

    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('auth_token_expiry');
    const now = Date.now();

    if (!token || !expiry || now > +expiry) {
      this.logout();
      return false;
    }
    return true;
  }

  /** Get token */
  getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem('auth_token') : null;
  }

  /** Logout user */
  logout(): void {
    if (!this.isBrowser()) return;

    const keysToRemove = [
      'auth_token',
      'auth_token_expiry',
      'user_name',
      'user_role',
      'user_email',
      'nameid'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
    this.userInfo.clear(); // Clear cached data
  }
}
