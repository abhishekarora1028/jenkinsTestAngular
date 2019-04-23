import { Component, VERSION } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';
import { NgModule } from '@angular/core';


@Component({
  templateUrl: 'setting.component.html'
})

export class SettingsComponent {
editparam: any;
prodel: any;
checkData:any = 0;
public data: any;
public filterQuery = '';
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }else{
      this.router.navigate(['settings/profile']);
    }
    
   
  }

}
