import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { API_URL } from './globals';


// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    data: {
      title: 'PublicPages'
    },
    children: [
      {
        path: 'login',
        loadChildren: './views/login/login.module#LoginModule'
      },
      {
        path: 'register',
        loadChildren: './views/register/register.module#RegisterModule'
      },
      {
        path: 'forgot',
        loadChildren: './views/forgot/forgot.module#ForgotModule'
      },
      {
        path: 'resetpassword/:id/:token',
        loadChildren: './views/resetpwd/resetpwd.module#ResetpwdModule'
      }
    ]
  },
  {
    path: '',
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        component: FullLayoutComponent, 
        data: {
          nav:"dashboard"
        },
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'projects',
        component: FullLayoutComponent, 
        data: {
          nav:"projects"
        },
        loadChildren: './views/project/project.module#ProjectModule'
      },
      {
        path: 'contractors',
        component: FullLayoutComponent, 
        data: {
          nav:"contractors"
        },
        loadChildren: './views/contractor/contractor.module#ContractorModule'
      },
      {
        path: 'settings',
        component: FullLayoutComponent, 
        data: {
          nav:"settings"
        },
        loadChildren: './views/setting/setting.module#SettingModule'
      },
      {
        path: 'timesheets',
        component: FullLayoutComponent, 
        data: {
          nav:"timesheets"
        },
        loadChildren: './views/timesheet/timesheet.module#TimesheetModule'
      },
      {
        path: 'base',
        component: FullLayoutComponent,
        loadChildren: './views/base/base.module#BaseModule'
      }
    ]
  },
  /*{
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      }
    ]
  }*/
];


@NgModule({
  imports: [ RouterModule.forRoot(routes), HttpModule ],
  exports: [ RouterModule ],
  providers: [  ]
})
export class AppRoutingModule {

  constructor(private http: Http, private router:Router) {
    this.router.events.subscribe((evt:any) => {
      //  console.log(evt);
      if (!(evt instanceof NavigationStart)) {
        if(evt.url == '/' || evt.url == '/login') {
            localStorage.setItem('previousUrl','calendar');
        } else {
            localStorage.setItem('previousUrl',evt.url);        
        }
      } 
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

  }
}
