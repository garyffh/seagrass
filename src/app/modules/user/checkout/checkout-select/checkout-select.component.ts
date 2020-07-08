import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AppService } from '../../../../services/app.service';
import { BusinessService } from '../../../../services/business.service';

import { DeliveryMethodType } from '../../../../services/app.models';
import {
    UserAddress,
    TrnCustomerBillingDeliveryMethod,
    TrnCheckoutPaymentMethod,
    TrnCustomerBillingPaymentMethod,
    StripeErrorMessage,
    UserPhone,
    TrnCheckoutCustomerAccount,
    TrnCustomerBillingPaymentSplit
} from '../../services/user.models';
import { UtilityService } from '~/app/services/utility.service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'ns-checkout-select',
    templateUrl: './checkout-select.component.html',
    styleUrls: ['./checkout-select.component.scss'],
    moduleId: module.id
})
export class CheckoutSelectComponent {

    get checkoutError(): Error {
        return this.fCheckoutError;
    }

    get hasSavedAddress(): boolean {

        if (this.addressModel) {
            if (this.addressModel.street) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    get showAddress(): boolean {

        if (this.billingDeliveryMethod) {
            if (this.billingDeliveryMethod.selectedType === DeliveryMethodType.delivery || !this.hasSavedAddress) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    get showMobile(): boolean {

        if (this.billingDeliveryMethod) {
            if (this.billingDeliveryMethod.selectedType === DeliveryMethodType.delivery) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    get canPlaceOrder(): boolean {

        let rtn = false;

        if (this.showAddress && this.showMobile) {
            rtn = this.deliveryMethodValid && this.addressValid && this.mobileValid && this.paymentMethodValid;
        } else if (this.showAddress && !this.showMobile) {
            rtn = this.deliveryMethodValid && this.addressValid && this.paymentMethodValid;
        } else if (!this.showAddress && this.showMobile) {
            rtn = this.deliveryMethodValid && this.mobileValid &&  this.paymentMethodValid;
        } else {
            rtn = this.deliveryMethodValid && this.paymentMethodValid;
        }

        return rtn;
    }

    get orderRedeemCurrency(): number {

        if (this.checkoutCustomerAccount) {
            if (this.checkoutCustomerAccount.currencyAvailable >= this.appService.data.cartTransaction.total) {
                return this.appService.data.cartTransaction.total;
            } else {
                if (this.appService.data.cartTransaction.total - this.checkoutCustomerAccount.currencyAvailable <
                    this.businessService.business.minimumEftpos) {
                    return 0;
                } else {
                    return this.checkoutCustomerAccount.currencyAvailable;
                }
            }
        } else {
            return 0;
        }
    }

    get orderRedeemPoints(): number {

        if (this.orderRedeemCurrency === 0) {
            return 0;
        } else {
            return Math.round(this.orderRedeemCurrency * 100 * this.businessService.business.pointRedemptionRatio);
        }
    }

    get orderCardAmount(): number {

        return this.appService.data.cartTransaction.total - this.orderRedeemCurrency;

    }

    // tslint:disable-next-line:adjacent-overload-signatures
    @Input()
    set checkoutError(value: Error) {
        if (value !== this.fCheckoutError) {
            this.fCheckoutError = value;
        }
    }

    private fCheckoutError: Error = null;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                public utilityService: UtilityService,
                public businessService: BusinessService,
                public appService: AppService) {

    }

    deliveryMethodValid = false;
    addressValid = false;
    mobileValid = false;
    paymentMethodValid = false;

    billingDeliveryMethod: TrnCustomerBillingDeliveryMethod;

    @Output() updateBillingDeliveryMethod: EventEmitter<TrnCustomerBillingDeliveryMethod>
        = new EventEmitter<TrnCustomerBillingDeliveryMethod>();
    @Output() updateAddress: EventEmitter<UserAddress> = new EventEmitter<UserAddress>();
    @Output() updateMobile: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() updateBillingPaymentMethod: EventEmitter<TrnCustomerBillingPaymentMethod> =
        new EventEmitter<TrnCustomerBillingPaymentMethod>();
    @Output() updateCheckoutPaymentMethod: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() placeOrder: EventEmitter<TrnCustomerBillingPaymentSplit> =
        new EventEmitter<TrnCustomerBillingPaymentSplit>();
    @Input() addressModel: UserAddress;
    @Input() mobileModel: UserPhone;
    @Input() stripeErrorMessage: StripeErrorMessage;

    @Input() checkoutPaymentMethod: TrnCheckoutPaymentMethod;
    @Input() checkoutProcessing: boolean;
    @Input() checkoutCustomerAccount: TrnCheckoutCustomerAccount;
    @Input() paymentMethodAddForm: FormGroup;

    onDeliveryMethodSelectIsValidStatus(event: boolean) {

        this.deliveryMethodValid = event;

        this.changeDetectorRef.detectChanges();
    }

    onUpdateBillingDeliveryMethod(event: TrnCustomerBillingDeliveryMethod) {

        this.billingDeliveryMethod = event;

        this.changeDetectorRef.detectChanges();

        this.updateBillingDeliveryMethod.emit(event);

    }

    onUpdateCheckoutPaymentMethod(event: boolean) {
        this.updateCheckoutPaymentMethod.emit(event);
    }

    onAddressSelectIsValidStatus(event: boolean) {
        this.addressValid = event;

        this.changeDetectorRef.detectChanges();

    }

    onUpdateAddress(event) {
        this.updateAddress.emit(event);
    }

    onMobileSelectIsValidStatus(event: boolean) {

        this.mobileValid = event;
        this.changeDetectorRef.detectChanges();
    }

    onUpdateMobile(event: boolean) {
        this.updateMobile.emit(event);
    }

    onPaymentMethodIsValidStatus(event: boolean) {
        this.paymentMethodValid = event;
    }

    onUpdateBillingPaymentMethod(event: TrnCustomerBillingPaymentMethod) {
        this.updateBillingPaymentMethod.emit(event);
    }

    onPlaceOrder(event: TrnCustomerBillingPaymentSplit) {
        this.placeOrder.emit(event);
    }

}
