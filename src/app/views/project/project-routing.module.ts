import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ProjectsComponent } from './project.component';
import { AddprojectComponent } from './addproject.component';
import { ViewprojectComponent } from './viewproject.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: "Projects"
    },
  
     children:[
     {
      
      path: '',
      component: ProjectsComponent,
      data: {
        title: "Projects"
      }
    },
    {
      path: 'addproject',
      component: AddprojectComponent,
      data: {
        title: "Add New Project"
      }
    },
    {
       path: 'editproject/:id',
      component: AddprojectComponent,
      data: {
        title: "Edit Project"
      }
    },
    {
       path: 'viewproject/:id',
      component: ViewprojectComponent,
      data: {
        title: "View Project"
      }
    }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
