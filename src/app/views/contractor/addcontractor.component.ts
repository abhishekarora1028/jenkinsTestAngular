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


@Component({
  templateUrl: 'addcontractor.component.html'
})

export class AddcontractorComponent {
  editparam: any;
  proStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  uniqueEmail:any = 0;
  private data: any;
  model: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute) {
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

	    	this.http.get(API_URL+'/members/'+ this.editparam.id, options)
	        .subscribe(response => {
	        	//console.log(response.json());	
	        	this.model = response.json();
	        	this.editparam.action = "edit";
		    });
  }else{
  	this.editparam = {
    		id: '',
    		action: 'add'
    	}

    this.model = {    		
        fname:'',
    		lname:'',
        email:'',
    		password:'',
        phone:'',
        gender:'',
        about:'',
    	}	
  }
   
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
     //console.log(data._body)
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

   onSubmit() {
   if(this.editparam.id)
   {
   	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');

			this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+this.editparam.id+'%22%7D', this.model,  options)
	        .subscribe(data => {
	      if(data)
	      {
	        this.proEditStatus = 1;
	      }else{
	        this.proEditStatus = 2;
	      }
	    });
   }else{
	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');
            this.model.role_id = '2';
            this.model.role_name = 'contractor';
	          
	   this.http.post(API_URL+'/members', this.model, options).subscribe(data => {
	      if(data)
	      {
	        this.proStatus = 1;
	      }else{
	        this.proStatus = 2;
	      }
	    });
 
	}
  } 

}
