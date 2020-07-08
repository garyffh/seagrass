import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
    StripeErrorMessage,
    TrnCheckoutPaymentMethod,
    TrnCustomerBillingPaymentMethod,
    UserPaymentMethodRead
} from '../../services/user.models';
import { BusinessService } from '../../../../services/business.service';
import { RouterExtensions } from 'nativescript-angular';
import { ListPicker } from 'tns-core-modules/ui/list-picker';

export enum PaymentMethodSelectComponentView {
    view,
    add
}

@Component({
    selector: 'ns-payment-method-select',
    templateUrl: './payment-method-select.component.html',
    styleUrls: ['./payment-method-select.component.scss'],
    moduleId: module.id
})
export class PaymentMethodSelectComponent implements OnInit {

    @Input() set checkoutPaymentMethod(value: TrnCheckoutPaymentMethod) {
        if (this.fCheckoutPaymentMethod !== value) {

            this.fCheckoutPaymentMethod = value;

            this.paymentMethods = [];
            for (const userPaymentMethodRead of this.fCheckoutPaymentMethod.paymentMethods) {
                this.paymentMethods.push(userPaymentMethodRead.name.split('XXXX ').join('X'));
            }

            this.setDefaultBillingPaymentMethod();

        }
    }

    get checkoutPaymentMethod(): TrnCheckoutPaymentMethod {
        return this.fCheckoutPaymentMethod;
    }

    @Input() set stripeErrorMessage(value: StripeErrorMessage) {
        if (value) {
            this.onPaymentMethodTokenError(value.message);
        }
    }

    get stripeErrorMessage(): StripeErrorMessage {
        return null;
    }

    get isValid(): boolean {
        return this.fIsValid;
    }

    get hasPayment(): boolean {

        if (this.componentView === PaymentMethodSelectComponentView.view) {
            if (this.billingPaymentMethod.paymentMethodId && (!this.billingPaymentMethod.newCard)) {
                return true;
            } else {
                return false;
            }

        } else if (this.componentView === PaymentMethodSelectComponentView.add) {

            if ((!this.billingPaymentMethod.paymentMethodId) && this.billingPaymentMethod.newCard) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }

    get existingPaymentMethod(): boolean {

        if (this.checkoutPaymentMethod) {
            return this.checkoutPaymentMethod.paymentMethods.length > 0;
        } else {
            return false;
        }

    }

    private cardHolderNameField = 'name';
    private paymentMethodIdField = 'paymentMethodId';

    private fPaymentMethodAddFormValid = false;
    private fIsValid: boolean;

    private fCheckoutPaymentMethod: TrnCheckoutPaymentMethod;

    private isValidStatusUpdate() {
        const valid: boolean = this.hasPayment;
        if (valid !== this.fIsValid) {
            this.fIsValid = valid;
            this.isValidStatus.emit(valid);
        }
    }

    private setDefaultBillingPaymentMethod() {

        if (this.checkoutPaymentMethod.paymentMethods.length > 0) {

            this.defaultPaymentMethod = this.checkoutPaymentMethod.paymentMethods.find((e) => e.defaultMethod);

            if (this.defaultPaymentMethod) {
                this.form.get('paymentMethodId').setValue(this.defaultPaymentMethod.userPaymentMethodId);
                this.paymentSelectIndex = this.checkoutPaymentMethod.paymentMethods.indexOf(this.defaultPaymentMethod);
            }

            this.componentView = PaymentMethodSelectComponentView.view;

        } else {
            this.componentView = PaymentMethodSelectComponentView.add;
        }

    }

    constructor(public businessService: BusinessService,
                public router: RouterExtensions) {

        this.form = new FormGroup({
            paymentMethodId: new FormControl(null)
        });

        this.form.valueChanges.subscribe((value) => {

            this.billingPaymentMethod.paymentMethodId = value[this.paymentMethodIdField];
            this.billingPaymentMethod.newCard = false;

            this.isValidStatusUpdate();
            if (this.isValid) {
                this.updateBillingPaymentMethod.emit(this.billingPaymentMethod);
            }

        });

    }

    paymentMethods: Array<string> = [];
    paymentSelectIndex = 0;

    @Output() updateCheckoutPaymentMethod: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() updateBillingPaymentMethod: EventEmitter<TrnCustomerBillingPaymentMethod> =
        new EventEmitter<TrnCustomerBillingPaymentMethod>();
    @Input() showAddress = false;
    @Input() showMobile = false;
    @Input() paymentMethodAddForm: FormGroup;

    form: FormGroup = new FormGroup({});

    PaymentMethodSelectComponentView = PaymentMethodSelectComponentView;
    componentView: PaymentMethodSelectComponentView = PaymentMethodSelectComponentView.view;

    defaultPaymentMethod: UserPaymentMethodRead;

    billingPaymentMethod: TrnCustomerBillingPaymentMethod = new TrnCustomerBillingPaymentMethod();

    cardErrorMessage = 'card details required';
    showCardError = false;

    ngOnInit() {

        this.paymentMethodAddForm.statusChanges.subscribe((status) => {

            if (status === 'VALID') {
                if (!this.fPaymentMethodAddFormValid) {

                    this.fPaymentMethodAddFormValid = true;

                    if (this.componentView === PaymentMethodSelectComponentView.add) {

                        this.billingPaymentMethod.paymentMethodId = null;
                        this.billingPaymentMethod.newCard = true;

                        this.isValidStatusUpdate();

                        if (this.isValid) {
                            this.updateBillingPaymentMethod.emit(this.billingPaymentMethod);
                        }

                    } else {

                        this.billingPaymentMethod.paymentMethodId = null;
                        this.billingPaymentMethod.newCard = false;

                        this.isValidStatusUpdate();

                        if (this.isValid) {
                            this.updateBillingPaymentMethod.emit(this.billingPaymentMethod);
                        }

                    }

                }
            } else {

                if (this.fPaymentMethodAddFormValid) {
                    this.fPaymentMethodAddFormValid = false;

                    this.billingPaymentMethod.paymentMethodId = null;
                    this.billingPaymentMethod.newCard = false;

                    this.isValidStatusUpdate();

                }

            }
        });

        this.paymentMethodAddForm.valueChanges.subscribe((value) => {

            if (this.isValid) {
                this.billingPaymentMethod.cardHolderName = value[this.cardHolderNameField];
                this.updateBillingPaymentMethod.emit(this.billingPaymentMethod);
            }

        });

        this.setDefaultBillingPaymentMethod();
    }

    paymentMethodIndexChanged(event): void {

        const picker = event.object as ListPicker;
        this.form.get('paymentMethodId')
            .setValue(this.checkoutPaymentMethod.paymentMethods[picker.selectedIndex].userPaymentMethodId);

    }

    onAddPaymentMethod() {

        this.componentView = PaymentMethodSelectComponentView.add;
        this.isValidStatusUpdate();
    }

    onCancelPaymentMethod() {

        this.componentView = PaymentMethodSelectComponentView.view;
        this.isValidStatusUpdate();
    }

    onPaymentMethodTokenError(message: string) {

        this.billingPaymentMethod.paymentMethodId = null;

        this.cardErrorMessage = message;
        this.showCardError = true;

        // this.paymentMethodAddForm.reset();

        this.isValidStatusUpdate();
    }

}
