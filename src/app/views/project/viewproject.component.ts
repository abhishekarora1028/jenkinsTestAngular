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
  templateUrl: 'viewproject.component.html',
    styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss'],
})

export class ViewprojectComponent {
  editparam: any;
  proStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  private data: any;
  model: any = {};
  assignProData: any = {};
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

	    	this.http.get(API_URL+'/projects/'+ this.editparam.id, options)
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
    		client_name:'',
    		email:'',
        project_name:'',
        contractorname:'',
    		percentage:'',
    		budget:'',
    		project_type:'',
    		project_time:'',
    		hourly_rate:'',
    		fixed_rate:'',
    		description:'',
    	}	
  }

    	

    //console.log(this.route.snapshot.paramMap.get('id'))
   
  }


}
