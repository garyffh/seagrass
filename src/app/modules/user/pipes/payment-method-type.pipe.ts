import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethodType'
})
export class PaymentMethodTypePipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'Card';
      case null: return '';

      default: return 'undefined';
    }

  }

}
