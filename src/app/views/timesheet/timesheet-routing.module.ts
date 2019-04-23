import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { TimesheetsComponent } from './timesheet.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: "Timesheets"
    },
  
     children:[
     {
      
      path: '',
      component: TimesheetsComponent,
      data: {
        title: "Timesheet"
      }
    }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetsRoutingModule {}
