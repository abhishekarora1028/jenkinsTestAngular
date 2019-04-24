import { Component, OnInit } from '@angular/core';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup }  from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import * as $ from 'jquery';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';


@Component({
  templateUrl: 'addclient.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
})

export class AddclientComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
  editparam: any;
  proStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  uniqueEmail:any = 0;
  private data: any;
  model: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }

  if(this.route.snapshot.paramMap.get("id"))
  {
  this.editparam = {
    		id: this.route.snapshot.paramMap.get("id"),
    		action: 'edit'
    	}

  let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	this.http.get(API_URL+'/clients/'+ this.editparam.id, options)
	        .subscribe(response => {	
	        	this.model = response.json();
	        	this.editparam.action = "edit";
		    });
  }else{
  	this.editparam = {
    		id: '',
    		action: 'add'
    	}

    this.model = {    		
        client_name:'',
        email:'',
        phone:'',
        about:'',
    	}	
  }

  this.toasterService = toasterService;
   
  }

keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
}

onChange(event: any) {
  this.uniqueEmail = 0;
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');
            
     this.http.get(API_URL+'/Members?filter=%7B%22where%22%3A%7B%22email%22%3A%20%22'+event+'%22%7D%7D', options).subscribe(data => {
        if(data.json().length)
        {
          this.uniqueEmail = 0;
          this.uniqueEmail = 1;
        }else{
          this.uniqueEmail = 0;
          this.uniqueEmail = 2;
        }
      });
  }

disClient()
{
  
  let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

        this.http.get(API_URL+'/clients/'+ this.editparam.id, options)
          .subscribe(response => {  
            this.model = response.json();
            this.editparam.action = "edit";
            this.router.navigate(['clients']); 
        });    
}


   onSubmit() {
   this.toasterService.clear();
   if(this.editparam.id)
   {
   	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');

			this.http.post(API_URL+'/clients/update?where=%7B%22id%22%3A%20%22'+this.editparam.id+'%22%7D', this.model,  options)
	        .subscribe(data => {
	      if(data)
	      {
	        //this.proEditStatus = 1;
          this.toasterService.pop('success', 'Updated ', "Client has updated successfully!");
	      }else{
	        //this.proEditStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
	      }
	    });
       this.disClient();
   }else{
	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');

     let todayDate = new Date();
     let strDate =  (todayDate.getMonth()+1) + "/" + todayDate.getDate() + "/" + todayDate.getFullYear();
     
     this.model.cdate = strDate;       
	          
	   this.http.post(API_URL+'/clients', this.model, options).subscribe(data => {
	      if(data)
	      {
	        //this.proStatus = 1;
          this.toasterService.pop('success', 'Added ', "Client has added successfully!");
	      }else{
	        //this.proStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
	      }
	    });
    this.disClient();
	}
  } 

}
