import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderDeliveryMethodStatus'
})
export class OrderDeliveryMethodStatusPipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'SCHEDULED';
      case 1: return 'PREPARING';
      case 2: return 'READY FOR PICKUP';
      case 3: return 'DELIVERING';
      case 4: return 'COMPLETED';
      case 5: return 'CANCELLED';

      default: return 'undefined';
    }

  }

}
