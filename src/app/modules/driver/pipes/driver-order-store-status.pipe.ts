import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'driverOrderStoreStatus'
})
export class DriverOrderStoreStatusPipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'SCHEDULED';
      case 1: return 'NO DRIVER';
      case 2: return 'QUEUED';
      case 3: return 'PREPARING';
      case 4: return 'FOR PICKUP';
      case 5: return 'READY';
      case 6: return 'DELIVERING';
      case 7: return 'COMPLETED';
      case 8: return 'CANCELLED';

      default: return 'undefined';
    }

  }

}
