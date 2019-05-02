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
  	route: any;
  	id: any;
  	private conStatus: any = 0;
  	profilePicture: any = 0;
  	userId: any = 0;
  	imgUrl: any;
	private userLoggedInName:any = localStorage.getItem('currentUserName');
	
	constructor( private router:Router, private http: Http) {
		this.route = this.router.url;
		this.userRoleName =  localStorage.getItem('currentUserRole');
		this.userId =  localStorage.getItem('currentUserId');
		this.imgUrl = API_URL+'/Imagecontainers/'; 

		let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	this.http.get(API_URL+'/members/'+this.userId, options)
	        .subscribe(response => {	
	        	this.model = response.json();
	        	//this.editparam.action = "edit";
             if(this.model.picstatus!=undefined && this.model.picstatus==1){
             	this.profilePicture = 1;
                this.http.get(API_URL+'/Imagecontainers/'+this.model.id+'/files', options)
                    .subscribe(response => {  
                    if(response.json().length)
                    {
                        this.model.profilePic =  response.json()[0].name;
                    }
                  });
              }else{
                        this.model.profilePic = '';
                    }

                    console.log(this.model)
		    });

		if(this.router.url =='/settings/profile')
		{
			this.id = 1;
		}
		if(this.router.url =='/settings/changepassword')
		{
			this.id = 2;
		}

	    if(localStorage.getItem('currentUserRole') != null) { 


	   } else {   

	   }

	  if(localStorage.getItem('currentUserRoleId') == "2")
       { 
       		this.conStatus = "1";
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

addClass(id: any) {
    this.id = id;
}

 }
