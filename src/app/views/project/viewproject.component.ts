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
  checkData:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  public disCon:any = 0;
  private data: any;
  model: any = {};
  data2: any = {};
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
            this.model = response.json();
            this.http.get(API_URL+'/clients/'+ this.model.client_id, options)
                  .subscribe(response => {
                    this.model.client_name = response.json().client_name;
                    this.model.email       = response.json().email;
                    this.model.client_code = response.json().client_code;
                    
            });
            if(this.model.member_id == localStorage.getItem("currentUserId"))
            {
              this.disCon = 1;
            }else{
              this.disCon = 0;
            }
	        	this.editparam.action = "edit"; 

            //console.log(this.model); 
		    });

        let projectID = this.editparam.id;
        //console.log(projectID)

        this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"assign":"1"},{"project_id":"'+projectID+'"}]},"order":"id DESC"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.data = response.json();
            if(this.data.length)
            {
               for(let i=0; i< this.data.length; i++ ) { 

                this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                .subscribe(response => {      
                  this.data[i].contractorname = response.json().fname+' '+response.json().lname;  
                }); 
              }
            }
            
            this.checkData = 1;
          }else{
            this.checkData = 0;
          }
          
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
        sdate:'',
    		edate:'',
    		rate:'',
    		description:'',
    	}	
  }

    	

    //console.log(this.route.snapshot.paramMap.get('id'))
   
  }


}
