import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'boolIcon'})
export class BoolIconPipe implements PipeTransform {
  transform(value) {
    return value ? '&#xe86c;' : '&#xe5cd;';
  }
}
