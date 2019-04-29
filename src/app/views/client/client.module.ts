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

import { ClientsComponent } from './client.component';
import { AddclientComponent } from './addclient.component';
import { ViewclientComponent } from './viewclient.component';
import { ClientsRoutingModule } from './client-routing.module';

// Toastr
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

@NgModule({
  imports: [
  	CommonModule,
  	DataTableModule,
    FormsModule,
    ClientsRoutingModule,
    ChartsModule,
    ToasterModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ ClientsComponent, AddclientComponent, ViewclientComponent, DataFilterPipe, StriphtmlPipe ]
})
export class ClientModule { }
