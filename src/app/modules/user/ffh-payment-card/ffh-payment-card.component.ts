import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { CardValidator } from './validators/card-validator';
import { FfhPaymentCardService } from './services/ffh-payment-card.service';

@Component({
    selector: 'ns-ffh-payment-card',
    templateUrl: './ffh-payment-card.component.html',
    styleUrls: ['./ffh-payment-card.component.scss'],
    moduleId: module.id
})
export class FfhPaymentCardComponent implements OnInit {

    get isValid(): boolean {
        return this.fIsValid;
    }

    set isValid(value: boolean) {
        if (value !== this.fIsValid) {
            this.fIsValid = value;
            this.isValidStatus.emit(value);
        }
    }

    private fIsValid = false;

    private assignDateValues(): void {
        this.months = FfhPaymentCardService.getMonths();
        this.years = FfhPaymentCardService.getYears();
    }

    private buildForm(): void {

        this.ccForm.addControl('cardNumber', new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(12),
                    Validators.maxLength(19),
                    CardValidator.numbersOnly,
                    CardValidator.checksum
                ]));

        this.ccForm.addControl('name', new FormControl('',
            [
                Validators.required,
                Validators.maxLength(22)
            ]));

        this.ccForm.addControl('cardExpiryMonth', new FormControl('',
            [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(2)

            ]));

        this.ccForm.addControl('cardExpiryYear', new FormControl('',
            [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(2)
            ]));

        this.ccForm.addControl('cardCVC', new FormControl('',
            [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(4),
                CardValidator.numbersOnly
            ]));

        this.ccForm.setValidators(CardValidator.expiration);

    }

    constructor(private ffhPaymentCardService: FfhPaymentCardService) {
    }

    months: Array<string> = [];
    years: Array<number> = [];

    @Input() ccForm: FormGroup;
    @Input() ccNumMissingTxt = 'Card number is required';
    @Input() ccNumTooShortTxt = 'Card number is too short';
    @Input() ccNumTooLongTxt = 'Card number is too long';
    @Input() ccNumContainsLettersTxt = 'Card number can contain digits only';
    @Input() ccNumChecksumInvalidTxt = 'Provided card number is invalid';
    @Input() cardHolderMissingTxt = 'Card holder name is required';
    @Input() cardHolderTooLongTxt = 'Card holder name is too long';
    @Input() expirationMonthMissingTxt = 'Expiration month is required';
    @Input() expirationMonthLengthTxt = 'Expiration month requires 2 digits';
    @Input() expirationYearMissingTxt = 'Expiration year is required';
    @Input() expirationYearLengthTxt = 'Expiration year requires 2 digits';
    @Input() ccvMissingTxt = 'CCV number is required';
    @Input() ccvNumTooShortTxt = 'CCV number is too short';
    @Input() ccvNumTooLongTxt = 'CCV number is too long';
    @Input() ccvContainsLettersTxt = 'CCV number can contain digits only';
    @Input() cardExpiredTxt = 'Card has expired';
    @Input() cardInvalidExpiredTxt = 'Expiry date is invalid';

    @Input() validateCCNum = true;
    @Input() validateCardHolder = true;
    @Input() validateExpirationMonth = true;
    @Input() validateExpirationYear = true;
    @Input() validateCardExpiration = true;
    @Input() validateCCV = true;
    @Input() cardForm = false;

    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit(): void {

        this.buildForm();
        this.assignDateValues();

        this.ccForm.statusChanges.subscribe((status) => {
                // console.error(status);
                this.isValid = status === 'VALID';
            }
        );

    }

    get cardNumberField(): AbstractControl {
        return this.ccForm.get('cardNumber');
    }

    get cardNumberFieldInValid(): boolean {
        const field = this.cardNumberField;
        if (field) {
            return field.invalid && field.touched;
        } else {
            return false;
        }

    }

    get nameField(): AbstractControl {
        return this.ccForm.get('name');
    }

    get nameFieldInValid(): boolean {
        const field = this.nameField;
        if (field) {
            return field.invalid && field.touched;
        } else {
            return false;
        }

    }

    get cardExpiryMonthField(): AbstractControl {
        return this.ccForm.get('cardExpiryMonth');
    }

    get cardExpiryMonthFieldInValid(): boolean {
        const field = this.cardExpiryMonthField;
        if (field) {
            return field.invalid && field.touched;
        } else {
            return false;
        }

    }

    get cardExpiryYearField(): AbstractControl {
        return this.ccForm.get('cardExpiryYear');
    }

    get cardExpiryYearFieldInValid(): boolean {
        const field = this.cardExpiryYearField;
        if (field) {
            return field.invalid && field.touched;
        } else {
            return false;
        }

    }

    get cardCVCField(): AbstractControl {
        return this.ccForm.get('cardCVC');
    }

    get cardCVCInValid(): boolean {
        const field = this.cardCVCField;
        if (field) {
            return field.invalid && field.touched;
        } else {
            return false;
        }

    }

    get expirationInValid(): boolean {
        const field = this.cardCVCField;
        if (field) {
            return (this.ccForm.hasError('expiration') ||  this.ccForm.hasError('invalidDate')) &&
                this.cardExpiryMonthField.touched && this.cardExpiryYearField.touched;
        } else {
            return false;
        }

    }

    get cardType(): string | null {
        return FfhPaymentCardService.getCardType(this.cardNumberField.value);
    }

}
