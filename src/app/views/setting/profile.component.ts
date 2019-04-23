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
  templateUrl: 'profile.component.html'
})

export class ProfileComponent {
  editparam: any;
  proStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  uniqueEmail:any = 0;
  conData:any;
  private data: any;
  model: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }

let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

let userId = localStorage.getItem('currentUserId');          

this.http.get(API_URL+'/members/'+userId, options)
  .subscribe(response => {
    this.model = response.json();
});


}

onChange(event: any) {
  this.uniqueEmail = 0;
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');
            
     this.http.get(API_URL+'/Members?filter=%7B%22where%22%3A%7B%22email%22%3A%20%22'+event+'%22%7D%7D', options).subscribe(data => {
     //console.log(data._body)
        if(data.json().length)
        {
          this.uniqueEmail = 0;
          this.uniqueEmail = 1;
        }else{
          this.uniqueEmail = 0;
          this.uniqueEmail = 2;
        }
      });
}

onSubmit() {
  
let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

let userId = localStorage.getItem('currentUserId');

this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+userId+'%22%7D', this.model,  options)
    .subscribe(data => {
  if(data)
  {
    this.proEditStatus = 1;
  }else{
    this.proEditStatus = 2;
  }
});

} 

}
