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
  templateUrl: 'register.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class RegisterComponent {


    private toasterService: ToasterService;

    public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
    

	constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router, toasterService: ToasterService) {

      this.toasterService = toasterService;

	  }


	  onSubmit() {	  	
	  	
	  }
}
