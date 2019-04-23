import { Component, VERSION, ViewEncapsulation } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as $ from 'jquery';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
countProject: any;
countContractor: any;
userRoleId: any;
unassdata: any;
userId: any;
checkData: any = 0;
checkCont: any = 0;
checkAssignPro: any = 0;
condel: any = 0;
prodel: any = 0;
model: any = [];
data: any = [];
assignpro: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {
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
            this.unassdata = response.json();

            for(let i=0; i< this.unassdata.length; i++ ) {
            let projectId = this.unassdata[i].id;
            
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+projectId+'"},{"assign":"1"}]},"order":"id DESC"}', options)
            .subscribe(response2 => {     
            if(response2.json().length)
            {
              
              this.unassdata[i].unass = 0; 
              this.checkAssignPro = parseInt(this.checkAssignPro + 0);
            }else{
              this.unassdata[i].unass = 1;
              this.checkAssignPro = parseInt(this.checkAssignPro + 1);
            }
            
            });   
          }
            
          }else{
            this.checkAssignPro = 0;
          }
          
        });

  }else{
  let userID = localStorage.getItem('currentUserId');
    /*this.http.get(API_URL+'/projects?filter={"where":{"member_id":"'+userID+'"}}', options)
          .subscribe(response => {
          this.countProject = response.json().length;
        });*/

  

    this.http.get(API_URL+'/projects/', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.countProject = response.json().length;
          }else{
            this.countProject = 0;
          }
          
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
            this.checkCont = 1;
          }else{
            this.checkCont = 0;
          }
            
        });    


        this.http.get(API_URL+'/projects?filter={"order":"id DESC", "limit":"10"}', options)
          .subscribe(response => {
          if(response.json().length)
          {
            this.unassdata = response.json();

            for(let i=0; i< this.unassdata.length; i++ ) {
            let projectId = this.unassdata[i].id;
            
            this.http.get(API_URL+'/assignprojects?filter={"where":{"and":[{"project_id":"'+projectId+'"},{"assign":"1"}]},"order":"id DESC"}', options)
            .subscribe(response2 => {     
            if(response2.json().length)
            {
              
              this.unassdata[i].unass = 0; 
              this.checkAssignPro = parseInt(this.checkAssignPro + 0);
            }else{
              this.unassdata[i].unass = 1;
              this.checkAssignPro = parseInt(this.checkAssignPro + 1);
            }
            
            });   
          }
            
          }else{
            this.checkAssignPro = 0;
          }
          
        });



  }        

        
  this.toasterService = toasterService; 
    
  }

delproject(proid){
this.toasterService.clear();
  if(proid)
  {
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');


        this.http.post(API_URL+'/projects/update?where=%7B%22id%22%3A%20%22'+proid+'%22%7D', {"status":"deleted"},  options)
          .subscribe(response => {

            this.http.get(API_URL+'/projects?filter={"order":"id DESC"}', options)
            .subscribe(response => {
            if(response.json().length)
            {
              this.model = response.json();
              for(let i=0; i< this.model.length; i++ ) {
              this.http.get(API_URL+'/clients?filter={"where":{"and":[{"id":"'+this.model[i].client_id+'"}]}}', options)
                  .subscribe(response => {
                  if(response.json().length)
                  {
                    
                    this.model[i].client_name = response.json()[0].fname+' '+response.json()[0].lname;
                    this.model[i].email = response.json()[0].email;
                    this.model[i].client_code = response.json()[0].client_code;
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

delcontractor(proid){
this.toasterService.clear();
  if(proid)
  {
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

        /*this.http.delete(API_URL+'/members/'+proid, options)
          .subscribe(response => {
            this.prodel = 1;
        }); 

        this.data.splice(index, 1); */

        this.http.post(API_URL+'/Members/update?where=%7B%22id%22%3A%20%22'+proid+'%22%7D', {"status":"deleted"},  options)
          .subscribe(response => {

            this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"}]},"order":"id DESC"}', options)
            .subscribe(response => {
            if(response.json().length)
            {
              this.data = response.json();
              this.checkCont = 1;
            }else{
              this.checkCont = 0;
            }
              
          });

          this.condel = 1;
        
        });
        setTimeout(function(){$('.text-error').fadeOut();}, 2000); 
        this.toasterService.pop('success', 'Deleted ', "Contractor has deleted successfully!");
  }

  }

}
