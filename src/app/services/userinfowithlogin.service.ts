import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserinfowithloginService {
  private cachedData: {
    token: string | null;
    name: string | null;
    role: string | null;
    email: string | null;
    id: number | null;
    lang: string | null;
  } | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.loadFromLocalStorage();
  }

  /** Load data from localStorage into memory */
  private loadFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cachedData = {
        token: localStorage.getItem('auth_token'),
        name: localStorage.getItem('user_name'),
        role: localStorage.getItem('user_role'),
        email: localStorage.getItem('user_email'),
        id: this.parseId(localStorage.getItem('nameid')),
        lang: localStorage.getItem('lang')
      };
    }
  }

  /** Parse ID safely */
  private parseId(value: string | null): number | null {
    return value ? Number(value) : null;
  }

  /** ================================
   *    GETTERS
   *  ================================ */

  /** Get token */
  getToken(): string | null {
    return this.cachedData?.token ?? null;
  }

  /** Get username */
  getUserName(): string | null {
    return this.cachedData?.name ?? null;
  }

  /** Get role */
  getUserRole(): string | null {
    return this.cachedData?.role ?? null;
  }

  /** Get email */
  getUserEmail(): string | null {
    return this.cachedData?.email ?? null;
  }

  /** Get ID */
  getUserId(): number | null {
    return this.cachedData?.id ?? null;
  }

  /** Get language */
  getUserLang(): string | null {
    return this.cachedData?.lang ?? null;
  }

   /** Change language */
  changeUserLang(newLang: string): void {
    if (this.cachedData) {
      this.cachedData.lang = newLang;
    }
    localStorage.setItem('lang', newLang);
  }

  /** ================================
   *    TOKEN HELPERS
   *  ================================ */

  /** Decode JWT token payload */
  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /** Check if token is expired */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true; // invalid token
    }
    const expiryDate = payload.exp * 1000; // exp is in seconds
    return Date.now() >= expiryDate;
  }

  /** Get token expiration date */
  getTokenExpirationDate(token: string): Date | null {
    const payload = this.decodeToken(token);
    return payload?.exp ? new Date(payload.exp * 1000) : null;
  }

  /** ================================
   *    SESSION MANAGEMENT
   *  ================================ */

  /** Refresh data from localStorage (if user logs in or logs out) */
  refresh(): void {
    this.loadFromLocalStorage();
  }

  private loggedInSource = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSource.asObservable();

  setLoggedIn(state: boolean) {
    this.loggedInSource.next(state);
  }

  /** Logout user */
  // logout(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.removeItem('auth_token');
  //     localStorage.removeItem('user_name');
  //     localStorage.removeItem('user_role');
  //     localStorage.removeItem('user_email');
  //     localStorage.removeItem('nameid');
  //     localStorage.removeItem('lang');
  //   }
  //   this.clear();
  //   this.router.navigate(['/auth/login']);
  // }

  /** Clear cache (optional, used in logout) */
  clear(): void {
    this.cachedData = null;
  }
}
