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
  templateUrl: 'changepassword.component.html'
})

export class ChangepasswordComponent {
  passStatus:any = 0;
  proStatus:any = 0;
  private data: any;
  model: any = {};
  fData: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }


}

onSubmit() {
  
if(this.model.cnpass != this.model.newPassword)
{
  this.passStatus = 1;
}else{
this.passStatus = 0;
  let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

console.log(this.model)           
this.fData.password = this.model.newPassword;

let userId = localStorage.getItem("currentUserId");

this.http.patch(API_URL+'/Members/'+userId+'?access_token='+ localStorage.getItem('currentUserToken'), this.fData,  options)
          .subscribe(response => {          
  if(response)
  {
    this.proStatus = 1;
  }else{
    this.proStatus = 2;
  }
});
  
}

} 


}


