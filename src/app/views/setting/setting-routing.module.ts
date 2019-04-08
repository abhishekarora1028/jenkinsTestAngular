import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { SettingsComponent } from './setting.component';
import { ProfileComponent } from './profile.component';
import { ChangepasswordComponent } from './changepassword.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: "Settings"
    },
  
     children:[
     {
      
      path: '',
      component: SettingsComponent,
      data: {
        title: "Settings"
      }
    },
    {
       path: 'profile',
      component: ProfileComponent,
      data: {
        title: "Profile"
      }
    },
    {
       path: 'changepassword',
      component: ChangepasswordComponent,
      data: {
        title: "Change Password"
      }
    }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
