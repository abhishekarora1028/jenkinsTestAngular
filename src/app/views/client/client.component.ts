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
  templateUrl: 'client.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class ClientsComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
editparam: any;
prodel: any;
public proData: any = {};
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

	    	this.http.get(API_URL+'/clients?filter={"order":"id DESC"}&access_token='+ localStorage.getItem('currentUserToken'), options)
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

  delclient(clientId, index){
  this.toasterService.clear();
  if(clientId)
  {
  	let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	/*this.http.delete(API_URL+'/clients/'+proid, options)
	        .subscribe(response => {
	        	this.prodel = 1;
		    });	

		    this.data.splice(index, 1); 
		    setTimeout(function(){$('.text-error').fadeOut();}, 2000); */

		    this.proData.status = 'deleted';

		    this.http.post(API_URL+'/clients/update?where=%7B%22id%22%3A%20%22'+clientId+'%22%7D&access_token='+ localStorage.getItem('currentUserToken'), this.proData,  options)
	        .subscribe(data => {
	        	this.http.get(API_URL+'/clients?filter={"order":"id DESC"}&access_token='+ localStorage.getItem('currentUserToken'), options)
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

			    this.prodel = 1;
	        });

	this.toasterService.pop('success', 'Deleted ', "Client has deleted successfully!");

  }

  }

}
