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
public seldata: any = {};
sheetData: any = {};
editsheetData: any = {};
prodel: any;
public datesData:any = [];
checkData: any = 0;
cuStime: any = 0;
addData: any = 0;
memberId: any = 0;
cuDes  : any;
sheetStatus  : any = '';
public data: any = [];
public model: any = {};
public filterQuery = '';

public hstep:number = 1;
public mstep:number = 15;
public ismeridian:boolean = true;
public isEnabled:boolean = true;

public mytime:Date = new Date();
public options:any = {
  hstep: [1, 2, 3],
  mstep: [1, 5, 10, 15, 25, 30]
};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }
    this.memberId    = localStorage.getItem('currentUserId');
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

          if(localStorage.getItem('currentUserRoleId') == '1')
          {  

            this.http.get(API_URL+'/assignprojects?filter={"order":"id DESC"}', options)
            .subscribe(response => {
            if(response.json().length)
            {
              this.data = response.json();
              
              for(let i=0; i< this.data.length; i++ ) {
              let stime = '', des = '', tsId = '';
                  this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => {      
                    this.data[i].projectname = response.json().project_name;  
                    this.data[i].member_id   = this.data[i].member_id;  
                    this.data[i].rate        = response.json().rate;  
                    this.data[i].type        = response.json().project_type;  
                    this.data[i].budget      = response.json().budget;  

                    this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => { 
                      this.data[i].membername = response.json().fname+' '+response.json().lname;
                  });
                    
                  });  
                  let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                  for(let j=0; j< this.datesData.length; j++ ) {
                    let userID    = localStorage.getItem('currentUserId');
                    let projectID = this.data[i].project_id;
                    let cDate     = this.datesData[j].split('_')[3];
                
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                    .subscribe(response => {    
                    //this.data[i].stime = '';
                    if(response.json().length)
                    {

                      tsId  += response.json()[0].id+'_';
                      stime += response.json()[0].stime+'_';
                      fullstime += response.json()[0].fullstime;
                      des   += response.json()[0].description+'_';
                    }else{
                       tsId += '-'+'_';
                       stime += '-'+'_';
                       fullstime += '@';
                       des += '-'+'_';
                    }
                    
                    this.data[i].tsId  = tsId;
                    this.data[i].stime = stime;
                    this.data[i].fullstime = fullstime;
                    this.data[i].des   = des;
                   });
                     ci++;
                  } 
                  
                }
              
              for(let i=0; i< this.data.length; i++ ) {
                let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+this.data[i].project_id+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                          .subscribe(response => { 
                          if(response.json().length)
                          { 
                            
                            for(let j=0; j< response.json().length; j++ ) {
                            //tDate   = new Date(response.json()[j].stime);
                            hours   = response.json()[j].stime.split(':')[0]; 
                            minutes = response.json()[j].stime.split(':')[1]; 

                            totalTime     += Number(hours);
                            totalMin      += Number(minutes);
                            }
                          }else{
                            this.data[i].totalStime = "0:00";
                          }
                          this.data[i].totalStime = totalTime+':'+totalMin;
                  });
              }
              
              this.checkData = 1;
            }else{
              this.checkData = 2;
            }
            
          }); 

          }else{

            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+userID+'"}]},"order":"id DESC"}', options)
            .subscribe(response => {
            if(response.json().length)
            {
              this.data = response.json();
              
              for(let i=0; i< this.data.length; i++ ) {
              let stime = '', des = '', tsId = '';
                  this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => {      
                    this.data[i].projectname = response.json().project_name;  
                    this.data[i].member_id   = this.data[i].member_id;  
                    this.data[i].rate        = response.json().rate;  
                    this.data[i].type        = response.json().project_type;  
                    this.data[i].budget      = response.json().budget;  

                    this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => { 
                      this.data[i].membername = response.json().fname+' '+response.json().lname;
                  });
                    
                  });  
                  let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                  for(let j=0; j< this.datesData.length; j++ ) {
                    let userID    = localStorage.getItem('currentUserId');
                    let projectID = this.data[i].project_id;
                    let cDate     = this.datesData[j].split('_')[3];
                
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                    .subscribe(response => {    
                    //this.data[i].stime = '';
                    if(response.json().length)
                    {
                      tsId  += response.json()[0].id+'_';
                      stime += response.json()[0].stime+'_';
                      fullstime += response.json()[0].fullstime;
                      des   += response.json()[0].description+'_';
                    }else{
                       tsId += '-'+'_';
                       stime += '-'+'_';
                       fullstime += '@';
                       des += '-'+'_';
                    }
                    
                    this.data[i].tsId  = tsId;
                    this.data[i].stime = stime;
                    this.data[i].fullstime = fullstime;
                    this.data[i].des   = des;
                   });
                     ci++;
                  } 
                  
                }
              
              for(let i=0; i< this.data.length; i++ ) {
                let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+this.data[i].project_id+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                          .subscribe(response => { 
                          if(response.json().length)
                          { 
                            for(let j=0; j< response.json().length; j++ ) {
                            //tDate   = new Date(response.json()[j].stime);
                            hours   = response.json()[j].stime.split(':')[0]; 
                            minutes = response.json()[j].stime.split(':')[1]; 

                            totalTime     += Number(hours);
                            totalMin      += Number(minutes);
                            }
                          }else{
                            this.data[i].totalStime = "0:00";
                          }
                          this.data[i].totalStime = totalTime+':'+totalMin;
                  });
              }
              
              this.checkData = 1;
            }else{
              this.checkData = 2;
            }
            
          }); 

          }

   
  }


  resetTimeForm(form){
  	this.formValues.resetForm();
  }





  getRate(totalStime, type, budget, rate, percentage)
  {
    if(rate!=undefined && totalStime!=undefined)
    {
      if(type=='hourly')
      {
        
          let hrate = Number((rate * percentage) / 100);
          let amH = 0, amM = 0, tHours = 0, amount = 0;
          amH += parseInt(totalStime.split(':')[0]);
          amM += parseInt(totalStime.split(':')[1]);
          tHours = (amH + amM);
          amount = (tHours * hrate);
          return hrate;
        
      }else{

    if(totalStime!=undefined)
    {
      
      let fixedRate, fixedHour = 0, fixedMin = 0, totalHours, famt = 0;
      if(totalStime.split(':')[0] != '0')
      {
        let fixedRateH = 0, fixedRateM = 0;
        famt = Number((budget * percentage) / 100);
        fixedHour  = parseInt(totalStime.split(':')[0]);
        fixedMin   = (totalStime.split(':')[1] / 60);
        totalHours = (fixedHour + fixedMin);
        fixedRate  = Math.round(famt / totalHours);
        let amount = (budget * percentage) / 100;
        return fixedRate;
      }else{
        if(totalStime=='0:0')
        {
          
          fixedRate = 0;
          //let amount = 0;
        }else{
        famt = Number((budget * percentage) / 100);
        let fixedMins;
        if(totalStime.split(':')[1] == '15')
         {
            fixedMins = 4;
         }
         if(totalStime.split(':')[1] == '30')
         {
            fixedMins = 2;
         }
         if(totalStime.split(':')[1] == '45')
         {
            fixedMins = 4/3;
         }
         if(totalStime.split(':')[1] == '60')
         {
            fixedMins = 1;
         }
          fixedHour = 0;
          //fixedMin   = this.getFraction(totalStime.split(':')[1] / 60);
          //fixedMins = fixedMins.split('/');
          fixedRate = (famt / fixedMins);
          //let amount = (budget * percentage) / 100;
        }
        
        return fixedRate;
      }
      
    }
      }
      
    }
    
  }

  getDate(cDate, proId, stime, des, tsId, memId, fullstime)
  {

    this.sheetStatus = '';
    this.checkData = 0;
  	this.addData = 0;
  	localStorage.setItem("cDate", cDate);
    localStorage.setItem("proId", proId);
    localStorage.setItem("tsId", tsId);
  	localStorage.setItem("memId", memId);
  	this.cuStime = stime;
  	this.cuDes   = des;
  	if(stime =='-' || des == '-')
  	{	
  		this.sheetStatus = 'add';
      this.model.stime = '';
      this.model.description   = '';
  	}else{
  		this.sheetStatus = 'edit';
  		this.model.stime = fullstime;
  		this.model.description   = des;
  	}
  }

getAmount(totalStime, type, budget, rate, percentage)
{
  if(totalStime!=undefined)
  { 
    if(type=='hourly')
    {
      let calHourlyAmt = 0, calHourAmt = 0, calMinAmt = 0;
      let hrate = Number((rate * percentage) / 100);
      calHourAmt = totalStime.split(':')[0] * hrate;
      calMinAmt  = (totalStime.split(':')[1] / 60) * hrate;
      calHourlyAmt =   calHourAmt + calMinAmt;
      return calHourlyAmt.toFixed(2);
    }else{
      let fixedRateH = 0, fixedRateM = 0, famt = 0, fixedHour = 0, fixedMin = 0, totalHours = 0, fixedRate = 0;
      if(totalStime.split(':')[0] != '0')
      {
        famt = Number((budget * percentage) / 100);
        fixedHour  = parseInt(totalStime.split(':')[0]);
        fixedMin   = (totalStime.split(':')[1] / 60);
        totalHours = (fixedHour + fixedMin);
        fixedRate  = Math.round(famt / totalHours);
        let amount = (budget * percentage) / 100;
        return amount;
      }else{
        let amount = 0;
        if(totalStime=='0:0')
        {
          
          fixedRate = 0;
          let amount = 0;
        }else{
        famt = Number((budget * percentage) / 100);
        let fixedMins;
         if(totalStime.split(':')[1] == '15')
         {
            fixedMins = 4;
         }
         if(totalStime.split(':')[1] == '30')
         {
            fixedMins = 2;
         }
         if(totalStime.split(':')[1] == '45')
         {
            fixedMins = '3/4';
         }
         if(totalStime.split(':')[1] == '60')
         {
            fixedMins = 1;
         }
          fixedHour = 0;
          //fixedMin   = this.getFraction(totalStime.split(':')[1] / 60);
          //fixedMins = fixedMins.split('/');
          fixedRate = (famt / fixedMins);
          amount = (budget * percentage) / 100;
        }
        
        return amount;
      }
    }
    
  }
  
}

onPickSheet(pickDate)
{
  //let strDate = pickDate.getDate() + "/" + (pickDate.getMonth()+1) + "/" + pickDate.getFullYear();

    this.seldata = pickDate;
    this.checkData = 0;
    this.sheetStatus = '';
    let todayDate = new Date(pickDate[0]);
    //let tMonth  = todayDate.getMonth()+1;
    let tDay      = todayDate.getDate();
    let months    = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let curMonth  = months[todayDate.getMonth()];
    let days      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let curDay    = todayDate.getDay();

    var tDays =  Math.floor(( Date.parse(pickDate[1]) - Date.parse(pickDate[0]) ) / 86400000); 

    for(let i=0; i<= tDays; i++ ) {
    let nextDay = new Date(pickDate[0]);
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

          if(localStorage.getItem('currentUserRoleId') == '1')
          {
            this.http.get(API_URL+'/assignprojects?filter={"order":"id DESC"}', options)
            .subscribe(response => {
            if(response.json().length)
            {
              this.data = response.json();
              
              for(let i=0; i< this.data.length; i++ ) {
              let stime = '', des = '', tsId = '';
                  this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => {      
                    this.data[i].projectname = response.json().project_name;  
                    this.data[i].member_id   = this.data[i].member_id;  
                    this.data[i].rate        = response.json().rate;  
                    this.data[i].type        = response.json().project_type;  
                    this.data[i].budget      = response.json().budget;  

                    this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => { 
                      this.data[i].membername = response.json().fname+' '+response.json().lname;
                  });
                    
                  });  
                  let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                  for(let j=0; j< this.datesData.length; j++ ) {
                    let userID    = localStorage.getItem('currentUserId');
                    let projectID = this.data[i].project_id;
                    let cDate     = this.datesData[j].split('_')[3];
                
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                    .subscribe(response => {    
                    this.data[i].stime = '';
                    if(response.json().length)
                    {
                        tsId  += response.json()[0].id+'_';
                        stime += response.json()[0].stime+'_';
                        fullstime += response.json()[0].fullstime;
                        des   += response.json()[0].description+'_';
                    }else{
                       tsId += '-'+'_';
                       stime += '-'+'_';
                       fullstime += '@';
                       des += '-'+'_';
                    }
                   
                    this.data[i].tsId  = tsId;
                    this.data[i].stime = stime;
                    this.data[i].fullstime = fullstime;
                    this.data[i].des   = des;
                   });
                     ci++;
                  } 
                  
                }
              
              for(let i=0; i< this.data.length; i++ ) {
                let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+this.data[i].project_id+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                          .subscribe(response => { 
                          if(response.json().length)
                          { 
                            for(let j=0; j< response.json().length; j++ ) {
                            //tDate   = new Date(response.json()[j].stime);
                            hours   = response.json()[j].stime.split(':')[0]; 
                            minutes = response.json()[j].stime.split(':')[1]; 

                            totalTime     += Number(hours);
                            totalMin      += Number(minutes);
                            }
                          }else{
                            this.data[i].totalStime = "0:00";
                          }
                          this.data[i].totalStime = totalTime+':'+totalMin;
                  });
              }
              
              this.checkData = 1;
            }else{
              this.checkData = 2;
            }
            
          }); 

          }else{

            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+userID+'"}]},"order":"id DESC"}', options)
            .subscribe(response => {
            if(response.json().length)
            {
              this.data = response.json();
              
              for(let i=0; i< this.data.length; i++ ) {
              let stime = '', des = '', tsId = '';
                  this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => {      
                    this.data[i].projectname = response.json().project_name;  
                    this.data[i].member_id   = this.data[i].member_id;  
                    this.data[i].rate        = response.json().rate;  
                    this.data[i].type        = response.json().project_type;  
                    this.data[i].budget      = response.json().budget;  

                    this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                  .subscribe(response => { 
                      this.data[i].membername = response.json().fname+' '+response.json().lname;
                  });
                    
                  });  
                  let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                  for(let j=0; j< this.datesData.length; j++ ) {
                    let userID    = localStorage.getItem('currentUserId');
                    let projectID = this.data[i].project_id;
                    let cDate     = this.datesData[j].split('_')[3];
                
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                    .subscribe(response => {    
                    this.data[i].stime = '';
                    if(response.json().length)
                    {
                        tsId  += response.json()[0].id+'_';
                        stime += response.json()[0].stime+'_';
                        fullstime += response.json()[0].fullstime;
                        des   += response.json()[0].description+'_';
                    }else{
                       tsId += '-'+'_';
                       stime += '-'+'_';
                       fullstime += '@';
                       des += '-'+'_';
                    }
                    
                    this.data[i].tsId  = tsId;
                    this.data[i].stime = stime;
                    this.data[i].fullstime = fullstime;
                    this.data[i].des   = des;
                   });
                     ci++;
                  } 
                  
                }
              
              for(let i=0; i< this.data.length; i++ ) {
                let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                  this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+this.data[i].project_id+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                          .subscribe(response => { 
                          if(response.json().length)
                          { 
                            for(let j=0; j< response.json().length; j++ ) {
                              //tDate   = new Date(response.json()[j].stime);
                              hours   = response.json()[j].stime.split(':')[0]; 
                              minutes = response.json()[j].stime.split(':')[1]; 

                              totalTime     += Number(hours);
                              totalMin      += Number(minutes);
                            }
                          }else{
                            this.data[i].totalStime = "0:00";
                          }
                          this.data[i].totalStime = totalTime+':'+totalMin;
                  });
              }
              this.checkData = 1;
            }else{
              this.checkData = 2;
            }
            
          }); 

          }
}

  onSubmit()
  {

  	  let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

            if(this.sheetStatus=='add')
            {
              //this.sheetData.stime       = this.model.stime;
              this.sheetData.description = this.model.description;
              this.sheetData.cdate       = localStorage.getItem("cDate");
              this.sheetData.project_id  = localStorage.getItem("proId");
              this.sheetData.member_id   = localStorage.getItem('memId');

              let hours   = this.model.stime.getHours(); 
              let minutes = this.model.stime.getMinutes(); 

              if(minutes == 0)
              {
                minutes = '00';
              }

              this.sheetData.stime       = hours+':'+minutes;
              this.sheetData.fullstime   = this.model.stime;


            	this.http.post(API_URL+'/timesheets?access_token='+localStorage.getItem('currentUserToken'), this.sheetData, options).subscribe(response => {
              let keys = Object.keys(response.json());
              let len = keys.length;
		              if(len > 0)
		              {
		                //this.data = response.json();
		                this.addData = 1;
                    //setTimeout(function(){location.reload();}, 1000);
                    if(this.seldata==undefined)
                    {
                      this.onPickSheet(new Date());
                    }else{
                      this.onPickSheet(this.seldata);
                    }
                    setTimeout(function(){$(".close").trigger("click");}, 1000);
		              }else{
		                this.addData = 0;
		              }

		           });
            }else{
            	//this.sheetData.stime       = this.model.stime;
	            this.editsheetData.description = this.model.description;
	            let cdate                  = localStorage.getItem("cDate");
              let projectId              = localStorage.getItem("proId");
	            let tsId                   = localStorage.getItem("tsId");
	            let memberId               = localStorage.getItem('memId');
              //tsId                     = tsId.split('undefined')[0];


              let hours   = this.model.stime.getHours(); 
              let minutes = this.model.stime.getMinutes(); 

              if(minutes == 0)
              {
                minutes = '00';
              }

              this.editsheetData.stime       = hours+':'+minutes;
              this.editsheetData.fullstime   = this.model.stime;

              if(tsId.indexOf(undefined) != -1){
                  tsId = tsId.split('undefined')[1];
              }

              this.http.post(API_URL+'/timesheets/update?where=%7B%22id%22%3A%22'+tsId+'%22%7D', this.editsheetData,  options)
                  .subscribe(data => {

                  }); 
            	this.addData = 2;
              if(this.seldata==undefined)
              {
                this.onPickSheet(new Date());
              }else{
                this.onPickSheet(this.seldata);
              }
              
              setTimeout(function(){$(".close").trigger("click");}, 1000);
              //setTimeout(function(){location.reload();}, 1000);
              
            }

  	
  }


}
