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

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

@Component({
  templateUrl: 'timesheet.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TimesheetsComponent {
@ViewChild('f') formValues;
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
editparam: any;
public seldata: any = {};
public conData: any;
public proData: any;
sheetData: any = {};
sheettimeData:any = '';
//timesheetStatusData:any = '';
editsheetData: any = {};
prodel: any;
public datesData:any = [];
checkData: any = 0;
cuStime: any = 0;
addData: any = 0;
memberId: any = 0;
addTimeForm: any = 0;
formDis: any = 0;
currentUserID: any = 0;
currentRoleId: any = 0;
contractorId: any = 0;
timeReq: any = 0;
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
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }



  //this.timesheetStatusData = 'active';
  this.memberId    = localStorage.getItem('currentUserId');
  this.checkData = 0;
  this.sheetStatus = '';
  let todayDate = new Date();
  this.seldata  = todayDate;
  let tMonth  = todayDate.getMonth()+1;
  let tDay      = todayDate.getDate();
  let months    = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let curMonth  = months[todayDate.getMonth()];
  let days      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let curDay    = todayDate.getDay();

  let tinc = 1;
  let binc = 0;


for(let i=0; i<= 30; i++) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() - i);
    let lastDay = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
    if(nextDay.getDate() == lastDay.getDate() && i!=0)
    {
      tinc  = tinc + 1;
      binc  = binc + 1;
    }

    let strDate = (nextDay.getMonth()-tinc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
      this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()-binc]+'_'+nextDay.getDate()+'_'+strDate;
  
  }

  let lastMonthDay = todayDate.getDate() + 1;
  let lastMonthM   = tMonth - 1;

  this.sheettimeData = lastMonthM+"/"+lastMonthDay+"/2019 - "+tMonth+"/"+todayDate.getDate()+"/2019";

    
    let userID = localStorage.getItem('currentUserId');
    this.currentUserID = localStorage.getItem('currentUserId');
    this.currentRoleId = localStorage.getItem('currentUserRoleId');
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

              this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"},{"status":"active"}]},"order":"id ASC"}', options)
                .subscribe(response => {
              this.conData = response.json();
            });

            

          if(localStorage.getItem('currentUserRoleId') == '1')
          {   

           this.http.get(API_URL+'/assignprojects?filter={"limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                this.contractorId = response.json()[0].member_id;
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
                    .subscribe(response => {
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
                            this.data[i].status      = response.json().status;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
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
                    
                    
                });
                this.checkData = 1;
              }else{
                this.contractorId = 0;
                this.checkData = 2;
                this.toasterService.pop('error', 'error ', "No Timesheet Found!");
              }

            });

          }else{

            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.currentUserID+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                this.contractorId = response.json()[0].member_id;
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
                    .subscribe(response => {
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
                            this.data[i].status      = response.json().status;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
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
                    
                });
                this.checkData = 1;
              }else{
                this.contractorId = 0;
                this.checkData = 2;
                this.toasterService.pop('error', 'error ', "No Timesheet Found!");
              }

            });
          }

   this.toasterService = toasterService;
  }


  resetTimeForm(form){
    this.formValues.resetForm();
  }


onSelectCont(contId)
{
  this.toasterService.clear();
  if(contId)
  {
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');
            
    this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+contId+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                this.contractorId = contId;
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+contId+'"}]}}', options)
                    .subscribe(response => {
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
                            this.data[i].status      = response.json().status;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
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
                   
                });
                this.checkData = 1;
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('error', 'error ', "No Timesheet Found!");
              }

            });
  }
  
}


  getRate(totalStime, type, budget, rate, percentage)
  {
    if(rate!=undefined && totalStime!=undefined)
    {
          let hrate = Number((rate * percentage) / 100);
          let amH = 0, amM = 0, tHours = 0, amount = 0;
          amH += parseInt(totalStime.split(':')[0]);
          amM += parseInt(totalStime.split(':')[1]);
          tHours = (amH + amM);
          amount = (tHours * hrate);
          return hrate;
    }
    
  }

  getDate(cDate, proId, stime, des, tsId, memId, fullstime, index)
  {

    if(this.addTimeForm == 0)
    {
      this.addTimeForm = 1;
      this.formDis = proId+'_'+index;
    }else{
      if(index == this.formDis.split('_')[1])
      {
        this.addTimeForm = 0;
        this.formDis = proId+'_'+index;
      }else{
        this.addTimeForm = 1;
        this.formDis = proId+'_'+index;
      }
      
    }
    
    this.sheetStatus = '';
    this.checkData = 1;
    this.addData = 0;
    localStorage.setItem("cDate", cDate);
    localStorage.setItem("proId", proId);
    localStorage.setItem("tsId", tsId);
    localStorage.setItem("memId", memId);
    //this.cuStime = stime;
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
      let calHourlyAmt = 0, calHourAmt = 0, calMinAmt = 0;
      let hrate = Number((rate * percentage) / 100);
      calHourAmt = totalStime.split(':')[0] * hrate;
      calMinAmt  = (totalStime.split(':')[1] / 60) * hrate;
      calHourlyAmt =   calHourAmt + calMinAmt;
      return calHourlyAmt.toFixed(2);
  }
  
}

onPickSheet(pickDate)
{
  if(pickDate.length == undefined)
  {
      let todayDate = new Date();
      this.seldata  = todayDate;
      //let tMonth  = todayDate.getMonth()+1;
      let tDay      = todayDate.getDate();
      let months    = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let curMonth  = months[todayDate.getMonth()];
      let days      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let curDay    = todayDate.getDay();

      let tinc = 1;
      let binc = 0;


    /*for(let i=0; i<= 30; i++ ) {
        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + i);
        if(nextDay.getDate() == 1 && i!=0)
        {
          tinc  = tinc + 1;
          binc  = binc + 1;
        }

        let strDate = (nextDay.getMonth()+tinc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
          this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()+binc]+'_'+nextDay.getDate()+'_'+strDate;
      
      }*/

for(let i=0; i<= 30; i++) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() - i);
    let lastDay = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
    if(nextDay.getDate() == lastDay.getDate() && i!=0)
    {
      tinc  = tinc + 1;
      binc  = binc + 1;
    }

    let strDate = (nextDay.getMonth()-tinc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
      this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()-binc]+'_'+nextDay.getDate()+'_'+strDate;
  
  }

  }else{
    this.seldata  = pickDate[0];
    //let strDate = pickDate.getDate() + "/" + (pickDate.getMonth()+1) + "/" + pickDate.getFullYear();
      this.datesData = [];
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
      

      let tinc = 1;
      let binc = 0;

      for(let i=0; i<= tDays; i++ ) {
      let nextDay = new Date(pickDate[0]);
      nextDay.setDate(nextDay.getDate() + i);

      if(nextDay.getDate() == 1 && i!=0)
      {
        tinc  = tinc + 1;
        binc  = binc + 1;
      }

      let strDate = (nextDay.getMonth()+tinc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
        this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()+binc]+'_'+nextDay.getDate()+'_'+strDate;

    }

  }


  let userID = localStorage.getItem('currentUserId');
    //this.currentUserID = localStorage.getItem('currentUserId');
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

          if(localStorage.getItem('currentUserRoleId') == '1')
          {
            
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                //this.contractorId = this.contractorId;
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
                    .subscribe(response => {
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
                            this.data[i].status      = response.json().status;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
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
                   
                });
                this.checkData = 1;
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('error', 'error ', "No Timesheet Found!");
              }

            });
          }else{
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.currentUserID+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.currentUserID+'"}]}}', options)
                    .subscribe(response => {
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
                            this.data[i].status      = response.json().status;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
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
                   
                });
                this.checkData = 1;
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('error', 'error ', "No Timesheet Found!");
              }

            });

          }
}

checkTimesheet(form:any)
{
  if(form.stime=='')
  {
    this.toasterService.clear();
    this.toasterService.pop('error', 'Error ', "Time is required");
  }
}

  onSubmit()
  {
      this.toasterService.clear();
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


              if(typeof this.model.stime=='object')
              {
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
                        this.toasterService.pop('success', 'Success ', "Time has added successfully."); 
                        this.addTimeForm = 0;
                        //setTimeout(function(){$(".close").trigger("click");}, 1000);
                      }else{
                        this.addData = 0;
                      }

                   });
                }else{
                  this.timeReq = 1;
                }

            }else{
              //this.sheetData.stime       = this.model.stime;
              this.editsheetData.description = this.model.description;
              let cdate                  = localStorage.getItem("cDate");
              let projectId              = localStorage.getItem("proId");
              let tsId                   = localStorage.getItem("tsId");
              let memberId               = localStorage.getItem('memId');
              //tsId                     = tsId.split('undefined')[0];

              if(typeof this.model.stime=='object')
              {
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
                this.toasterService.pop('success', 'Success ', "Time has updated successfully.");
                this.addTimeForm = 0;
                //setTimeout(function(){$(".close").trigger("click");}, 1000);
                //setTimeout(function(){location.reload();}, 1000);
              }else{
                this.timeReq = 1;
              }

              
              
            }

    
  }


}
