import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

// DataTable
import { DataTableModule } from 'angular-6-datatable';
import { HttpModule } from '@angular/http';
import { DataFilterPipe } from './datafilterpipe';
import { StriphtmlPipe } from './striphtml.pipe';

import { ContractorsComponent } from './contractor.component';
import { AddcontractorComponent } from './addcontractor.component';
import { ViewcontractorComponent } from './viewcontractor.component';
import { ContractorsRoutingModule } from './contractor-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	DataTableModule,
    FormsModule,
    ContractorsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ ContractorsComponent, AddcontractorComponent, ViewcontractorComponent, DataFilterPipe, StriphtmlPipe ]
})
export class ContractorModule { }
