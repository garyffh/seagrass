import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { ModalDialogOptions, ModalDialogService, RouterExtensions } from 'nativescript-angular';

import { Card, Stripe, Token } from 'nativescript-stripe';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UserService } from '~/app/modules/user/services/user.service';

import { AppService } from '~/app/services/app.service';
import {BusinessService, StoreDeliveryZone} from '~/app/services/business.service';
import { StoreStatusService } from '~/app/services/store-status.service';

import { DeliveryMethodType, DialogMessage, OpenStatus } from '~/app/services/app.models';

import {
    StripeErrorMessage,
    TrnCheckoutCustomerAccount,
    TrnCheckoutPaymentMethod,
    TrnCustomerBillingDeliveryMethod,
    TrnCustomerBillingPaymentMethod,
    TrnCustomerBillingPaymentSplit,
    TrnOrder,
    UserAddress,
    UserBillingClient,
    UserInvoiceBilling,
    UserInvoicesItem,
    UserInvoiceWithPaymentAdd,
    UserPaymentMethod,
    UserPhone
} from '~/app/modules/user/services/user.models';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';

export enum CheckoutComponentView {
    loading,
    select,
    error,
    cartEmpty,
    statusNotOpen
}

@Component({
    selector: 'ns-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
    moduleId: module.id
})
export class CheckoutComponent extends ViewBase implements OnInit {

    get submitProcess(): ObservableProcessLateBind {

        if (this.fSubmitProcess === null) {
            this.fSubmitProcess = new ObservableProcessLateBind(this, 'Error placing order');
        }

        return this.fSubmitProcess;

    }

    get notOpenStatusMessage(): DialogMessage {
        return this.businessService.getOpenStatusMessage(this.storeStatusService.storeStatus.openStatus);
    }

    get getBillingClientProcess(): ObservableProcess {

        if (this.fGetBillingClientProcess == null) {
            this.fGetBillingClientProcess = new ObservableProcess(this, 'error getting billing information',
                this.userService.userBillingClient(),
                (view: CheckoutComponent, data: UserBillingClient) => {

                    view.addressModel = new UserAddress();

                    if (data.street) {
                        view.addressModel.company = data.company;
                        view.addressModel.companyNumber = data.companyNumber;
                        view.addressModel.addressNote = data.addressNote;
                        view.addressModel.street = data.street;
                        view.addressModel.extended = data.extended;
                        view.addressModel.locality = data.locality;
                        view.addressModel.region = data.region;
                        view.addressModel.postalCode = data.postalCode;
                        view.addressModel.country = data.country;
                        view.addressModel.lat = data.lat;
                        view.addressModel.lng = data.lng;
                        view.addressModel.distance = data.distance;

                    }

                    view.mobileModel = new UserPhone();
                    if (data.phoneNumber && data.phoneNumberConfirmed) {
                        view.mobileModel.phoneNumber = data.phoneNumber;
                        view.mobileModel.phoneNumberConfirmed = data.phoneNumberConfirmed;
                    } else {
                        view.mobileModel.phoneNumberConfirmed = false;
                    }

                    view.checkoutPaymentMethod.paymentMethods = data.paymentMethods;

                    view.checkoutCustomerAccount = new TrnCheckoutCustomerAccount();
                    view.checkoutCustomerAccount.points = data.points;
                    view.checkoutCustomerAccount.balance = data.balance;
                    view.checkoutCustomerAccount.bonusTrigger = data.bonusTrigger;
                    view.checkoutCustomerAccount.bonus = data.bonus;
                    view.checkoutCustomerAccount.nextBonusTrigger = data.nextBonusTrigger;
                    view.checkoutCustomerAccount.nextBonus = data.nextBonus;
                    view.checkoutCustomerAccount.pointRedemptiomRatio =
                        view.businessService.business.pointRedemptionRatio;
                    view.checkoutCustomerAccount.orderCount = data.orderCount;
                    view.checkoutCustomerAccount.deliveryCount = data.deliveryCount;
                    view.checkoutCustomerAccount.promoTaken = data.promoTaken;
                    view.checkoutCustomerAccount.deliveryTaken = data.deliveryTaken;

                    view.appService.data.cartTransaction.promotion = !data.promoTaken;
                    view.appService.data.cartTransaction.deliveryPromo = !data.deliveryTaken;

                    view.componentView = CheckoutComponentView.select;

                },
                null
            );
        }

        return this.fGetBillingClientProcess;

    }

    get getCheckoutPaymentMethodProcess(): ObservableProcess {

        if (this.fGetCheckoutPaymentMethodProcess == null) {
            this.fGetCheckoutPaymentMethodProcess = new ObservableProcess(this, 'error getting payment methods',
                this.userService.userPaymentMethodsRead(),
                (view: CheckoutComponent, data: Array<UserPaymentMethod>) => {

                    view.checkoutPaymentMethod = new TrnCheckoutPaymentMethod();
                    view.checkoutPaymentMethod.paymentMethods = data;

                },
                null
            );
        }

        return this.fGetCheckoutPaymentMethodProcess;

    }

    get getUserPhoneProcess(): ObservableProcess {

        if (this.fGetUserPhoneProcess == null) {
            this.fGetUserPhoneProcess = new ObservableProcess(this, 'error getting mobile number',
                this.userService.userPhoneFind(),
                (view: CheckoutComponent, data: UserPhone) => {

                    view.mobileModel = data;

                    this.changeDetectorRef.detectChanges();

                },
                null
            );
        }

        return this.fGetUserPhoneProcess;

    }

    private fGetBillingClientProcess: ObservableProcess = null;
    private fGetCheckoutPaymentMethodProcess: ObservableProcess = null;
    private fGetUserPhoneProcess: ObservableProcess = null;

    private fSubmitProcess: ObservableProcessLateBind = null;

    private sendOrder(paymentToken: string) {

        const apiModel: UserInvoiceWithPaymentAdd = new UserInvoiceWithPaymentAdd();
        apiModel.version = 2;
        apiModel.documentId = null;
        apiModel.documentDate = null;
        apiModel.pagerNumber = null;
        apiModel.adjustmentType = 0;
        apiModel.adjustmentAmount = 0;
        apiModel.productPoints = 0;
        apiModel.spendPoints = 0;

        apiModel.orderNumber = this.billingDeliveryMethod.tableNumber;

        if (this.deliveryZone) {
            apiModel.storeDeliveryZoneId = this.deliveryZone.storeDeliveryZoneId;
        } else {
            apiModel.storeDeliveryZoneId = null;
        }

        apiModel.deliveryFee = this.appService.data.cartTransaction.deliveryFeeAmount;
        apiModel.promotionAmount = this.appService.data.cartTransaction.promotionAmount;
        apiModel.promotionRate = this.appService.data.cartTransaction.promotionRate;
        apiModel.deliveryPromotion = this.appService.data.cartTransaction.deliveryPromoActive;

        apiModel.storeStatusTime = this.billingDeliveryMethod.storeStatusTime.format('YYYY-MM-DDTHH:mm:ss');
        apiModel.deliveryMethodType = this.billingDeliveryMethod.selectedType;
        apiModel.deliveryMethodAsap = this.billingDeliveryMethod.asap;
        if (apiModel.deliveryMethodAsap) {
            apiModel.scheduledDeliveryMethodTime = null;
        } else {
            apiModel.scheduledDeliveryMethodTime =
                this.billingDeliveryMethod.selectedTime.format('YYYY-MM-DDTHH:mm:ss');
        }

        apiModel.storePrepTime = this.storeStatusService.storeStatus.storeState.storePrepTime;
        apiModel.driverDeliveryTime = this.storeStatusService.storeStatus.storeState.driverDeliveryTime;

        apiModel.orderComment = null;

        apiModel.billing = new UserInvoiceBilling();

        if (this.updatedAddressModel) {

            apiModel.billing.company = this.updatedAddressModel.company;
            apiModel.billing.companyNumber = this.updatedAddressModel.companyNumber;
            apiModel.billing.addressNote = this.updatedAddressModel.addressNote;
            apiModel.billing.street = this.updatedAddressModel.street;
            apiModel.billing.extended = this.updatedAddressModel.extended;
            apiModel.billing.locality = this.updatedAddressModel.locality;
            apiModel.billing.region = this.updatedAddressModel.region;
            apiModel.billing.postalCode = this.updatedAddressModel.postalCode;
            apiModel.billing.country = this.updatedAddressModel.country;
            apiModel.billing.lat = this.updatedAddressModel.lat;
            apiModel.billing.lng = this.updatedAddressModel.lng;
            apiModel.billing.distance = this.updatedAddressModel.distance;

        } else {

            apiModel.billing.company = this.addressModel.company;
            apiModel.billing.companyNumber = this.addressModel.companyNumber;
            apiModel.billing.addressNote = this.addressModel.addressNote;
            apiModel.billing.street = this.addressModel.street;
            apiModel.billing.extended = this.addressModel.extended;
            apiModel.billing.locality = this.addressModel.locality;
            apiModel.billing.region = this.addressModel.region;
            apiModel.billing.postalCode = this.addressModel.postalCode;
            apiModel.billing.country = this.addressModel.country;
            apiModel.billing.lat = this.addressModel.lat;
            apiModel.billing.lng = this.addressModel.lng;
            apiModel.billing.distance = this.addressModel.distance;

        }

        apiModel.billing.paymentMethodId = this.billingPaymentMethod.paymentMethodId;
        apiModel.billing.paymentToken = paymentToken;

        apiModel.items = [];

        let itemIndex = 0;

        for (const item of this.appService.data.cartTransaction.cartDisplayItems) {

            apiModel.items.push(new UserInvoicesItem());
            apiModel.items[itemIndex].name = item.transactionItem.name;
            apiModel.items[itemIndex].productId = item.productId;
            apiModel.items[itemIndex].productCode = item.plu;

            apiModel.items[itemIndex].itemNumber = item.itemNumber;
            if (item.isCondiment || item.isInstructions) {
                apiModel.items[itemIndex].itemTypeId = 10;
            } else {
                apiModel.items[itemIndex].itemTypeId = 3;
            }
            apiModel.items[itemIndex].isReadable = true;
            apiModel.items[itemIndex].isCondiment = item.isCondiment;
            apiModel.items[itemIndex].isInstructions = item.isInstructions;
            apiModel.items[itemIndex].isScale = item.isScaleItem;
            apiModel.items[itemIndex].description = item.description;
            apiModel.items[itemIndex].taxable = item.tax !== 0;
            apiModel.items[itemIndex].quantity = item.qty;
            apiModel.items[itemIndex].discount = 0;
            apiModel.items[itemIndex].totalExTax = item.exTaxTotal;
            apiModel.items[itemIndex].taxAmount = Math.round((item.total - item.exTaxTotal) * 100) / 100;
            apiModel.items[itemIndex].total = item.total;
            apiModel.items[itemIndex].productPoints = 0;
            apiModel.items[itemIndex].spendPoints = 0;
            apiModel.items[itemIndex].currency = 'AUD';

            itemIndex++;
        }

        apiModel.totalEx = this.appService.data.cartTransaction.exTaxTotal;
        apiModel.taxAmount = this.appService.data.cartTransaction.taxAmount;
        apiModel.total = this.appService.data.cartTransaction.total;
        apiModel.redeemPoints = this.billingPaymentSplit.redeemPoints;
        apiModel.redeemCurrency = this.billingPaymentSplit.redeemCurrency;

        // console.error(apiModel.storeStatusTime);

        this.submitProcess.doLateBind(
            this.userService.invoiceWithPayment(apiModel),
            (view: CheckoutComponent, data: TrnOrder) => {

                view.ngZone.run(() => {

                    view.checkoutProcessing = false;
                    view.appService.data.cartTransaction.clearCart(false);
                    view.router.navigate(['user/order-detail', data.trnOrderId], {replaceUrl: true});

                });

            });

    }

    constructor(public userService: UserService,
                public appService: AppService,
                public storeStatusService: StoreStatusService,
                public businessService: BusinessService,
                public changeDetectorRef: ChangeDetectorRef,
                public modalService: ModalDialogService,
                public viewContainerRef: ViewContainerRef,
                public ngZone: NgZone,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.stripe = new Stripe(businessService.business.paymentKey);

    }

    @ViewChild('checkoutSelect', { static: false })  checkoutSelect?: ElementRef;

    stripe: Stripe;

    stripeErrorMessage: StripeErrorMessage;

    checkoutProcessing = false;
    inPaymentTokenProcess = false;
    checkoutError: any;

    CheckoutComponentView = CheckoutComponentView;
    componentView: CheckoutComponentView = CheckoutComponentView.loading;

    checkoutPaymentMethod: TrnCheckoutPaymentMethod = new TrnCheckoutPaymentMethod();

    checkoutCustomerAccount: TrnCheckoutCustomerAccount = null;

    addressModel: UserAddress;
    updatedAddressModel: UserAddress;
    deliveryZone: StoreDeliveryZone;

    mobileModel: UserPhone;

    billingDeliveryMethod: TrnCustomerBillingDeliveryMethod;
    billingPaymentMethod: TrnCustomerBillingPaymentMethod;
    billingPaymentSplit: TrnCustomerBillingPaymentSplit;
    paymentMethodAddForm: FormGroup = new FormGroup({});

    ngOnInit() {
        if (this.storeStatusService.storeStatus.openStatus !== OpenStatus.open) {
            this.componentView = CheckoutComponentView.statusNotOpen;
        } else if (this.appService.data.cartTransaction.items.length === 0) {
            this.componentView = CheckoutComponentView.cartEmpty;
        } else {
            this.getBillingClientProcess.do();
        }

    }

    handleError(error: any, title?: string) {

        // console.error('error!');

        this.checkoutProcessing = false;

        const errorMessage = this.errorService.getErrorMessage(error);

        if (errorMessage === 'Order is too old, refresh the checkout page.') {
            this.checkoutError = new Error(errorMessage);
        } else {
            super.handleError(error, title);
        }

    }

    updateDeliveryFee() {

        this.deliveryZone = null;

        if (this.businessService.business.usesDeliveryZones) {
            if (this.billingDeliveryMethod.selectedType === DeliveryMethodType.delivery) {
                if (this.addressModel || this.updatedAddressModel) {
                    let distance = -1;
                    if (this.updatedAddressModel) {
                        distance = this.updatedAddressModel.distance;
                    } else {
                        distance = this.addressModel.distance;
                    }

                    this.deliveryZone = this.businessService.business.getDeliveryZone(distance);

                    if (this.deliveryZone === null) {
                        this.appService.data.cartTransaction.deliveryFee = false;
                    } else {
                        this.appService.data.cartTransaction.updateDeliveryFee(this.deliveryZone.deliveryFee);
                    }

                } else {
                    this.appService.data.cartTransaction.deliveryFee = false;
                }
            } else {
                this.appService.data.cartTransaction.deliveryFee = false;
            }
        } else {
            this.appService.data.cartTransaction.deliveryFee =
                this.billingDeliveryMethod.selectedType === DeliveryMethodType.delivery;
        }
    }

    onUpdateBillingDeliveryMethod(event: TrnCustomerBillingDeliveryMethod) {
        this.billingDeliveryMethod = event;
        this.updateDeliveryFee();
    }

    onUpdateAddress(event) {
        this.updatedAddressModel = event;
        this.updateDeliveryFee();
    }

    onUpdateBillingPaymentMethod(event: TrnCustomerBillingPaymentMethod) {
        this.billingPaymentMethod = event;

    }

    onUpdateCheckoutPaymentMethod(event: boolean) {

        if (!event) {
            return;
        }
        this.getCheckoutPaymentMethodProcess.do();

    }

    onUpdateMobile(event: boolean) {

        if (!event) {
            return;
        }

        this.getUserPhoneProcess.do();

    }

    onPaymentMethodTokenError(message: string) {

        this.ngZone.run(() => {

            this.stripeErrorMessage = new StripeErrorMessage(message);

            const options: ModalDialogOptions = {
                context: new DialogMessage('Payment Details Error', message),
                fullscreen: false,
                viewContainerRef: this.viewContainerRef
            };
            this.modalService.showModal(MessageDialogComponent, options);

        });

    }

    onGetPaymentMethodToken() {

        this.inPaymentTokenProcess = true;
        this.viewService.addWorkingProcess();

        this.stripe.createToken(new Card(
            this.paymentMethodAddForm.get('cardNumber').value,
            this.paymentMethodAddForm.get('cardExpiryMonth').value,
            this.paymentMethodAddForm.get('cardExpiryYear').value,
            this.paymentMethodAddForm.get('cardCVC').value), (error: Error, result: Token) => {

            this.inPaymentTokenProcess = false;
            this.viewService.removeWorkingProcess();

            if (!error) {

                if (result.id) {

                    if (result.card) {

                        this.billingPaymentMethod.paymentMethodId = null;
                        this.sendOrder(result.id);

                    } else {
                        this.checkoutProcessing = false;
                        this.onPaymentMethodTokenError('UNKNOWN CARD ERROR');
                    }

                } else {
                    this.checkoutProcessing = false;
                    this.onPaymentMethodTokenError('UNKNOWN CARD ERROR');
                }

            } else {
                this.checkoutProcessing = false;
                this.onPaymentMethodTokenError(error.message);
            }

        });

    }

    onPlaceOrder(event: TrnCustomerBillingPaymentSplit) {

        if (!event) {
            return;
        }

        this.stripeErrorMessage = null;

        this.checkoutProcessing = true;

        this.billingPaymentSplit = event;

        if (this.billingPaymentMethod.newCard) {
            this.onGetPaymentMethodToken();
        } else {
            this.sendOrder(null);
        }

    }

}
