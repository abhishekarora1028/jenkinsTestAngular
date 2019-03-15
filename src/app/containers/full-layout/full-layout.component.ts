import { Component, VERSION } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent { 

	private navigation:any = [];
	constructor() {

	    this.navigation = [];

		this.navigation.push({
	    	name: 'Dashboard',
	    	url: '/dashboard',
	    	icon: 'icon-speedometer',
	  	});
	    
		this.navigation = [...this.navigation];
  	}

	public isDivider(item) {
    	return item.divider ? true : false
  	}

  	public isTitle(item) {
    	return item.title ? true : false
  	}

}