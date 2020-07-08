import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryMethodType'
})
export class DeliveryMethodTypePipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'PICKUP';
      case 1: return 'DELIVERY';

      default: return 'undefined';
    }

  }

}
