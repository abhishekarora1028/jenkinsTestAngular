import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { ModalModule } from "ngx-bootstrap";

// DataTable
import { HttpModule } from '@angular/http';

import { TimesheetsComponent } from './timesheet.component';
import { TimesheetsRoutingModule } from './timesheet-routing.module';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';

// Toastr
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

import {PopoverModule} from "ngx-smart-popover";

@NgModule({
  imports: [
  	CommonModule,
    FormsModule,
    TimesheetsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ToasterModule,
    PopoverModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ TimesheetsComponent ]
})
export class TimesheetModule { }
