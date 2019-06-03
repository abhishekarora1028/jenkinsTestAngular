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

// Toastr
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

// Ng2-file-upload
import { FileSelectDirective, FileDropDirective, FileUploadModule, FileUploader } from 'ng2-file-upload';

import {PopoverModule} from "ngx-smart-popover";

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
  	CommonModule,
  	DataTableModule,
    FormsModule,
    ContractorsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ToasterModule,
    FileUploadModule,
    PopoverModule,
    ColorPickerModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ ContractorsComponent, AddcontractorComponent, ViewcontractorComponent, DataFilterPipe, StriphtmlPipe ]
})
export class ContractorModule { }
