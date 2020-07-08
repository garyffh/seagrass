import { Component, ChangeDetectorRef, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { numberRequiredValidator, passwordValidators } from '~/app/modules/shared/infrastructure/app-validators';
import { ListPicker } from 'tns-core-modules/ui/list-picker';

@Component({
    selector: 'ns-ffh-stripe-card',
    templateUrl: './ffh-stripe-card.component.html',
    styleUrls: ['./ffh-stripe-card.component.scss'],
    moduleId: module.id
})
export class FfhStripeCardComponent implements OnInit {

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

    constructor(public changeDetectionRef: ChangeDetectorRef) {

        this.years = [' '];

        const startYear = new Date().getFullYear() - 2000;

        for (let i = 0; i <= 20; i++) {
            this.years.push(String(startYear + i));
        }
    }

    @Input() form: FormGroup;
    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

    months: Array<string> = [
        ' ',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12' ];

    years: Array<string> = [];

    ngOnInit() {

        this.form.addControl('name', new FormControl('', [Validators.required]));
        this.form.addControl('cardNumber', new FormControl('', [Validators.required]));
        this.form.addControl('cardExpiryMonth', new FormControl(' ', [ Validators.compose(numberRequiredValidator())]));
        this.form.addControl('cardExpiryYear', new FormControl(' ', [Validators.compose(numberRequiredValidator())]));
        this.form.addControl('cardCVC', new FormControl('', [Validators.required, Validators.minLength(3),
            Validators.maxLength(4)]));

        this.form.statusChanges.subscribe((status) => {
                this.isValid = status === 'VALID';
            }
        );

    }

    onMonthSelect(event): void {

        const picker = event.object as ListPicker;

        if (picker.selectedIndex > 0) {
            this.form.get('cardExpiryMonth').setValue(this.months[picker.selectedIndex]);
        } else {
            this.form.get('cardExpiryMonth').setValue(null);
        }
    }

    onYearSelect(event): void {

        const picker = event.object as ListPicker;

        if (picker.selectedIndex > 0) {
            this.form.get('cardExpiryYear').setValue((+ this.years[picker.selectedIndex]) + 2000);
        } else {
            this.form.get('cardExpiryYear').setValue(null);
        }

    }

}
