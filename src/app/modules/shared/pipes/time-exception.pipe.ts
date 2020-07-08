import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { StoreTradingExceptionRead } from '../../../services/app.models';

@Pipe({
  name: 'timeException'
})
export class TimeExceptionPipe implements PipeTransform {
  transform(value: StoreTradingExceptionRead, args?: any): any {

    let rtn = '';
    if (value.closed) {
      if (value.delivery && value.store) {
        rtn = 'Closed';
      } else if (value.delivery && !value.store) {
        rtn = 'Open (no deliveries)';
      } else if (!value.delivery && value.store) {
        rtn = 'Closed (deliveries only)';
      }
    } else {

      if (value.delivery && value.store) {
        rtn = 'Open';
      } else if (value.delivery && !value.store) {
        rtn = 'Closed (deliveries only)';
      } else if (!value.delivery && value.store) {
        rtn = 'Open (no deliveries)';
      }
    }

    if (value.startTime.format('YYYY MM DD') === value.endTime.format('YYYY MM DD')) {
      // same day

      if (value.startTime.format('HH:mm') === moment('12:00 am', 'HH:mm a').format('HH:mm')) {

        if (value.endTime.format('HH:mm') !== moment('12:00 am', 'HH:mm a').format('HH:mm')) {
          rtn = `${rtn} until  ${value.endTime.format('h:mma')}`;
        }

      } else {

        if (value.endTime.format('HH:mm') === moment('12:00 am', 'HH:mm a').format('HH:mm')) {
          rtn = `${rtn} from ${value.startTime.format('h:mma')}`;
        } else {
          rtn = `${rtn} ${value.startTime.format('h:mma')} - ${value.endTime.format('h:mma')}`;
        }

      }

    } else {

      if (value.startTime.format('HH:mm') === moment('12:00 am', 'HH:mm a').format('HH:mm')) {
        rtn = `${rtn} ${value.startTime.format('ddd MMM Do')}`;
      } else {
        rtn = `${rtn} ${value.startTime.format('ddd MMM Do h:mma')}`;
      }

      if (value.endTime.format('HH:mm') === moment('12:00 am', 'HH:mm a').format('HH:mm')) {
        rtn = `${rtn} - ${value.endTime.format('ddd MMM Do')}`;
      } else {
        rtn = `${rtn} - ${value.endTime.format('ddd MMM Do h:mma')}`;
      }

    }

    return rtn;
  }
}
