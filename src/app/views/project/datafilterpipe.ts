import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string): any {

  if (query) {
  		if(array[0].percentage)
  		{
  			return _.filter(array, row=>row.contractorname.toLowerCase( ).indexOf(query.toLowerCase( )) > -1);
  		}else{
  			return _.filter(array, row=>row.project_name.toLowerCase( ).indexOf(query.toLowerCase( )) > -1);
  		}
      
    }
    
    return array;
  }
}
