import { NgModule } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

// DataTable
import { DataTableModule } from 'angular-6-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap';


import { SettingsComponent } from './setting.component';
import { ProfileComponent } from './profile.component';
import { ChangepasswordComponent } from './changepassword.component';
import { SettingsRoutingModule } from './setting-routing.module';

// Toastr
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

// Ng2-file-upload
import { FileSelectDirective, FileDropDirective, FileUploadModule, FileUploader } from 'ng2-file-upload';

@NgModule({
  imports: [
  	CommonModule,
  	DataTableModule,
    FormsModule,
    SettingsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ToasterModule,
    FileUploadModule,
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [ SettingsComponent, ProfileComponent, ChangepasswordComponent ]
})
export class SettingModule { }
