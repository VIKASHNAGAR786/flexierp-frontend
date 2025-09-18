import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  CanLoad, 
  Route, 
  UrlSegment, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';
import { UserinfowithloginService } from './services/userinfowithlogin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private loginService: LoginService,
    private userInfoService: UserinfowithloginService,
     private router: Router,
       private userService: UserinfowithloginService,
    ) {}

  private checkLogin(requiredRoles?: string[]): boolean | UrlTree {
    const token = this.loginService.getToken();
    
    // Not logged in
    if (!token || !this.loginService.isLoggedIn()) {
      return this.router.parseUrl('/auth/login');
    }

    // Token expired
    if (this.userInfoService.isTokenExpired(token)) {
      this.loginService.logout();
      return this.router.parseUrl('/auth/login');
    }

    // Role-based check
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.userInfoService.getUserRole();
      if (!userRole || !requiredRoles.includes(userRole)) {
        return this.router.parseUrl('/unauthorized');
      }
    }

    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    const requiredRoles = childRoute.data['roles'] as string[] | undefined;
    return this.checkLogin(requiredRoles);
  }

canActivate(): boolean {
    if (this.userService.isLoggedIn()) {
      return true; // Allow access
    } else {
      this.router.navigate(['auth/login']); // Redirect to login
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const requiredRoles = (route.data as any)?.['roles'] as string[] | undefined;
    return this.checkLogin(requiredRoles);
  }
}
