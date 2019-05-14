import { Component, VERSION, ViewEncapsulation } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

@Component({
  templateUrl: 'contractor.component.html',
    styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ContractorsComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
editparam: any;
prodel: any;
checkData: any = 0;
public data: any;
public filterQuery = '';
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }
    
    $('.preloader').show();

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
	        	setTimeout(function(){$('.preloader').hide();}, 3000);
	        }else{
	        	this.checkData = 0;
	        	setTimeout(function(){$('.preloader').hide();}, 3000);
	        }
	        	
		    });	

	this.toasterService = toasterService;		    
   
  }

  delcontractor(proid, index){
  this.toasterService.clear();
  if(proid)
  {
  	let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	/*this.http.delete(API_URL+'/members/'+proid, options)
	        .subscribe(response => {
	        	this.prodel = 1;
		    });	

		    this.data.splice(index, 1); */

		    this.http.post(API_URL+'/Members/update?where=%7B%22id%22%3A%20%22'+proid+'%22%7D', {"status":"deleted"},  options)
	        .subscribe(response => {

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
	      
	    	});
		    setTimeout(function(){$('.text-error').fadeOut();}, 2000); 
			this.toasterService.pop('success', 'Deleted ', "Contractor has deleted successfully!");    
  }

  }

}
