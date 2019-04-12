import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../models/User';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return Role[value];
  }

}
