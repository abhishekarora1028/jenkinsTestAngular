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

import { PopoverModule } from 'ngx-bootstrap/popover';

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
timesheetStatusData:any = '';
editsheetData: any = {};
prodel: any;
public datesData:any = [];
checkData: any = 0;
cuStime: any = 0;
addData: any = 0;
memberId: any = 0;
cDate: any = 0;
proId: any = 0;
tsId: any = 0;
memId: any = 0;
addTimeForm: any = 0;
formDis: any = 0;
currentUserID: any = 0;
currentRoleId: any = 0;
contractorId: any = 0;
timeReq: any = 0;
cuDes  : any;
sheetStatus  : any = '';
public data: any = [];
//public data: any = {};
public model: any = {};
public projectData: any = {};
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



  this.timesheetStatusData = 'active';
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

  let tinc = 0;
  let binc = 1;

  this.datesData = [];


for(let i=0; i<= 30; i++) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() - i);
    let lastDay = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
    if(nextDay.getDate() == lastDay.getDate() && i!=0)
    {
      tinc  = tinc + 1;
      binc  = binc - 1;
    }

     let strDate = (todayDate.getMonth()+binc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
     this.datesData[i]   = strDate;

      //this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()+binc]+'_'+nextDay.getDate()+'_'+strDate;
  
  }

  let lastMonthDay = todayDate.getDate() + 1;
  let lastMonthM   = tMonth - 1;

  this.sheettimeData = lastMonthM+"/"+lastMonthDay+"/"+todayDate.getFullYear()+" - "+tMonth+"/"+todayDate.getDate()+"/"+todayDate.getFullYear();

    
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
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/assignprojects?filter={"limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }

                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });

          if(result.length)
          {     
                this.data = [];
                for(let i=0; i< result.length; i++ ) {
                  let stime = '', des = '', tsId = '';
                  
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.contractorId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.contractorId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                          let datalength = this.data.length;

                          for(let i=0; i< datalength; i++ ) {
                            let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                            let timeProjectId = this.data[i].id;
                              this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                                      .subscribe(response => { 
                                      if(response.json().length)
                                      { 
                                        for(let j=0; j< response.json().length; j++ ) {
                                        //tDate   = new Date(response.json()[j].stime);
                                        hours   = response.json()[j].stime.split(':')[0]; 
                                        minutes = response.json()[j].stime.split(':')[1]; 

                                        totalTime     += Number(hours);
                                        totalMin      += Number(minutes);

                                        this.data[i].totalStime = totalTime+':'+totalMin;
                                        }
                                      }else{
                                        this.data[i].totalStime = "0:00";
                                      }
                                      
                              });
                        }

                    
                        
                        });
                }
            
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }
            });

          }else{
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]},"limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                //this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }

                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });

          if(result.length)
          {     
                this.data = [];
                for(let i=0; i< result.length; i++ ) {
                  let stime = '', des = '', tsId = '';
                  
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.memberId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.memberId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.memberId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 

                          let datalength = this.data.length;
                          
                          for(let i=0; i< datalength; i++ ) {
                            let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                            let timeProjectId = this.data[i].id;
                              this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.memberId+'"}]}}', options)
                                      .subscribe(response => { 
                                      if(response.json().length)
                                      { 
                                        for(let j=0; j< response.json().length; j++ ) {
                                        //tDate   = new Date(response.json()[j].stime);
                                        hours   = response.json()[j].stime.split(':')[0]; 
                                        minutes = response.json()[j].stime.split(':')[1]; 

                                        totalTime     += Number(hours);
                                        totalMin      += Number(minutes);

                                        this.data[i].totalStime = totalTime+':'+totalMin;
                                        }
                                      }else{
                                        this.data[i].totalStime = "0:00";
                                      }
                                      
                              });
                    }
                        
                        });
                }
            
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
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

  let todayDate = new Date();
  this.seldata  = todayDate;
  let tMonth  = todayDate.getMonth()+1;
  let tDay      = todayDate.getDate();
  let months    = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let curMonth  = months[todayDate.getMonth()];
  let days      = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let curDay    = todayDate.getDay();

  let tinc = 0;
  let binc = 1;

  this.datesData = [];


for(let i=0; i<= 30; i++) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() - i);
    let lastDay = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
    if(nextDay.getDate() == lastDay.getDate() && i!=0)
    {
      tinc  = tinc + 1;
      binc  = binc - 1;
    }

     let strDate = (todayDate.getMonth()+binc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
     this.datesData[i]   = strDate;

      //this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()+binc]+'_'+nextDay.getDate()+'_'+strDate;
  
  }

  let lastMonthDay = todayDate.getDate() + 1;
  let lastMonthM   = tMonth - 1;

  this.sheettimeData = lastMonthM+"/"+lastMonthDay+"/"+todayDate.getFullYear()+" - "+tMonth+"/"+todayDate.getDate()+"/"+todayDate.getFullYear();

    
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

    if(this.timesheetStatusData == 'alltimesheet')
    {
      this.data = [];
      this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+contId+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                //this.contractorId = contId;
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+contId+'"}]}}', options)
                    .subscribe(response => {
                    this.data = response.json();
                      for(let i=0; i< this.data.length; i++ ) {
                        
                        let stime = '', des = '', tsId = '';
                          this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {      
                            this.data[i].project_name = response.json().project_name;  
                            this.data[i].member_id   = contId;  
                            this.data[i].rate        = response.json().rate;  
                            this.data[i].type        = response.json().project_type;  
                            this.data[i].budget      = response.json().budget;  
                            this.data[i].status      = response.json().status;  

                            this.http.get(API_URL+'/Members/'+contId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });
                            
                        });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].project_id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+contId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                      }
                      let datalength = this.data.length;
                      for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].project_id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+contId+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                   
                });
                this.checkData = 1;
                this.data = [];
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }

            });
    }else{
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]},"limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                //this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }
                  
                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });
                  

          if(result.length)
          {     
                this.data = [];
                for(let i=0; i< result.length; i++ ) {
                  
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.contractorId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.contractorId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';

                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];
                            let stime = '', des = '', tsId = '';

                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 

                          let datalength = this.data.length;
                          for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                        
                        });
                }
               
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }
            });

    }

}

}


onSelectFilter(sheetFilter)
{
  this.toasterService.clear();
  if(sheetFilter)
  {
    
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');


if(localStorage.getItem('currentUserRoleId') == '1')
{
    if(sheetFilter == 'alltimesheet')
    {
      this.data = [];
      this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                 
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
                    .subscribe(response => {
                    this.data = response.json();
                      for(let i=0; i< this.data.length; i++ ) {
                        
                        let stime = '', des = '', tsId = '';
                          this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {      
                            this.data[i].project_name = response.json().project_name;  
                            this.data[i].member_id   = this.data[i].member_id;  
                            this.data[i].rate        = response.json().rate;  
                            this.data[i].type        = response.json().project_type;  
                            this.data[i].budget      = response.json().budget;  
                            this.data[i].status      = response.json().status;  
                            this.data[i].id          = response.json().id;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });
                            
                        });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].project_id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                      }
                      let datalength = this.data.length;
                      for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].project_id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                   
                });
                this.checkData = 1;
                this.data = [];
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }

            });
    }else{
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]},"limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }

                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });



          if(result.length)
          {     this.data = [];
                for(let i=0; i< result.length; i++ ) {

                  let stime = '', des = '', tsId = '';
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.contractorId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.contractorId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';

                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];

                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 

                          let datalength = this.data.length;

                          for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                        
                        });
                }
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }
            });

    }

  }else{

    if(sheetFilter == 'alltimesheet')
    {
      this.data = [];
      this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                 
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
                    .subscribe(response => {
                    this.data = response.json();
                      for(let i=0; i< this.data.length; i++ ) {
                        
                        let stime = '', des = '', tsId = '';
                          this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {      
                            this.data[i].project_name = response.json().project_name;  
                            this.data[i].member_id   = this.data[i].member_id;  
                            this.data[i].rate        = response.json().rate;  
                            this.data[i].type        = response.json().project_type;  
                            this.data[i].budget      = response.json().budget;  
                            this.data[i].status      = response.json().status;  
                            this.data[i].id          = response.json().id;  

                            this.http.get(API_URL+'/Members/'+this.data[i].member_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });
                            
                        });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].project_id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                      }
                      let datalength = this.data.length;
                      for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].project_id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                   
                });
                this.checkData = 1;
                this.data = [];
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }

            });
    }else{
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]},"limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
               //this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }

                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });



          if(result.length)
          {     this.data = [];
                for(let i=0; i< result.length; i++ ) {

                  let stime = '', des = '', tsId = '';
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.memberId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.memberId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';

                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];

                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.memberId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 

                          let datalength = this.data.length;

                          for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.memberId+'"}]}}', options)
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
                }
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }
            });

    }

  
  }

}

}

  getRate(totalStime, budget, rate, percentage)
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
    this.cDate = cDate;
    this.proId = proId;
    this.tsId  = tsId;
    this.memId = memId;
    //localStorage.setItem("cDate", cDate);
    //localStorage.setItem("proId", proId);
    //localStorage.setItem("tsId", tsId);
    //localStorage.setItem("memId", memId);

    //this.cuStime = stime;
    this.cuDes   = des;
    if(stime == '-' && tsId == '-')
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

getAmount(totalStime, budget, rate, percentage)
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
  this.datesData = [];
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

  let tinc = 0;
  let binc = 1;


for(let i=0; i<= 30; i++) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() - i);
    let lastDay = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
    if(nextDay.getDate() == lastDay.getDate() && i!=0)
    {
      tinc  = tinc + 1;
      binc  = binc - 1;
    }

     let strDate = (todayDate.getMonth()+binc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
     this.datesData[i]   = strDate;

      //this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()+binc]+'_'+nextDay.getDate()+'_'+strDate;
  
  }

  }else{
    this.seldata  = pickDate[0];
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
      

  let tinc = 0;
  let binc = 1;

for(let i=0; i<= tDays; i++ ) {
      let nextDay = new Date(pickDate[0]);
      nextDay.setDate(nextDay.getDate() + i);

      if(nextDay.getDate() == 1 && i!=0)
      {
        tinc  = tinc + 1;
        binc  = binc + 1;
      }

      let strDate = (todayDate.getMonth()+binc) + "/" + nextDay.getDate() + "/" + nextDay.getFullYear();
      this.datesData[i]   = strDate;

        //this.datesData[i]   = days[nextDay.getDay()]+'_'+months[todayDate.getMonth()+binc]+'_'+nextDay.getDate()+'_'+strDate;

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
            
          if(this.timesheetStatusData =='alltimesheet')
          {
            this.data = [];
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
                          this.data[i] = response.json();

                            /*this.data[i].project_name = response.json().project_name;  
                            this.data[i].member_id   = this.data[i].member_id;  
                            this.data[i].rate        = response.json().rate;  
                            this.data[i].type        = response.json().project_type;  
                            this.data[i].budget      = response.json().budget;  
                            this.data[i].status      = response.json().status;*/  

                            this.http.get(API_URL+'/Members/'+this.contractorId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                          this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
                          .subscribe(response => {
                              this.data[i].percentage = response.json()[0].percentage;
                              
                          });
                            
                        });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].project_id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                      }
                      let datalength = this.data.length;

                      for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].project_id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                });
                this.checkData = 1;
                this.data = [];
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }

            });

        }else{
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}, "limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                //this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.contractorId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }

                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });

          if(result.length)
          {     this.data = [];
                for(let i=0; i< result.length; i++ ) {
                  let stime = '', des = '', tsId = '';
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.contractorId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.contractorId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                          let datalength = this.data.length;

                          for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.contractorId+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                        
                        });
                }
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }
            });

          

        }
         
       }else{

          if(this.timesheetStatusData =='alltimesheet')
          {
            this.data = [];
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                //this.contractorId = this.contractorId;
                  this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
                    .subscribe(response => {

                    this.data = response.json();
                    
                      for(let i=0; i< this.data.length; i++ ) {
                        let stime = '', des = '', tsId = '';
                          this.http.get(API_URL+'/projects/'+this.data[i].project_id+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {    
                          this.data[i] = response.json();

                            /*this.data[i].project_name = response.json().project_name;  
                            this.data[i].member_id   = this.data[i].member_id;  
                            this.data[i].rate        = response.json().rate;  
                            this.data[i].type        = response.json().project_type;  
                            this.data[i].budget      = response.json().budget;  
                            this.data[i].status      = response.json().status;*/  

                            this.http.get(API_URL+'/Members/'+this.memberId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                          this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
                          .subscribe(response => {
                              this.data[i].percentage = response.json()[0].percentage;
                              
                          });
                            
                        });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].project_id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                      }
                      let datalength = this.data.length;
                      for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].project_id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.data[i].member_id+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                });
                this.checkData = 1;
                this.data = [];
              }else{
                this.data = [];
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }

            });

        }else{
            this.projectData = {};
            this.data = [];
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}, "limit":"1"}', options)
            .subscribe(response => {
              if(response.json().length)
              {
                
                //this.contractorId = response.json()[0].member_id;
                this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"member_id":"'+this.memberId+'"}]}}', options)
              .subscribe(response => {
                  for(let i=0; i< response.json().length; i++ ) { 
                    this.projectData[i] = response.json()[i].project_id;
                  }

                  let result = [];
                  $.each(this.projectData, function (i, e) {
                      var matchingItems = $.grep(result, function (item) {
                         return item == e;
                      });
                      if (matchingItems.length === 0){
                          result.push(e);
                      }
                  });

          if(result.length)
          {     this.data = [];
                for(let i=0; i< result.length; i++ ) {
                  let stime = '', des = '', tsId = '';
                   this.http.get(API_URL+'/projects/'+result[i]+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => {     
                          this.data[i] = response.json();

                           this.http.get(API_URL+'/Members/'+this.memberId+'?access_token='+ localStorage.getItem('currentUserToken'), options)
                          .subscribe(response => { 
                              this.data[i].membername   = response.json().fname+' '+response.json().lname;
                              this.data[i].memberstatus = response.json().status;
                              this.data[i].contractorid = response.json().id;
                          });

                           this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+result[i]+'"},{"member_id":"'+this.memberId+'"}]}}', options)
                          .subscribe(response => { 
                              this.data[i].percentage   = response.json()[0].percentage;
                          });

                        let ci = 1, totalStime=0, totalMin = 0, totalTime=0, tDate = 0, hours = 0, minutes = 0, fullstime = '';
                        
                          for(let j=0; j< this.datesData.length; j++ ) {
                            let userID    = localStorage.getItem('currentUserId');
                            let projectID = this.data[i].id;
                            let cDate     = this.datesData[j];
                        
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+projectID+'"},{"cdate":"'+cDate+'"}, {"member_id":"'+this.memberId+'"}]}}', options)
                            .subscribe(response => {    
                            //this.data[i].stime = '';
                            if(response.json().length)
                            {

                              if(response.json()[0].stime!=undefined && response.json()[0].id!=undefined)
                              {
                                tsId  += response.json()[0].id+'_';
                                stime = response.json()[0].stime;
                                fullstime += response.json()[0].fullstime;
                                des   += response.json()[0].description+'_';

                                this.datesData[j] = this.datesData[j]+'_'+stime;
                              }
                            }else{
                                 tsId += '-'+'_';
                                 stime = '-';
                                 fullstime += '@';
                                 des += '-'+'_';

                                 this.datesData[j] = this.datesData[j]+'_'+stime;
                            }

                                  this.data[i].tsId  = tsId;
                                  this.data[i].fullstime = fullstime;
                                  this.data[i].des   = des;
                                  stime = '';
                            
                           });
                             ci++;
                          } 
                          let datalength = this.data.length;
                          for(let i=0; i< datalength; i++ ) {
                        let totalTime = 0, totalMin = 0, hours = 0, minutes = 0;
                        let timeProjectId = this.data[i].id;
                          this.http.get(API_URL+'/timesheets?filter={"where":{"and":[{"project_id":"'+timeProjectId+'"}, {"member_id":"'+this.memberId+'"}]}}', options)
                                  .subscribe(response => { 
                                  if(response.json().length)
                                  { 
                                    for(let j=0; j< response.json().length; j++ ) {
                                    //tDate   = new Date(response.json()[j].stime);
                                    hours   = response.json()[j].stime.split(':')[0]; 
                                    minutes = response.json()[j].stime.split(':')[1]; 

                                    totalTime     += Number(hours);
                                    totalMin      += Number(minutes);

                                    this.data[i].totalStime = totalTime+':'+totalMin;
                                    }
                                  }else{
                                    this.data[i].totalStime = "0:00";
                                  }
                                  
                          });
                    }
                        
                        });
                }
            this.checkData = 1;
            this.data = [];
          }else{
               this.data = [];
               this.checkData = 2;
               this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
        }
            });

              }else{
                this.checkData = 2;
                this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
              }
            });

          

        }
         
       
       }
}

checkTimesheet(form:any)
{
  if(form.stime=='')
  {
    this.toasterService.clear();
    this.toasterService.pop('success', 'Message ', "No Timesheet Found!");
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
              this.sheetData.cdate       = this.cDate;
              this.sheetData.project_id  = this.proId;
              this.sheetData.member_id   = this.memId;


              if(typeof this.model.stime=='object')
              {
                  let hours   = this.model.stime.getHours(); 
                  let minutes = this.model.stime.getMinutes(); 

                  if(minutes == 0)
                  {
                    minutes = '00';
                  }

                  if(hours+':'+minutes == '0:00')
                  {
                    this.sheetData.stime       = "24:00";
                  }else{
                    this.sheetData.stime       = hours+':'+minutes;
                  }

                  
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
              let cdate                  = this.cDate;
              let projectId              = this.proId;
              let tsId                   = this.tsId;
              let memberId               = this.memId;
              //tsId                     = tsId.split('undefined')[0];

              if(typeof this.model.stime=='object')
              {
                let hours   = this.model.stime.getHours(); 
                let minutes = this.model.stime.getMinutes(); 

                if(minutes == 0)
                {
                  minutes = '00';
                }

                if(hours+':'+minutes == '0:00')
                {
                  this.editsheetData.stime       = "24:00";
                }else{
                  this.editsheetData.stime       = hours+':'+minutes;
                }

                
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
