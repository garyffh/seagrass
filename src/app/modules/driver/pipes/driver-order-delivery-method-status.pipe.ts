import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'driverOrderDeliveryMethodStatus'
})
export class DriverOrderDeliveryMethodStatusPipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0: return 'SCHEDULED';
      case 1: return 'PREPARING';
      case 2: return 'FOR PICKUP';
      case 3: return 'DELIVERING';
      case 4: return 'COMPLETED';
      case 5: return 'CANCELLED';

      default: return 'undefined';
    }

  }

}
