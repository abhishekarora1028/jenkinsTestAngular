import { Component, ViewEncapsulation } from '@angular/core';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { API_URL } from '../../globals';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import * as moment from 'moment';
import {IOption} from 'ng-select';

import * as $ from 'jquery';
import { ModalDirective } from 'ngx-bootstrap/modal';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})


export class AppHeaderComponent {
	private data:any;
	private proilefiles:any;
	private checkVal:any;
	private api_url:any;
	private user:any = [];
	private profilePath: any ='';
  	private countries: any;
  	private userRoleName: any;
	private userLoggedInName:any = localStorage.getItem('currentUserName');
	
	constructor( private router:Router, private http: Http) {

		this.userRoleName =  localStorage.getItem('currentUserRole');

	    if(localStorage.getItem('currentUserRole') != null) { 


	   } else {   

	   }
  	}

	logout() {
	    let options = new RequestOptions();
	    options.headers = new Headers();
	    options.headers.append('Content-Type', 'application/json');
	    options.headers.append('Accept', 'application/json');
		
	    this.http.post(API_URL+'/Members/logout?access_token='+ localStorage.getItem('currentUserToken'), this.data ,  options)
	    .subscribe(response => {
	      		console.log(response.json());
	    	}, error => {
	          console.log(error.json());
	  		}
	  	);
		localStorage.clear();
	    this.router.navigate(['login']);
	}

 }
