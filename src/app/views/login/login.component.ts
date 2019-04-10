import { Component, ViewEncapsulation } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class LoginComponent {
	
  	private data: any;
  	private error: number;
    private reqform:number;

    private toasterService: ToasterService;

    public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
    
    private previousUrl: string;

	constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {
  if(localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['dashboard']);
    }else{
      this.router.navigate(['login']);
    }
	    this.data  = {
	      loginname: '',
	      password:''
	    };

      this.toasterService = toasterService;
	  }


	  onSubmit() {	
	     if((this.data.loginname).match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)){
          this.data.email = this.data.loginname;
       } else {
         this.data.username = this.data.loginname;
       }

	    let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');
		
	    this.http.post(API_URL+'/Members/login?include=user', this.data,  options)
	        .subscribe(response => {
    			localStorage.setItem('currentUserToken', response.json().id);
    			localStorage.setItem('currentUserRoleId', response.json().user.role_id);
            localStorage.setItem('currentUserRole', response.json().user.role_name);
    			localStorage.setItem('currentUser', response.json());
  				localStorage.setItem('currentUserId', response.json().user.id);
          localStorage.setItem('currentUserName', response.json().user.fname+' '+response.json().user.lname);
          

          if(response.json().user.active != 0) {


          } else {
            this.toasterService.pop('error', 'Login Failed ', "This account user is not now an active user.");
          }
          
				if(response.json().user.role_id) {
             		this.router.navigate([localStorage.getItem('previousUrl')]);
				} else {
             	 //this.error = 1;
               this.toasterService.pop('error', 'Login Error ', "Username or password doesn't match!");
            		//console.log(this.error);
             	}
			       
          }, error => {
              //this.error = 1;
              console.log(JSON.stringify(error.json()));
              if(error.json().isTrusted){
                this.toasterService.pop('error', 'Login Error ', "API not working.");
              } else {
                this.toasterService.pop('error', 'Login Error ', error.json().error.message);
              }             
          });
	  }
}
