import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditReason'
})
export class CreditReasonPipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'DUPLICATE';
      case 1: return 'FRAUDULENT USE';
      case 2: return 'CUSTOMER REQUEST';

      default: return 'undefined';
    }

  }

}
