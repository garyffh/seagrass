import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

/**
 * Collection of validation methods
 */
export class CardValidator {
    /**
     * Custom error for alphanumeric input
     */
    private static NUMBERS_ONLY_ERR: ValidationErrors = {
        numbersOnly: true
    };

    /**
     * Custom error for invalid checksum
     */
    private static CHECKSUM_INVALID: ValidationErrors = {
        checksum: true
    };

    /**
     * Custom error for expired card
     */
    private static CARD_EXPIRED: ValidationErrors = {
        expiration: true
    };

    /**
     * Custom error for invalid date
     */
    private static INVALID_DATE: ValidationErrors = {
        invalidDate: true
    };

    /**
     * Check if control contains numbers only
     */
    static numbersOnly(abstractCtrl: AbstractControl): ValidationErrors | null {
        const ccNum: string = abstractCtrl.value;
        const NUMBERS_ONLY: RegExp = new RegExp(/^[0-9]+$/);

        return !NUMBERS_ONLY.test(ccNum) ? CardValidator.NUMBERS_ONLY_ERR : null;
    }

    /**
     * Check checksum number in card number using Luhn algorithm
     */
    static checksum(abstractCtr: AbstractControl): ValidationErrors | null {
        const ccNumber: string = abstractCtr.value;
        const luhnArray: Array<number> = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
        let length: number = ccNumber ? ccNumber.length : 0;
        let sum = 0;
        let shouldMultiply = true;

        while (length) {
            const val: number = parseInt(ccNumber.charAt(--length), 10);
            // tslint:disable-next-line:no-conditional-assignment
            sum += (shouldMultiply = !shouldMultiply) ? luhnArray[val] : val;
        }

        return !(sum && sum % 10 === 0) ? CardValidator.CHECKSUM_INVALID : null;
    }

    /**
     * Check validity of the card
     */
    static expiration(formGroup: FormGroup): ValidationErrors | null {

        const expirationMonth: number = Number(formGroup.get('cardExpiryMonth').value);
        const expirationYear: number = Number(formGroup.get('cardExpiryYear').value);

        if (expirationMonth) {

            if (expirationMonth < 1 || expirationMonth > 12) {
                return CardValidator.INVALID_DATE;
            } else {
                const expirationDate: Date = new Date(expirationYear + 2000, expirationMonth - 1, 0);

                if (expirationDate.getTime() === expirationDate.getTime()) {
                    return new Date().getTime() > expirationDate.getTime() ? CardValidator.CARD_EXPIRED : null;
                } else {
                    return CardValidator.INVALID_DATE;
                }
            }
        } else {
            return CardValidator.INVALID_DATE;
        }

    }
}
