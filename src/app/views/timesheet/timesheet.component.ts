import { Component, OnInit, VERSION } from '@angular/core';
import { ViewEncapsulation, ViewChild } from '@angular/core';
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
//import { ViewChild } from '@angular/core';

@Component({
  templateUrl: 'timesheet.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TimesheetsComponent {
@ViewChild('f') formValues;
editparam: any;
sheetData: any = {};
prodel: any;
public datesData:any = [];
checkData: any = 0;
cuStime: any = 0;
addData: any = 0;
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
    	let strDate = (nextDay.getMonth()+1) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();

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
		        if(response.json().length)
		        {
		        	this.data = response.json();
		        	let stime = '', des = '', tsId = '';
		        	for(let i=0; i< this.data.length; i++ ) {
			            this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
			            .subscribe(response => {      
			              this.data[i].projectname = response.json().project_name;  
                    this.data[i].rate        = response.json().rate;  
                    this.data[i].type        = response.json().project_type;  
                    this.data[i].budget      = response.json().budget;  
			              this.data[i].hourlyRate  = (response.json().rate * this.data[i].percentage) / 100;  
                    if(response.json().project_type =='fixed')
                    {
                      this.data[i].amount = (response.json().budget * this.data[i].percentage) / 100; 
                    }
			            });  
                  let ci = 1, totalStime=0, totalMin = 0, totalTime=0;
			            for(let j=0; j< this.datesData.length; j++ ) {
    					    	let userID    = localStorage.getItem('currentUserId');
    						    let projectID = this.data[i].project_id;
    						    let cDate     = this.datesData[j].split('_')[3];
						    
					        this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+userID+'"}, {"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}]}}', options)
      							.subscribe(response => {    
      							if(response.json().length)
      							{
                        

                      if(ci == 1)
                      {
                        this.data[i].tsId   = response.json()[0].id+'_';
                        this.data[i].stime  = response.json()[0].stime+'_';
                        this.data[i].des    = response.json()[0].description+'_';
                        totalTime           = Number(response.json()[0].stime.split(':')[0]);
                        totalMin            = Number(response.json()[0].stime.split(':')[1]);
                        
                        //this.data[i].totalStime = totalTime+':'+totalMin;
                      }else{
                        totalTime     += Number(response.json()[0].stime.split(':')[0]);
                        totalMin      += Number(response.json()[0].stime.split(':')[1]);
                        if(this.data[i].stime!=undefined)
                        {
                          this.data[i].stime += response.json()[0].stime+'_';
                          this.data[i].des   += response.json()[0].description+'_';
                          this.data[i].tsId  += response.json()[0].id+'_';
                        }else{
                          this.data[i].stime = response.json()[0].stime+'_';
                          this.data[i].des   = response.json()[0].description+'_';
                          this.data[i].tsId  += response.json()[0].id+'_';
                        }
                        
                        this.data[i].totalStime = totalTime+':'+totalMin;
                      }
                      
      							}else{
                    if(this.data[i].totalStime==undefined)
                    {
                      this.data[i].totalStime = "0:00";
                    }
                      if(ci == 1)
                      {
                        this.data[i].tsId  = '-'+'_';
                        this.data[i].stime = '-'+'_';
                        this.data[i].des   = '-'+'_';
                      }else{
                        if(this.data[i].stime!=undefined)
                        {
                          this.data[i].tsId  += '-'+'_';
                          this.data[i].stime += '-'+'_';
                          this.data[i].des   += '-'+'_';
                        }else{
                          this.data[i].tsId  = '-'+'_';
                          this.data[i].stime = '-'+'_';
                          this.data[i].des   = '-'+'_';
                        }
                      }
      							}
						    	
					         });
                     ci++;
						      } 
                  
			          }
		        	this.checkData = 1;
		        }else{
		        	this.checkData = 2;
		        }

		      });	
   
  }


  resetTimeForm(form){
  	this.formValues.resetForm();
  }

  getFraction(decimal) {

    if (!decimal) {
        decimal = this;

    }
    let whole = String(decimal).split('.')[0];
    decimal = parseFloat("." + String(decimal).split('.')[1]);
    let num = "1";
    for (let z = 0; z < String(decimal).length - 2; z++) {
        num += "0";
    }
    decimal = decimal * num;
    num = parseInt(num);
    for (z = 2; z < decimal + 1; z++) {
        if (decimal % z == 0 && num % z == 0) {
            decimal = decimal / z;
            num = num / z;
            z = 2;
        }
    }
    //if format of fraction is xx/xxx
    if (decimal.toString().length == 2 && num.toString().length == 3) {
        //reduce by removing trailing 0's
        decimal = Math.round(Math.round(decimal) / 10);
        num = Math.round(Math.round(num) / 10);
    }
    //if format of fraction is xx/xx
    else if (decimal.toString().length == 2 && num.toString().length == 2) {
        decimal = Math.round(decimal / 10);
        num = Math.round(num / 10);
    }
    //get highest common factor to simplify
    //var t = HCF(decimal, num);

    //return the fraction after simplifying it
    return ((whole == 0) ? "" : whole + " ") + decimal  + "/" + num ;
}

  getFixedRate(famt, ftime)
  {
    if(ftime!=undefined)
    {
      
      let fixedRate = 0, fixedHour = 0, fixedMin = 0, totalHours;
      if(ftime.split(':')[0] != '0')
      {
        let fixedRateH = 0, fixedRateM = 0;
        fixedHour  = ftime.split(':')[0];
        fixedMin   = (ftime.split(':')[1] / 60);
        totalHours = parseInt(fixedHour) + parseFloat(fixedMin);
        fixedRate  = (famt / totalHours);
      }else{
        if(ftime.split(':')[1]=='00')
        {
          
          fixedRate = 0;
        }else{
          fixedHour = 0;
          fixedMin   = this.getFraction(ftime.split(':')[1] / 60);
          totalHours = fixedMin.split('/');
          fixedRate = (famt * parseInt(totalHours[0]) / parseInt(totalHours[1]);
        }
        

      }
      return parseInt(fixedRate);
    }
  }

  getDate(cDate, proId, stime, des, tsId)
  {
    
    this.sheetStatus = '';
    this.checkData = 0;
  	this.addData = 0;
  	localStorage.setItem("cDate", cDate);
    localStorage.setItem("proId", proId);
  	localStorage.setItem("tsId", tsId);
  	this.cuStime = stime;
  	this.cuDes   = des;
  	if(stime =='-' || des == '-')
  	{	
  		this.sheetStatus = 'add';
      this.model.stime = '';
      this.model.description   = '';
  	}else{
  		this.sheetStatus = 'edit';
  		this.model.stime = stime;
  		this.model.description   = des;
  	}
  }

getAmount(time, hrate)
{
  if(time!=undefined)
  { 
    let calHourlyAmt = 0, calHourAmt = 0, calMinAmt = 0;
    calHourAmt = time.split(':')[0] * hrate;
    calMinAmt  = (time.split(':')[1] / 60) * hrate;
    calHourlyAmt =   calHourAmt + calMinAmt;
    return calHourlyAmt.toFixed(2);
  }
  
}

onPickSheet(pickDate)
{
  //let strDate = pickDate.getDate() + "/" + (pickDate.getMonth()+1) + "/" + pickDate.getFullYear();

    this.checkData = 0;
    this.sheetStatus = '';
    let todayDate = new Date(pickDate);
    //let tMonth  = todayDate.getMonth()+1;
    let tDay      = todayDate.getDate();
    let months    = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let curMonth  = months[todayDate.getMonth()];
    let days      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let curDay    = todayDate.getDay();

    for(let i=0; i<= 6; i++ ) {
    let nextDay = new Date(pickDate);
      nextDay.setDate(nextDay.getDate() + i);
      let strDate = (nextDay.getMonth()+1) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();

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
            if(response.json().length)
            {
              this.data = response.json();
              let stime = '', des = '', tsId = '';
              for(let i=0; i< this.data.length; i++ ) {
                  this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => {      
                    this.data[i].projectname = response.json().project_name;  
                    this.data[i].rate        = response.json().rate;  
                    this.data[i].type        = response.json().project_type;  
                    this.data[i].budget      = response.json().budget;  
                    this.data[i].hourlyRate  = (response.json().rate * this.data[i].percentage) / 100;  
                    if(response.json().project_type =='fixed')
                    {
                      this.data[i].amount = (response.json().budget * this.data[i].percentage) / 100; 

                    }
                  });  
                  let ci = 1, totalStime=0, totalMin = 0, totalTime=0;
                  for(let j=0; j< this.datesData.length; j++ ) {
                    let userID    = localStorage.getItem('currentUserId');
                    let projectID = this.data[i].project_id;
                    let cDate     = this.datesData[j].split('_')[3];
                
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+userID+'"}, {"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}]}}', options)
                    .subscribe(response => {    
                    if(response.json().length)
                    {

                      if(ci == 1)
                      {
                        this.data[i].tsId   = response.json()[0].id+'_';
                        this.data[i].stime  = response.json()[0].stime+'_';
                        this.data[i].des    = response.json()[0].description+'_';
                        totalTime           = Number(response.json()[0].stime.split(':')[0]);
                        totalMin            = Number(response.json()[0].stime.split(':')[1]);
                        
                        //this.data[i].totalStime = totalTime+':'+totalMin;
                      }else{
                        totalTime     += Number(response.json()[0].stime.split(':')[0]);
                        totalMin      += Number(response.json()[0].stime.split(':')[1]);
                        
                        this.data[i].tsId  += response.json()[0].id+'_';
                        if(this.data[i].stime!=undefined)
                        {
                          this.data[i].stime += response.json()[0].stime+'_';
                          this.data[i].des   += response.json()[0].description+'_';
                          this.data[i].tsId  += response.json()[0].id+'_';
                        }else{
                          this.data[i].stime = response.json()[0].stime+'_';
                          this.data[i].des   = response.json()[0].description+'_';
                          this.data[i].tsId  = response.json()[0].id+'_';
                        }
                        this.data[i].totalStime = totalTime+':'+totalMin;
                      }
                      
                    }else{
                    if(this.data[i].totalStime==undefined)
                    {
                      this.data[i].totalStime = "0:00";
                    }
                      if(ci == 1)
                      {
                        this.data[i].tsId  = '-'+'_';
                        this.data[i].stime = '-'+'_';
                        this.data[i].des   = '-'+'_';
                      }else{
                        if(this.data[i].stime!=undefined)
                        {
                          this.data[i].tsId  += '-'+'_';
                          this.data[i].stime += '-'+'_';
                          this.data[i].des   += '-'+'_';
                        }else{
                          this.data[i].tsId  = '-'+'_';
                          this.data[i].stime = '-'+'_';
                          this.data[i].des   = '-'+'_';
                        }
                      }
                    }
                  
                   });
                     ci++;
                  } 
                  
                }
                //console.log(this.data) 
              this.checkData = 1;
            }else{
              this.checkData = 2;
            }

          }); 

  //console.log(this.datesData)
}

  onSubmit()
  {

  	  let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

            //console.log(this.sheetStatus)

            if(this.sheetStatus=='add')
            {
              this.sheetData.stime       = this.model.stime;
              this.sheetData.description = this.model.description;
              this.sheetData.cdate       = localStorage.getItem("cDate");
              this.sheetData.project_id  = localStorage.getItem("proId");
              this.sheetData.member_id   = localStorage.getItem('currentUserId');


            	this.http.post(API_URL+'/timesheets?access_token='+localStorage.getItem('currentUserToken'), this.sheetData, options).subscribe(response => {
            	//console.log(response.json())
		          let keys = Object.keys(response.json());
				  let len = keys.length;
				  //console.log(len)
		              if(len == 6)
		              {
		                //this.data = response.json();
		                this.addData = 1;
		              }else{
		                this.addData = 0;
		              }

		           });
            }else{
            //console.log(this.sheetData)
            	this.sheetData.stime       = this.model.stime;
	            this.sheetData.description = this.model.description;
	            let cdate                  = localStorage.getItem("cDate");
              let projectId              = localStorage.getItem("proId");
	            let tsId                   = localStorage.getItem("tsId");
	            let memberId               = localStorage.getItem('currentUserId');
              //tsId                       = tsId.split('undefined')[0];

              if(tsId.indexOf(undefined) != -1){
                  tsId = tsId.split('undefined')[1];
              }

              this.http.post(API_URL+'/timesheets/update?where=%7B%22id%22%3A%22'+tsId+'%22%7D', this.sheetData,  options)
                  .subscribe(data => {

                  }); 

            	//console.log(this.sheetStatus)
            	//console.log(this.model)
            	this.addData = 2;
            }

          
  	
  }


}
