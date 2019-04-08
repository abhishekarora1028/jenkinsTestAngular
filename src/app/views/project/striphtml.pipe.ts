import { Component,  Pipe, PipeTransform, WrappedValue } from '@angular/core';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

@Pipe({
    name: 'striphtml'
})

export class StriphtmlPipe  implements PipeTransform {
  transform(value: string): string {
    if(value != undefined) {      
     value = value.toString();

      value = value.trim();

      if(value != '' ) {
       // value = value.replace(/<.*?>/g, '').trim('');  // replace tags
        value = (WrappedValue.wrap(value.replace(/<.*?>/g, '').trim()).wrapped).toString();
       // console.log(value);
        return value;
      }
      else {
        return value;
      }
    } else {
      return value;
    }
  }
}


