import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniqueValuesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[name]).indexOf(obj[name]) === pos;
    });
  }

}
