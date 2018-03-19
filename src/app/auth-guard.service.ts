import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  ActivatedRoute,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
}                           from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private as: AuthService, private router: Router, private activeRoute: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    this.as.tenantQP = route.queryParamMap.get('tenant')
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // if (this.as.isLoggedIn) {this.router.navigate(['/homepage']) ;return true};
    if (this.as.isLoggedIn) {return true};
    console.log('set redirect url to: ', url)
    this.as.redirectUrl = url;
    this.router.navigate(['/waitOnAuth']);
    return false;
  }
}
