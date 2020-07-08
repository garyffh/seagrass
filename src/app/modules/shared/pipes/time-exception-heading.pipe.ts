import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { StoreTradingExceptionRead } from '../../../services/app.models';

@Pipe({
  name: 'timeExceptionHeading'
})
export class TimeExceptionHeadingPipe implements PipeTransform {
  transform(value: StoreTradingExceptionRead, args?: any): any {

    let rtn = `${value.name}: `;

    if (value.startTime.format('YYYY MM DD') === value.endTime.format('YYYY MM DD')) {
      // same day
      rtn = `${rtn} ${value.startTime.format('ddd MMM Do')}`;

    } else {

      rtn = `${rtn} ${value.startTime.format('ddd MMM Do')} - ${value.endTime.format('ddd MMM Do')}`;

    }

    return rtn;
  }
}
