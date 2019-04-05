import { Component, OnInit, VERSION } from '@angular/core';
import { FormGroup }  from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';

@Component({
  templateUrl: 'timesheet.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss'],
})

export class TimesheetsComponent {
@ViewChild('f') formValues;
editparam: any;
sheetData: any = {};
prodel: any;
public datesData:any = [];
checkData: any = 0;
cuStime: any = 0;
cuDes  : any;
sheetStatus  : any = '';
public data: any = [];
public model: any = {};
public filterQuery = '';
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }
    this.checkData = 0;
    this.sheetStatus = '';
    let todayDate = new Date();
    //let tMonth  = todayDate.getMonth()+1;
    let tDay      = todayDate.getDate();
    let months    = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let curMonth  = months[todayDate.getMonth()];
	let days      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let curDay    = todayDate.getDay();

    for(let i=0; i<= 6; i++ ) {
	    let nextDay = new Date();
		nextDay.setDate(nextDay.getDate() + i);
    	let strDate = nextDay.getDate() + "/" + (nextDay.getMonth()+1) + "/" + nextDay.getFullYear();

    	this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()]+'_'+nextDay.getDate()+'_'+strDate;
    	
	}

    
    let userID = localStorage.getItem('currentUserId');
		//this.currentUserID = localStorage.getItem('currentUserId');
		let options = new RequestOptions();
		        options.headers = new Headers();
		        options.headers.append('Content-Type', 'application/json');
		        options.headers.append('Accept', 'application/json');


		        this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+userID+'"}]},"order":"id DESC"}', options)
		        .subscribe(response => {
		        //console.log(response.json())
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	let stime = '', des = '';
		        	for(let i=0; i< this.data.length; i++ ) {
			            this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
			            .subscribe(response => {      
			              this.data[i].projectname = response.json().project_name;  
			              this.data[i].rate        = response.json().rate;  
			            });  

			            for(let j=0; j< this.datesData.length; j++ ) {
					    	let userID    = localStorage.getItem('currentUserId');
						    let projectID = this.data[i].project_id;
						    let cDate     = this.datesData[j].split('_')[3];
						    
					        this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+userID+'"}, {"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}]}}', options)
							.subscribe(response => {    
							//console.log(response.json())
							//console.log(response.json().length)
							if(response.json().length)
							{
								stime += response.json()[0].stime+'_';
                				des += response.json()[0].description+'_';
							}else{
								stime += ''+'_';
                				des += ''+'_';
							}
							
							this.data[i].stime  = stime; 
                      		this.data[i].des    = des;	
						    	
					        });
						   } 
			          }
			          //console.log(this.data) 
		        	//this.checkData = 1;
		        }else{
		        	//this.checkData = 0;
		        }

		      });	 

   
  }


  resetTimeForm(form){
  	this.formValues.resetForm();
  }

  getDate(cDate, proId, stime, des)
  {
    this.sheetStatus = '';
  	this.checkData = 0;
  	localStorage.setItem("cDate", cDate);
  	localStorage.setItem("proId", proId);
  	this.cuStime = stime;
  	this.cuDes   = des;
  	//console.log(localStorage.getItem("stime"))
  	console.log(des+'================')
  	if(des == '')
  	{	
  		this.sheetStatus = 'add';
  	}else{
  		this.sheetStatus = 'edit';
  		this.model.stime = stime;
  		this.model.des   = des;
  	}
  }


  onSubmitSheettime()
  {

  	//console.log(this.model)
  }

  onSubmit()
  {

  	  let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

            this.sheetData.stime       = this.model.stime;
            this.sheetData.description = this.model.description;
            this.sheetData.cdate       = localStorage.getItem("cDate");
            this.sheetData.project_id  = localStorage.getItem("proId");
            this.sheetData.member_id   = localStorage.getItem('currentUserId');

            console.log(this.sheetStatus)

            if(this.sheetStatus=='add')
            {
            	this.http.post(API_URL+'/timesheets?access_token='+localStorage.getItem('currentUserToken'), this.sheetData, options).subscribe(response => {
            	console.log(response.json())
		          let keys = Object.keys(response.json());
				  let len = keys.length;
				  console.log(len)
		              if(len == 6)
		              {
		                //this.data = response.json();
		                this.checkData = 1;
		              }else{
		                this.checkData = 0;
		              }

		           });
            }else{
            	this.sheetData.stime       = this.model.stime;
	            this.sheetData.description = this.model.description;
	            let cdate                  = localStorage.getItem("cDate");
	            let projectId              = localStorage.getItem("proId");
	            let memberId               = localStorage.getItem('currentUserId');

            	this.http.post(API_URL+'/timesheets/update?where={"member_id":"'+memberId+'","project_id":"'+projectId+'","cdate":"'+cdate+'"}', this.sheetData,  options)
                  .subscribe(data => {
          		});

            	//console.log(this.sheetStatus)
            	//console.log(this.model)
            	this.checkData = 2;
            }

          
  	
  }


}
