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
  templateUrl: 'project.component.html'
})

export class ProjectsComponent {
editparam: any;
prodel: any;
public proData: any = {};
checkData:any = 0;
id:any = 0;
currentUserID:any = 0;
currentUserRole:any = 0;
public data: any;
public data2: any;
public filterQuery = '';
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }
    
    if(localStorage.getItem('currentUserRoleId') == "1")
  	{
  		this.currentUserID   = localStorage.getItem('currentUserId');
  		this.currentUserRole = localStorage.getItem('currentUserRoleId');

	    let options = new RequestOptions();
		        options.headers = new Headers();
		        options.headers.append('Content-Type', 'application/json');
		        options.headers.append('Accept', 'application/json');

		    	this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	this.checkData = 1;
		        }else{
		        	this.checkData = 0;
		        }
		        
			    });	

	}else{
		let userID = localStorage.getItem('currentUserId');
		this.currentUserID = localStorage.getItem('currentUserId');

		let options = new RequestOptions();
		        options.headers = new Headers();
		        options.headers.append('Content-Type', 'application/json');
		        options.headers.append('Accept', 'application/json');

		    	this.http.get(API_URL+'/projects?filter={"where":{"and":[{"member_id":"'+userID+'"}]},"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	this.checkData = 1;
		        }else{
		        	this.checkData = 0;
		        }
		        
			    });	

			    this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+userID+'"}]}}', options)
		        	.subscribe(response => {
		        	//this.checkData = 1;
		        	for(let i=0; i< response.json().length; i++ ) {
			            this.http.get(API_URL+'/projects/'+response.json()[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
			            .subscribe(response => {   
			            if(response.json().member_id!=userID)
			            {
			                if(this.data.length)
			                {
			                	this.data[i+this.data.length] = response.json();
			                }else{
			                	this.data[i] = response.json();
			                }
			            	 
			            }   
			              
			            });  
			          }
		        });	
	}
   
  }

  delproject(proid, index){
  if(proid)
  {
  	let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	   		this.http.delete(API_URL+'/projects/'+proid, options)
			          .subscribe(response => {

				    this.http.get(API_URL+'/assignprojects?filter={"where":{"project_id":"'+proid+'"}}', options)
			        .subscribe(response => {
				        if(response.json().length)
				        {
				        	this.data2 = response.json();
				        	for(let i=0; i< this.data2.length; i++ ) {
							    this.http.delete(API_URL+'/assignprojects/'+this.data2[i].id, options)
						          .subscribe(response => {
						            this.prodel = 1;
						        });
			          		}
				        
				        }
				    });
				this.prodel = 1;
		    });
	
			this.data.splice(index, 1);  
			setTimeout(function(){$('.text-error').fadeOut();}, 2000); 
  }

  }

}
