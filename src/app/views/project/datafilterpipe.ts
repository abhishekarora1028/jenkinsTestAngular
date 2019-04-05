import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string): any {
  if(array[0].email)
  {
  	if (query) {
      return _.filter(array, row=>row.project_name.indexOf(query) > -1);
    }
  }else{
  	if (query) {
      return _.filter(array, row=>row.contractorname.indexOf(query) > -1);
    }
  }
    
    return array;
  }
}
