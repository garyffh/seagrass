import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStoreStatus'
})
export class OrderStoreStatusPipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'SCHEDULED';
      case 1: return 'NO DRIVER';
      case 2: return 'QUEUED';
      case 3: return 'PREPARING';
      case 4: return 'WAITING FOR PICKUP';
      case 5: return 'WAITING FOR DELIVERY';
      case 6: return 'DELIVERING';
      case 7: return 'COMPLETED';
      case 8: return 'CANCELLED';

      default: return 'undefined';
    }

  }

}
