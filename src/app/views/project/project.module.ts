import { NgModule } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

// DataTable
import { DataTableModule } from 'angular-6-datatable';
import { HttpModule } from '@angular/http';
import { DataFilterPipe } from './datafilterpipe';
import { FormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { StriphtmlPipe } from './striphtml.pipe';


import { ProjectsComponent } from './project.component';
import { AddprojectComponent } from './addproject.component';
import { ViewprojectComponent } from './viewproject.component';
import { ProjectsRoutingModule } from './project-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	DataTableModule,
    FormsModule,
    ProjectsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [ ProjectsComponent, AddprojectComponent, ViewprojectComponent, DataFilterPipe, StriphtmlPipe ]
})
export class ProjectModule { }
