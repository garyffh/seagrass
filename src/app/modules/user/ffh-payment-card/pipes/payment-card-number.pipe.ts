import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'paymentCardNumber'
})
export class PaymentCardNumberPipe implements PipeTransform {
    /**
     * Transform card number to card format for known numbers
     */
    transform(value: string): string {
        if (value !== null) {
            switch (value.length) {
                case 15:
                    value = value.replace(/\b(\d{4})/, '$1-');
                    value = value.replace(/-(\d{6})/, '-$1-');

                    return value;
                case 16:
                    return value.match(/.{4}/g).join('-');
                default:
                    return value;
            }
        } else {
            return '';
        }
    }
}
