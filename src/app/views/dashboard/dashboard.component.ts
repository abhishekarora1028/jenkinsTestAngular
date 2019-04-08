import { Component, VERSION } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';

@Component({
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {
countProject: any;
countContractor: any;
userRoleId: any;
userId: any;
checkData: any = 0;
checkCont: any = 0;
checkAssignPro: any = 0;
condel: any = 0;
prodel: any = 0;
model: any = [];
data: any = [];
assignpro: any = [];
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }
    this.userRoleId = localStorage.getItem('currentUserRoleId');
    this.userId     = localStorage.getItem('currentUserId');
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

  if(localStorage.getItem('currentUserRoleId') == "1")
  {
    this.http.get(API_URL+'/projects/count', options)
          .subscribe(response => {
          this.countProject = response.json();
          this.countProject = this.countProject.count;
        });
   

        this.http.get(API_URL+'/Members/count?where=%7B%22role_id%22%3A%20%222%22%7D', options)
          .subscribe(response => {
          this.countContractor = response.json();
          this.countContractor = this.countContractor.count;
        });

        this.http.get(API_URL+'/projects?filter={"order":"id DESC", "limit":"10"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.model = response.json();
            this.checkData = 1;
          }else{
            this.checkData = 0;
          }
          
        }); 

        
        this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"}]},"order":"id DESC", "limit":"10"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.data = response.json();
            this.checkCont = 0;
            this.checkCont = 1;
          }else{
            this.checkCont = 0;
          }
            
        }); 

         /*this.http.get(API_URL+'/projects?filter={"where":{"and":[{"assign":"0"}]},"order":"id DESC", "limit":"10"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.assignpro = response.json();
            this.checkAssignPro = 1;
          }else{
            this.checkAssignPro = 0;
          }
          
        });*/

        this.http.get(API_URL+'/projects?filter={"order":"id DESC", "limit":"10"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.assignpro = response.json();

            for(let i=0; i< this.assignpro.length; i++ ) {
            let projectId = this.assignpro[i].id;
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+projectId+'"}]},"order":"id DESC"}', options)
            .subscribe(response2 => {      
            if(!response2.json().length)
            {
              //console.log(response.json())
              //this.assignpro = response.json(); 
              this.assignpro[i].unass = '0'; 
              this.checkAssignPro = 1;
            }else{
              this.assignpro[i].unass = '1';
              this.checkAssignPro = 0;
              //this.assignpro.splice([i], 1)
            }

            
            });   
          }
            
            console.log(this.assignpro)
            
          }else{
            //this.checkAssignPro = 0;
          }
          
        });

  }else{
  let userID = localStorage.getItem('currentUserId');
    /*this.http.get(API_URL+'/projects?filter={"where":{"member_id":"'+userID+'"}}', options)
          .subscribe(response => {
          this.countProject = response.json().length;
        });*/

   this.http.get(API_URL+'/projects/count', options)
          .subscribe(response => {
          this.countProject = response.json();
          this.countProject = this.countProject.count;
        });     

    this.http.get(API_URL+'/Members/count?where=%7B%22role_id%22%3A%20%222%22%7D', options)
          .subscribe(response => {
          this.countContractor = response.json();
          this.countContractor = this.countContractor.count;
        });  
        
    this.http.get(API_URL+'/projects?filter={"where":{"and":[{"member_id":"'+userID+'"}]},"order":"id DESC"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.model = response.json();
            this.checkData = 1;
          }else{
            this.checkData = 0;
          }
          
        });  
        
    this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"}]},"order":"id DESC", "limit":"10"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.data = response.json();
            this.checkCont = 0;
            this.checkCont = 1;
          }else{
            this.checkCont = 0;
          }
            
        });    


        this.http.get(API_URL+'/projects?filter={"where":{"and":[{"member_id":"'+userID+'"}]},"order":"id DESC"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.assignpro = response.json();

            for(let i=0; i< this.assignpro.length; i++ ) {
            let projectId = this.assignpro[i].id;
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+projectId+'"},{"assign":"1"}]},"order":"id DESC"}', options)
            .subscribe(response2 => {      
            if(!response2.json().length)
            {
              //console.log(response.json())
              //this.assignpro = response.json(); 
              this.assignpro[i].unass = 0; 
            }else{
              this.assignpro[i].unass = 1;
              this.assignpro.splice([i], 1)
            }

            if(this.assignpro.length)
            {
              this.checkAssignPro = 1;
            }else{
              this.checkAssignPro = 0;
            }
            });   
          }
            
            console.log(this.assignpro)
            
          }else{
            this.checkAssignPro = 0;
          }
          
        });



  }        

        

    /*$('.preloader').show();

     if(localStorage.getItem('currentUserRole') != null) { 
      
     } else {
          
     } 

    $('.preloader').hide();*/
  }

delcontractor(proid){
  if(proid)
  {
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

        this.http.delete(API_URL+'/members/'+proid, options)
          .subscribe(response => {
            this.condel = 1;
        }); 
  }

  }

delproject(proid){
  if(proid)
  {
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

        this.http.delete(API_URL+'/projects/'+proid, options)
          .subscribe(response => {
            this.prodel = 1;
        }); 
  //this.router.navigate(['projects']);     
  }

  }  

}
