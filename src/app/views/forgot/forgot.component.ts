import { Component, ViewEncapsulation } from '@angular/core';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

@Component({
  templateUrl: 'forgot.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class ForgotComponent {
	
  	private data: any;

	private toasterService: ToasterService;

    public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });


	constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {
	    this.data = {
	      email: ''
	    };

     	this.toasterService = toasterService;
	  }


	onSubmit() {	 
	this.toasterService.clear();
	 	let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');
 	
	  	this.http.get(API_URL+'/Members?filter={"where":{"and":[{"email":"'+(this.data.email).replace('+','%2B')+'"},{"active":{"neq":0}}]}}&access_token='+localStorage.getItem('currentUserToken'), options)  
        .subscribe(response => {
        	if(response.json().length != 0) {
	            this.http.post(API_URL+'/Members/reset', this.data)
		        .subscribe(response => {
		        	console.log(response.json());
				    this.toasterService.pop('success', 'Success', "Mail Sent Successfully");
		        }, error => {
		        	console.log(JSON.stringify(error.json()));
					if(error.json().isTrusted){
						this.toasterService.pop('error', 'Error ', "API not working.");
					} else {	
				   		this.toasterService.pop('error', 'Error ', error.json().error.message);
				   	}
		        });
		    } else {
		    	this.toasterService.pop('error', 'Error ', "Account with this email doesnot exists.");
		    }
        }, error => {
            console.log(JSON.stringify(error.json()));
        }); 	    
	}
}
