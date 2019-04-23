import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ClientsComponent } from './client.component';
import { AddclientComponent } from './addclient.component';
import { ViewclientComponent } from './viewclient.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: "Clients"
    },
  
     children:[
     {
      
      path: '',
      component: ClientsComponent,
      data: {
        title: "Clients"
      }
    },
    {
      path: 'addclient',
      component: AddclientComponent,
      data: {
        title: "Add New Client"
      }
    },
    {
       path: 'editclient/:id',
      component: AddclientComponent,
      data: {
        title: "Edit Client"
      }
    },
    {
       path: 'viewclient/:id',
      component: ViewclientComponent,
      data: {
        title: "View Client"
      }
    }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}
