import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, ActivatedRoute
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { API_URL } from './globals';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private http: Http) {}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
    let url: string = state.url;
    console.log(route);
    return this.roleCheck(url,route.data.nav)
    .map(roleaccess =>  {
      localStorage.setItem('currentUserMainPermissions',roleaccess.permission);
      localStorage.setItem('currentUserInnerPermissions', roleaccess.permissionInside);
      if((roleaccess.permission).indexOf(route.data.nav) > -1){
          console.log("true");
          return true;
       } else {
          console.log("false");
          return false;
       }
    });    
  }

  roleCheck(url: string, nav: string) : Observable<any> {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Accept', 'application/json');

    return this.http.get(API_URL+'/Roles?filter={"where":{"id":"'+localStorage.getItem('currentUserRoleId')+'"}}&access_token='+ localStorage.getItem('currentUserToken'), options)
    .map(res => res.json()[0]);  
  }



  /*checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }*/
}