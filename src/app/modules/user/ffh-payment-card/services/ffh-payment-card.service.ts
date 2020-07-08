import { Injectable } from '@angular/core';

import { default as CARD_TYPES, CardTypesContainer } from '../models/card-types';
import { Month } from '../models/month.eum';

@Injectable({
    providedIn: 'root'
})
export class FfhPaymentCardService {
    /**
     * Collection of card types
     */
    private static readonly cardTypes: CardTypesContainer = CARD_TYPES;

    /**
     * Return card type based on card number
     */
    static getCardType(ccNum: string): string | null {

        if (ccNum) {

            for (const [key, val] of Array.from(FfhPaymentCardService.cardTypes.entries())) {
                if (
                    ccNum
                        .split(new RegExp('[ \\-]'))
                        .join('')
                        .match(val)
                ) {
                    return key;
                }
            }

            return null;
        } else {
            return null;
        }
    }

    /**
     * Return months in numerical format
     */
    static getMonths(): Array<Month> {
        const months: Array<Month> = [];
        for (const key of Object.keys(Month)) {
            months.push(Month[key]);
        }

        return months;
    }

    /**
     * Return years based on current year
     */
    static getYears(): Array<number> {
        const years: Array<number> = [];
        const year = new Date().getFullYear();
        for (let i = -2; i < 5; i++) {
            years.push(year + i);
        }

        return years;
    }
}
