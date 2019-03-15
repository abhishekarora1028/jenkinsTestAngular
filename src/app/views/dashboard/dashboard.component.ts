import { Component, VERSION } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import * as $ from 'jquery';

@Component({
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {

  constructor() {

    $('.preloader').show();

     if(localStorage.getItem('currentUserRole') != null) { 
      
     } else {
          
     } 

    $('.preloader').hide();
  }

}
