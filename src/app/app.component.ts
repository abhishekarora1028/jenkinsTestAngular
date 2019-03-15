import { Component } from '@angular/core';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private http: Http, private router:Router) { 

  }

  ngOnInit() {
   
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(e => {        
        
      });  

    this.router.events.subscribe((evt:any) => {
      if (!(evt instanceof NavigationStart)) {
        if(evt.url == '/' || evt.url == '/login') {
            localStorage.setItem('previousUrl','dashboard');
        } else {
            localStorage.setItem('previousUrl',evt.url);        
        }
      } 
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}
