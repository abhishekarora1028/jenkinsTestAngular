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
import * as _ from 'lodash';
import * as $ from 'jquery';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';


@Component({
  templateUrl: 'addproject.component.html',
    styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss', '../../../scss/vendors/toastr/toastr.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AddprojectComponent {
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
  custom_project_id:any = 0;
  checkUser:any = 2;
  countPro:any = 0;
  checkData:any = 0;
  clientId:any = 0;
  conData:any;
  clientData:any;
  private data: any;
  model: any = {};
  proData: any = {};
  sData: any  = {};
  assData: any  = {};
  assData2: any  = {};
  users: any[] = [];
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }


     let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

          this.http.get(API_URL+'/projects?access_token='+ localStorage.getItem('currentUserToken'), options)
          .subscribe(response => {
          this.countPro = response.json().length;
          
          if(this.countPro == 0)
          {
            this.custom_project_id = "001";
          }else if(this.countPro > 0 && this.countPro < 9)
          {
            this.custom_project_id   = this.countPro + 1; 
            this.custom_project_id   = "00"+this.custom_project_id;
          }else if(this.countPro > 8 && this.countPro < 99)
          {
            this.custom_project_id = this.countPro + 1; 
            this.custom_project_id = "0"+this.custom_project_id;
          }else{
            this.custom_project_id     = this.countPro + 1; 
          }
          
        });

       

      

  if(this.route.snapshot.paramMap.get("id"))
  {
    
  this.editparam = {
    		id: this.route.snapshot.paramMap.get("id"),
    		action: 'edit'
    	}

	    	this.http.get(API_URL+'/projects/'+ this.editparam.id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
	        .subscribe(response => {
	        	this.model = response.json();

            this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.model.client_id+'"}]}}&access_token='+ localStorage.getItem('currentUserToken'), options)
          .subscribe(response => {
              if(response.json()[0].status=='active')
              {
                this.clientId = this.model.client_id;
              }else{
                this.clientId = '';
                this.model.client_id = '';
              }
          });
            
	        	this.editparam.action = "edit";
		    });

        let projectId = this.editparam.id;
        let userId = localStorage.getItem("currentUserId");

        this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+projectId+'"},{"assign":"1"}]}}&access_token='+ localStorage.getItem('currentUserToken'), options)
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
    		client_id:'',
    		email:'',
        project_name:'',
        contractor_id:'',
    		percentage:'',
    		budget:'',
        project_type:'',
    		status:'',
    		project_time:'',
    		rate:'',
        sdate:'',
    		edate:'',
    		description:'',
    	}	
  }


this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"},{"status":"active"}]},"order":"id ASC"}&access_token='+ localStorage.getItem('currentUserToken'), options)
          .subscribe(response => {
        this.conData = response.json();
      });


  this.http.get(API_URL+'/clients?filter={"where":{"and":[{"status":"active"}]},"order":"client_name ASC"}&access_token='+ localStorage.getItem('currentUserToken'), options)
          .subscribe(response => {
        this.clientData = response.json();
        this.clientData = _.orderBy(this.clientData, [user => user.client_name.toLowerCase()], ['asc']);
      });     
   
   this.toasterService = toasterService;
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

getDefPay(contId, index)
{
  if(contId)
  {
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

    this.http.get(API_URL+'/Members?filter={"where":{"and":[{"id":"'+contId+'"}]}}&access_token='+ localStorage.getItem('currentUserToken'), options)
          .subscribe(response => {
          this.users[index].percentage = response.json()[0].default_pay;
      });     
  }else{
    this.users[index].percentage = '';
  }
}

checkNumber(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
}

keyPress(event: any) {
    //const pattern = /[0-9\ ]/;
    const pattern = /^[a-zA-Z0-9._^%$#!~@+,-]*$/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
}

RemoveSpace(event: any) {
    //const pattern = /[0-9\ ]/;
    const pattern = /^[a-zA-Z0-9._^%$#!~@+,-]*$/;

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
    this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%20%22'+assignid+'%22%7D&access_token='+ localStorage.getItem('currentUserToken'), this.proData,  options)
          .subscribe(data => {
          this.data.splice(i, 1); 

      });      

  }else{
    this.users.splice(i, 1);
  }
}  

disProject()
{
     
      let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

          this.http.get(API_URL+'/projects?filter={"order":"id DESC"}&access_token='+ localStorage.getItem('currentUserToken'), options)
            .subscribe(response => {
            this.router.navigate(['projects']); 
            if(response.json().length)
            {
              this.data = response.json();
              for(let i=0; i< this.data.length; i++ ) {
              this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.data[i].client_id+'"}]}}&access_token='+ localStorage.getItem('currentUserToken'), options)
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

         
}

onSubmit() {
   this.checkUser = 0;
   this.toasterService.clear();
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
     this.proData.client_id      = this.model.client_id;
     //this.proData.email          = this.model.email;
     this.proData.project_name   = this.model.project_name;
     this.proData.project_code   = this.model.project_code;
     this.proData.budget         = this.model.budget;
     this.proData.project_type   = this.model.project_type;
     this.proData.status         = this.model.status;
     this.proData.rate           = this.model.rate;
     this.proData.sdate          = sDate;
     
      this.proData.edate        = eDate;
    
     this.proData.description    = this.model.description;

     if(this.users.length || this.data.length)
     {
        this.proData.assign  = 1;
     }else{
        this.proData.assign  = 0;
     }
      

			this.http.post(API_URL+'/projects/update?where=%7B%22id%22%3A%20%22'+this.editparam.id+'%22%7D&access_token='+ localStorage.getItem('currentUserToken'), this.proData,  options)
	        .subscribe(data => {
	      if(data)
	      {
          this.sData   = data.json();

          if(this.data.length)
          {

              this.checkUser = 0;
               for(let i=0; i< this.data.length; i++ ) {
                  let projectId             = this.editparam.id; 
                  let memberId              = this.data[i].member_id;
                  let assId                 = this.data[i].id;
                  this.assData.percentage   = this.data[i].percentage; 

                  this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%22'+assId+'%22%7D&access_token='+ localStorage.getItem('currentUserToken'), this.assData,  options)
                  .subscribe(data => {

                  });  
              }   
          }

          if(this.users.length)
          {
             
             for(let i=0; i< this.users.length; i++ ) {  

              this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.users[i].member_id+'"},{"project_id":"'+this.editparam.id+'"}]}}&access_token='+ localStorage.getItem('currentUserToken'), options)
            .subscribe(response => {      
              
              if(response.json().length)
              {
                if(response.json()[i].assign == 0)
                {
                  this.assData2.percentage    = this.users[i].percentage;  
                  this.assData2.assign        = "1";

                  this.http.post(API_URL+'/assignprojects/update?where=%7B%22id%22%3A%20%22'+response.json()[i].id+'%22%7D&access_token='+ localStorage.getItem('currentUserToken'), this.assData2,  options)
                      .subscribe(data => { 
                      
                  });
                  
                }else{
                  
                  this.checkUser += 2;
                  this.toasterService.pop('error', 'error ', "Contractor has already exist!");
                }
                
              }else{

                  this.assData.project_id    = this.editparam.id; 
                  this.assData.member_id     = this.users[i].member_id; 
                  this.assData.percentage    = this.users[i].percentage; 
                  this.assData.assign        = "1"; 
                  this.checkUser = 0;

                  this.http.post(API_URL+'/assignprojects?access_token='+localStorage.getItem('currentUserToken'), this.assData, options).subscribe(data => {
                    
                    
                });
                
              }

            });
              
              

              }
          }
	        //this.proEditStatus = 1;
          
          if(this.checkUser == 0)
          {
            this.toasterService.pop('success', 'Updated ', "Project has updated successfully!");
          }
	      }else{
	        //this.proEditStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
	      }
	    });
      this.disProject();
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
     

     



     this.proData.member_id         = localStorage.getItem("currentUserId");
     this.proData.client_id         = this.model.client_id;
     //this.proData.email             = this.model.email;
     this.proData.custom_project_id = this.custom_project_id;
     this.proData.project_name      = this.model.project_name;
     this.proData.project_code      = this.model.project_code;
     this.proData.budget            = this.model.budget;
     this.proData.project_type      = this.model.project_type;
     this.proData.status            = this.model.status;
     this.proData.rate              = this.model.rate;
     this.proData.sdate             = sDate;
     
      this.proData.edate            = eDate;
     

     this.proData.description       = this.model.description;
     this.proData.cdate             = strDate;

     if(this.users.length)
     {
        this.proData.assign  = 1;
     }else{
        this.proData.assign  = 0;
     }



	   this.http.post(API_URL+'/projects?access_token='+localStorage.getItem('currentUserToken'), this.proData, options).subscribe(data => {
	      if(data)
	      {
          this.sData     = data.json();
          this.checkUser = 0;
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
	        //this.proStatus = 1;
          if(this.checkUser == 0)
          {
            this.toasterService.pop('success', 'Added ', "Project has added successfully!");
          }
          
	      }else{
	        //this.proStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
	      }
	    });
    this.disProject();
	}
  } 

}
