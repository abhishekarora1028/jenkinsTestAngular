import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ContractorsComponent } from './contractor.component';
import { AddcontractorComponent } from './addcontractor.component';
import { ViewcontractorComponent } from './viewcontractor.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: "Contractors"
    },
  
     children:[
     {
      
      path: '',
      component: ContractorsComponent,
      data: {
        title: "Contractors"
      }
    },
    {
      path: 'addcontractor',
      component: AddcontractorComponent,
      data: {
        title: "Add New Contractor"
      }
    },
    {
       path: 'editcontractor/:id',
      component: AddcontractorComponent,
      data: {
        title: "Edit Contractor"
      }
    },
    {
       path: 'viewcontractor/:id',
      component: ViewcontractorComponent,
      data: {
        title: "View Contractor"
      }
    }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorsRoutingModule {}
