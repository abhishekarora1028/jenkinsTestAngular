import { Component, VERSION } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';

@Component({
  templateUrl: 'contractor.component.html'
})

export class ContractorsComponent {
editparam: any;
prodel: any;
checkData: any = 0;
public data: any;
public filterQuery = '';
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }
    

    let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"}]},"order":"id DESC"}', options)
	        .subscribe(response => {
	        if(response.json().length)
	        {
	        	this.data = response.json();
	        	this.checkData = 0;
	        	this.checkData = 1;
	        }else{
	        	this.checkData = 0;
	        }
	        	
		    });	
   
  }

  delcontractor(proid, index){
  if(proid)
  {
  	let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	this.http.delete(API_URL+'/members/'+proid, options)
	        .subscribe(response => {
	        	this.prodel = 1;
		    });	

		    this.data.splice(index, 1); 
		    setTimeout(function(){$('.text-error').fadeOut();}, 2000); 
  }

  }

}
