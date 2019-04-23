import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation, ViewChild } from '@angular/core';
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
  templateUrl: 'addproject.component.html',
    styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AddprojectComponent {
  editparam: any;
  proStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  checkUser:any = 0;
  conData:any;
  private data: any;
  model: any = {};
  proData: any = {};
  sData: any  = {};
  assData: any  = {};
  assData2: any  = {};
  users: any[] = [];
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
	        	this.editparam.action = "edit";
		    });

        let projectId = this.editparam.id;
        let userId = localStorage.getItem("currentUserId");

        this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+projectId+'"},{"assign":"1"}]}}', options)
          .subscribe(response => {
            this.data = response.json();
        for(let i=0; i<this.data.length; i++){
            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
            .subscribe(response => {      
              this.data[i].fullname = response.json().fname+' '+response.json().lname; 
              
            });
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
        contractor_id:'',
    		percentage:'',
    		budget:'',
    		project_type:'',
    		project_time:'',
    		hourly_rate:'',
    		fixed_rate:'',
    		description:'',
    	}	
  }

let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');  

this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"}]},"order":"id ASC"}', options)
          .subscribe(response => {
        this.conData = response.json();
      });
   
  }

  onSelect(rate) { 
    if(rate == 'fixed')
    {
    	this.rate = 1;
    }else if(rate == 'hourly'){
    	this.rate = 2;
    }else{
    	this.rate = 0;
    }
}

keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



addUser(){
    this.users.push({});
}

removeUser(i, dcon, assignid){
  if(dcon == 1)
  { 
      let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

      this.proData.assign = "0";      

    /*this.http.delete(API_URL+'/assignprojects/'+assignid, options)
                      .subscribe(response => {
        this.data.splice(i, 1);               
    });*/
    this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%20%22'+assignid+'%22%7D', this.proData,  options)
          .subscribe(data => {
          this.data.splice(i, 1); 

      });      

  }else{
    this.users.splice(i, 1);
  }
}  

   onSubmit() {
   if(this.editparam.id)
   {
   	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json'); 

     let sDate = this.model.sdate;
     let eDate = this.model.edate;

     //let eDate = (this.model.edate.getMonth()+1) + "/" + this.model.edate.getDate() + "/" + this.model.edate.getFullYear();           

     //this.proData.member_id    = this.model.member_id;       
     this.proData.client_name    = this.model.client_name;
     this.proData.email          = this.model.email;
     this.proData.project_name   = this.model.project_name;
     this.proData.budget         = this.model.budget;
     this.proData.project_type   = this.model.project_type;
     this.proData.rate           = this.model.rate;
     this.proData.sdate          = sDate;
     this.proData.edate          = eDate;
     this.proData.description    = this.model.description;

     if(this.users.length || this.data.length)
     {
        this.proData.assign  = 1;
     }else{
        this.proData.assign  = 0;
     }
      

			this.http.post(API_URL+'/projects/update?where=%7B%22id%22%3A%20%22'+this.editparam.id+'%22%7D', this.proData,  options)
	        .subscribe(data => {
	      if(data)
	      {
          this.sData   = data.json();

          if(this.data.length)
          {

               for(let i=0; i< this.data.length; i++ ) {
                  let projectId             = this.editparam.id; 
                  let memberId              = this.data[i].member_id;
                  let assId                 = this.data[i].id;
                  this.assData.percentage   = this.data[i].percentage; 

                  this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%22'+assId+'%22%7D', this.assData,  options)
                  .subscribe(data => {

                  });  
              }   
          }

          if(this.users.length)
          {
             
             for(let i=0; i< this.users.length; i++ ) {  

              this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.users[i].member_id+'"},{"project_id":"'+this.editparam.id+'"}]}}', options)
            .subscribe(response => {      
              
              if(response.json().length)
              {
                if(response.json()[i].assign == 0)
                {
                  this.assData2.percentage    = this.users[i].percentage;  
                  this.assData2.assign        = "1";

                  this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%20%22'+response.json()[i].id+'%22%7D', this.assData2,  options)
                      .subscribe(data => { 

                  });
                  this.checkUser = 0;
                }else{
                  this.checkUser = 1;
                }
                
              }else{

                  this.assData.project_id    = this.editparam.id; 
                  this.assData.member_id     = this.users[i].member_id; 
                  this.assData.percentage    = this.users[i].percentage; 
                  this.assData.assign        = "1"; 

                  this.http.post(API_URL+'/assignprojects?access_token='+localStorage.getItem('currentUserToken'), this.assData, options).subscribe(data => {

                });
                this.checkUser = 0;
              }

            });
              
              

              }
          }
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

     //this.model.member_id = localStorage.getItem("currentUserId");        
     //this.model.assign  = "0";        

     let todayDate = new Date();
     let strDate =  (todayDate.getMonth()+1) + "/" + todayDate.getDate() + "/" + todayDate.getFullYear();

     let sDate = (this.model.sdate.getMonth()+1) + "/" + this.model.sdate.getDate() + "/" + this.model.sdate.getFullYear();

     let eDate = (this.model.edate.getMonth()+1) + "/" + this.model.edate.getDate() + "/" + this.model.edate.getFullYear();

     this.proData.member_id    = localStorage.getItem("currentUserId");
     this.proData.client_name  = this.model.client_name;
     this.proData.email        = this.model.email;
     this.proData.project_name = this.model.project_name;
     this.proData.budget       = this.model.budget;
     this.proData.project_type = this.model.project_type;
     this.proData.rate         = this.model.rate;
     this.proData.sdate        = sDate;
     this.proData.edate        = eDate;
     this.proData.description  = this.model.description;
     this.proData.cdate        = strDate;

     if(this.users.length)
     {
        this.proData.assign  = 1;
     }else{
        this.proData.assign  = 0;
     }

	   this.http.post(API_URL+'/projects?access_token='+localStorage.getItem('currentUserToken'), this.proData, options).subscribe(data => {
	      if(data)
	      {
          this.sData   = data.json();
          if(this.users.length)
          {
             let result = [];
              $.each(this.users, function (i, e) {
                  var matchingItems = $.grep(result, function (item) {
                     return item.member_id == e.member_id;
                  });
                  if (matchingItems.length === 0){
                      result.push(e);
                  }
              });

             for(let i=0; i< result.length; i++ ) { 
              this.assData.project_id    = this.sData.id; 
              this.assData.member_id     = result[i].member_id; 
              this.assData.percentage    = result[i].percentage;  
              this.assData.assign        = "1";  
              
              this.http.post(API_URL+'/assignprojects?access_token='+localStorage.getItem('currentUserToken'), this.assData, options).subscribe(data => {

              });

              }
          }
	        this.proStatus = 1;

	      }else{
	        this.proStatus = 2;
	      }
	    });
 
	}
  } 

}
