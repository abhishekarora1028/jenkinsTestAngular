import { Component, VERSION, ViewEncapsulation } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';
import { NgModule } from '@angular/core';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';


@Component({
  templateUrl: 'project.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectsComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
editparam: any;
prodel: any;
public assignData: any = {};
public proData: any = {};
checkData:any = 0;
id:any = 0;
currentUserID:any = 0;
currentUserRoleId:any = 0;
public data: any;
public data2: any;
public filterQuery = '';
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }

    $('.preloader').show();

    this.currentUserRoleId = localStorage.getItem("currentUserRoleId"); 
    
    if(localStorage.getItem('currentUserRoleId') == "1")
  	{
  		this.currentUserID     = localStorage.getItem('currentUserId');
  		this.currentUserRoleId = localStorage.getItem('currentUserRoleId');

	    let options = new RequestOptions();
		        options.headers = new Headers();
		        options.headers.append('Content-Type', 'application/json');
		        options.headers.append('Accept', 'application/json');

		    	this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.data[i].client_id+'"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				            
				          	this.data[i].client_name = response.json()[0].client_name;
				          	this.data[i].email = response.json()[0].email;
				          	this.data[i].client_code = response.json()[0].client_code;
				          }
				            
				        });
	          		}
		        	this.checkData = 1;
		        	setTimeout(function(){$('.preloader').hide();}, 3000);
		        }else{
		        	this.checkData = 0;
		        	setTimeout(function(){$('.preloader').hide();}, 3000);
		        }
		        
			    });	

	}else{
		let userID = localStorage.getItem('currentUserId');
		this.currentUserID = localStorage.getItem('currentUserId');
		this.currentUserRoleId = localStorage.getItem('currentUserRoleId');

		let options = new RequestOptions();
		        options.headers = new Headers();
		        options.headers.append('Content-Type', 'application/json');
		        options.headers.append('Accept', 'application/json');

		    	this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.data[i].client_id+'"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				            
				          	this.data[i].client_name = response.json()[0].client_name;
				          	this.data[i].email = response.json()[0].email;
				          	this.data[i].client_code = response.json()[0].client_code;
				          }
				            
				        });
	          		}
		        	for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+this.data[i].id+'"},{"member_id":"'+userID+'"},{"assign":"1"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				          	this.data[i].assignMemId = response.json()[0].member_id;
				          }else{
				          	this.data[i].assignMemId = 0;
				          }
				            
				        });
	          		}
		        	this.checkData = 1;
		        	setTimeout(function(){$('.preloader').hide();}, 3000);
		        }else{
		        	this.checkData = 0;
		        	setTimeout(function(){$('.preloader').hide();}, 3000);
		        }
		        
			    });	

			    
	}

	this.toasterService = toasterService;	
   
  }

  delproject(proid, index){
  this.toasterService.clear();
  if(proid)
  {
  	let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	   		/*this.http.delete(API_URL+'/projects/'+proid, options)
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
		    });*/

		    this.http.post(API_URL+'/projects/update?where=%7B%22id%22%3A%20%22'+proid+'%22%7D', {"status":"deleted"},  options)
	        .subscribe(response => {

	        	this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.data[i].client_id+'"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				            
				          	this.data[i].client_name = response.json()[0].client_name;
				          	this.data[i].email = response.json()[0].email;
				          	this.data[i].client_code = response.json()[0].client_code;
				          }
				            
				        });
	          		}
		        	this.checkData = 1;
		        }else{
		        	this.checkData = 0;
		        }
		        
			    });	
	        	this.prodel = 1;
	        });

	
			//this.data.splice(index, 1);  
			setTimeout(function(){$('.text-error').fadeOut();}, 2000); 

	this.toasterService.pop('success', 'Deleted ', "Project has deleted successfully!");
  }

  }

  assignproject(proId, memId)
  {
  	
  	let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');

	  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+proId+'"},{"member_id":"'+memId+'"},{"assign":"0"}]}}', options)
      .subscribe(response => {
      	
      if(response.json().length)
      {
      	this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%20%22'+response.json()[0].id+'%22%7D', {"assign":"1"},  options)
	        .subscribe(response => {
	        if(response.json().count)
	        {
	        	this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.data[i].client_id+'"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				            
				          	this.data[i].client_name = response.json()[0].client_name;
				          	this.data[i].email       = response.json()[0].email;
				          	this.data[i].client_code = response.json()[0].client_code;
				          }
				            
				        });
	          		}
		        	for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+this.data[i].id+'"},{"member_id":"'+this.currentUserID+'"},{"assign":"1"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				          	this.data[i].assignMemId = response.json()[0].member_id;
				          }else{
				          	this.data[i].assignMemId = 0;
				          }
				            
				        });
	          		}
		        	this.checkData = 1;
		        }else{
		        	this.checkData = 0;
		        }
		        
			    });	
	        }

	     });   
      }else{
      	this.http.get(API_URL+'/Members?filter={"where":{"and":[{"id":"'+memId+'"}]}}', options)
          .subscribe(response => {
          if(response.json().length)
          {
          	
          	this.assignData.project_id = proId;
	      	this.assignData.member_id  = memId;
	      	this.assignData.percentage = response.json()[0].default_pay;
	      	this.assignData.assign     = "1";
	      	this.http.post(API_URL+'/assignprojects?access_token='+localStorage.getItem('currentUserToken'), this.assignData, options).subscribe(response => {
          		this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
		        .subscribe(response => {
		        if(response.json().length)
		        {
		        	  this.data = response.json();
		        	  for(let i=0; i< this.data.length; i++ ) {
					    this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.data[i].client_id+'"}]}}', options)
				          .subscribe(response => {
				          if(response.json().length)
				          {
				            
				          	this.data[i].client_name = response.json()[0].client_name;
				          	this.data[i].email       = response.json()[0].email;
				          	this.data[i].client_code = response.json()[0].client_code;
				          }
				            
				        });
	          		}
		              for(let i=0; i< this.data.length; i++ ) {
		              this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+this.data[i].id+'"},{"member_id":"'+this.currentUserID+'"},{"assign":"1"}]}}', options)
		                  .subscribe(response => {
		                  if(response.json().length)
		                  {
		                    this.data[i].assignMemId = response.json()[0].member_id;
		                  }else{
		                    this.data[i].assignMemId = 0;
		                  }
		                    
		                });
		                }
		              this.checkData = 1;
		        }else{
		        	this.checkData = 0;
		        }


		        
			    });	

	        });
          }
				            
		});
      	
      }
        
    });        

  }

}
