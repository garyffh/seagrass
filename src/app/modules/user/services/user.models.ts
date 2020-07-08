import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

import { DeliveryMethodType } from '../../../services/app.models';

export class UserModel {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    verificationCode: string;
}

export class ChangePasswordModel {
    email: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
}

export class IdentityConfirmModel {
    email: string;
    password: string;
}

export class UserAddress {
    updateId: Uint8Array;
    isBilling: boolean;
    isPostal: boolean;
    isDelivery: boolean;
    ffhLocalityId: number;
    company: string;
    companyNumber: string;
    addressNote: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    distance: number;

}

export class PhoneVerifyModel {
    updateId: Uint8Array;
    mobileNumber: string;
}

export class PhoneUpdateModel {
    updateId: Uint8Array;
    mobileCode: string;
    mobileNumber: string;
}

export class UserPhone {

    phoneNumber: string;
    phoneNumberConfirmed: boolean;

}

export class UserMemberGroup {
    memberGroupId: string;
    name: string;
    typeId: number;
    enabled: boolean;
    spendMultiplier: number;
    priceLevel: number;
}

export class UserPaymentMethodRead {

    userPaymentMethodId: string;
    typeId: number;
    name: string;
    defaultMethod: boolean;

}

export class UserBillingClient {

    company: string;
    companyNumber: string;
    addressNote: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    distance: number;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    points: number;
    balance: number;
    bonusTrigger: number;
    bonus: number;
    nextBonusTrigger: number;
    nextBonus: number;
    orderCount: number;
    deliveryCount: number;
    promoTaken: boolean;
    deliveryTaken: boolean;

    memberGroup: UserMemberGroup;

    paymentMethods: Array<UserPaymentMethodRead>;

}

export class TrnCustomerBillingDeliveryMethod {

    storeStatusTime: Moment;
    selectedType: DeliveryMethodType;
    selectedTime: Moment;
    asap: boolean;
    tableNumber: string;

}

export class TrnCheckoutPaymentMethod {

    paymentMethods: Array<UserPaymentMethodRead> = [];

}

export class TrnCheckoutCustomerAccount {

    get currencyAvailable(): number {

        if (this.fCurrencyAvailable === null) {
            if (this.points > 0 && this.pointRedemptiomRatio > 0) {
                const amount = Math.round(this.points / this.pointRedemptiomRatio) / 100;
                if (amount >= 3) {
                    this.fCurrencyAvailable = amount;
                } else {
                    this.fCurrencyAvailable = 0;
                }

            } else {
                this.fCurrencyAvailable = 0;
            }
        }

        return this.fCurrencyAvailable;
    }

    private fCurrencyAvailable: number = null;

    points: number;
    balance: number;
    bonusTrigger: number;
    bonus: number;
    nextBonusTrigger: number;
    nextBonus: number;
    pointRedemptiomRatio: number;
    orderCount: number;
    deliveryCount: number;
    promoTaken: boolean;
    deliveryTaken: boolean;

}

export class StripeErrorMessage {

    constructor(public message: string) {
    }

}

export class TrnCustomerBillingPaymentSplit {

    redeemCurrency: number;
    redeemPoints: number;

}

export class TrnCustomerBillingPaymentMethod {

    constructor() {
        this.newCard = false;
    }

    newCard: boolean;
    paymentMethodId: string;
    cardHolderName: string;
}

export class UserInvoiceBilling {

    company: string;
    companyNumber: string;
    addressNote: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    distance: number;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;

    paymentMethodId: string;
    paymentToken: string;

}

export class UserInvoicesItem {

    itemNumber: number;
    itemTypeId: number;
    isReadable: boolean;
    isCondiment: boolean;
    isInstructions: boolean;
    isScale: boolean;
    name: string;
    productId: string;
    productCode: string;
    description: string;
    taxable: boolean;
    quantity: number;
    discount: number;
    totalExTax: number;
    taxAmount: number;
    total: number;
    spendPoints: number;
    productPoints: number;
    currency: string;

}

export class UserInvoiceWithPaymentAdd {

    documentId: string;
    documentDate: Moment;
    orderNumber: string;
    pagerNumber: number;
    version: number;

    adjustmentType: number;
    adjustmentAmount: number;
    storeDeliveryZoneId: string;
    deliveryFee: number;
    promotionRate: number;
    promotionAmount: number;
    deliveryPromotion: boolean;
    totalEx: number;
    taxAmount: number;
    total: number;

    spendPoints: number;
    productPoints: number;
    redeemPoints: number;
    redeemCurrency: number;

    storeStatusTime: string;
    deliveryMethodType: DeliveryMethodType;
    deliveryMethodAsap: boolean;
    scheduledDeliveryMethodTime: string;
    storePrepTime: number;
    driverDeliveryTime: number;
    orderComment: string;

    billing: UserInvoiceBilling;
    items: Array<UserInvoicesItem>;

}

export enum TrnOrderStoreStatus {
    scheduled = 0, noDriver = 1, queued = 2, preparing = 3, waitingForPickup = 4, waitingForDelivery = 5,
    delivering = 6, completed = 7, cancelled = 8
}

export enum TrnOrderDeliveryMethodStatus {
    scheduled = 0, preparing = 1, readyForPickup = 2, delivering = 3,
    completed = 4, cancelled = 5
}

// export class TrnOrderStoreStateModel {
//
//   trnOrderId: string;
//   storeStatusDT: Moment;
//   storeStatus: TrnOrderStoreStatus;
//
// }

export class TrnOrderUpdateModel {

    constructor(value: TrnOrderUpdateModel) {
        this.trnOrderId = value.trnOrderId;
        this.deliveryMethodType = +value.deliveryMethodType;
        this.deliveryMethodStatus = +value.deliveryMethodStatus;
        this.storeStatus = +value.storeStatus;
        this.deliveryMethodStatusDT = moment(value.deliveryMethodStatusDT);
        this.storeStatusDT = moment(value.storeStatusDT);
    }

    trnOrderId: string;
    deliveryMethodType: DeliveryMethodType;
    deliveryMethodStatus: TrnOrderDeliveryMethodStatus;
    storeStatus: TrnOrderStoreStatus;
    deliveryMethodStatusDT: Moment;
    storeStatusDT: Moment;
}

export class TrnOrderUserAllocateDriverModel {

    constructor(value: TrnOrderUserAllocateDriverModel) {

        this.trnOrderId = value.trnOrderId;
        this.deliveryMethodStatus = +value.deliveryMethodStatus;
        this.plate = value.plate;
        this.make = value.make;
        this.model = value.model;
        this.colour = value.colour;

    }

    trnOrderId: string;
    deliveryMethodStatus: TrnOrderDeliveryMethodStatus;
    plate: string;
    make: string;
    model: string;
    colour: string;

}

export class TrnOrderDriverAllocateDriverModel {

    constructor(value: TrnOrderDriverAllocateDriverModel) {
        this.trnOrderId = value.trnOrderId;
    }

    trnOrderId: string;

}

export class TrnOrderRead {

    constructor(value: TrnOrderRead) {
        this.updateId = value.updateId;
        this.trnOrderId = value.trnOrderId;
        this.reference = value.reference;
        this.deliveryMethodType = value.deliveryMethodType;
        this.storeStatus = value.storeStatus;
        this.deliveryMethodStatus = value.deliveryMethodStatus;
        this.orderDT = moment(value.orderDT);
        this.scheduledStoreTime = moment(value.scheduledStoreTime);
        this.scheduledDeliveryMethodTime = moment(value.scheduledDeliveryMethodTime);
        this.firstName = value.firstName;
        this.lastName = value.lastName;
    }

    updateId: Uint8Array;
    trnOrderId: string;
    reference: string;
    deliveryMethodType: DeliveryMethodType;
    storeStatus: TrnOrderStoreStatus;
    deliveryMethodStatus: TrnOrderDeliveryMethodStatus;
    orderDT: Moment;
    scheduledStoreTime: Moment;
    scheduledDeliveryMethodTime: Moment;
    firstName: string;
    lastName: string;

}

export class TrnOrdersItem {

    itemNumber: number;
    itemTypeId: number;
    isReadable: boolean;
    isCondiment: boolean;
    isInstructions: boolean;
    isScale: boolean;
    description: string;
    exTaxTotal: number;
    total: number;
    productPoints: number;
    spendPoints: number;
    qty: number;
    unitPrice: number;
    sysSitemId: string;
    sysSitem: string;
    productId: string;
    plu: string;

}

export class TrnOrdersDriverModel {

    plate: string;
    make: string;
    model: string;
    colour: string;
}

export class TrnOrder {

    constructor(value: TrnOrder) {

        this.updateId = value.updateId;
        this.trnOrderId = value.trnOrderId;
        this.orderDT = moment(value.orderDT);
        this.source = value.source;
        this.reference = value.reference;
        this.sentFfh = value.sentFfh;
        this.storeStatus = value.storeStatus;
        this.deliveryMethodStatus = value.deliveryMethodStatus;
        this.currency = value.currency;
        this.totalEx = value.totalEx;
        this.taxAmount = value.taxAmount;
        this.total = value.total;
        this.paidAmount = value.paidAmount;
        this.deliveryCost = value.deliveryCost;
        this.deliveryFee = value.deliveryFee;
        this.orderNumber = value.orderNumber;
        this.pagerNumber = value.pagerNumber;
        this.storeTimeZone = value.storeTimeZone;
        this.deliveryMethodType = value.deliveryMethodType;
        this.scheduledStoreTime = moment(value.scheduledStoreTime);
        this.scheduledDeliveryMethodTime = moment(value.scheduledDeliveryMethodTime);
        this.deliveryMethodAsap = value.deliveryMethodAsap;
        this.company = value.company;
        this.companyNumber = value.companyNumber;
        this.addressNote = value.addressNote;
        this.street = value.street;
        this.extended = value.extended;
        this.locality = value.locality;
        this.region = value.region;
        this.postalCode = value.postalCode;
        this.country = value.country;
        this.timeZone = value.timeZone;
        this.distance = value.distance;
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.email = value.email;
        this.phoneNumber = value.phoneNumber;
        this.orderComment = value.orderComment;

        this.items = value.items;
        this.driver = value.driver;

    }

    updateId: Uint8Array;
    trnOrderId: string;
    orderDT: Moment;
    source: string;
    reference: string;
    sentFfh: boolean;
    storeStatus: TrnOrderStoreStatus;
    deliveryMethodStatus: TrnOrderDeliveryMethodStatus;
    currency: string;
    totalEx: number;
    taxAmount: number;
    total: number;
    paidAmount: number;
    deliveryCost: number;
    deliveryFee: number;
    orderNumber: string;
    pagerNumber: number;
    storeTimeZone: string;
    deliveryMethodType: DeliveryMethodType;
    scheduledStoreTime: Moment;
    scheduledDeliveryMethodTime: Moment;
    deliveryMethodAsap: boolean;
    company: string;
    companyNumber: string;
    addressNote: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    timeZone: string;
    distance: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    orderComment: string;

    items: Array<TrnOrdersItem>;
    driver: TrnOrdersDriverModel;

}

export class TrnOrdersDriverAdminModel {

    deliveryCost: number;
    deliveryBonus: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    plate: string;
    make: string;
    model: string;
    colour: string;
}

export class TrnOrderAdmin {

    constructor(value: TrnOrderAdmin) {

        this.updateId = value.updateId;
        this.trnOrderId = value.trnOrderId;
        this.orderDT = moment(value.orderDT);
        this.source = value.source;
        this.reference = value.reference;
        this.sentFfh = value.sentFfh;
        this.storeStatus = value.storeStatus;
        this.deliveryMethodStatus = value.deliveryMethodStatus;
        this.currency = value.currency;
        this.totalEx = value.totalEx;
        this.taxAmount = value.taxAmount;
        this.total = value.total;
        this.paidAmount = value.paidAmount;
        this.deliveryCost = value.deliveryCost;
        this.deliveryFee = value.deliveryFee;
        this.orderNumber = value.orderNumber;
        this.pagerNumber = value.pagerNumber;
        this.storeTimeZone = value.storeTimeZone;
        this.deliveryMethodType = value.deliveryMethodType;
        this.scheduledStoreTime = moment(value.scheduledStoreTime);
        this.scheduledDeliveryMethodTime = moment(value.scheduledDeliveryMethodTime);
        this.deliveryMethodAsap = value.deliveryMethodAsap;
        this.company = value.company;
        this.companyNumber = value.companyNumber;
        this.addressNote = value.addressNote;
        this.street = value.street;
        this.extended = value.extended;
        this.locality = value.locality;
        this.region = value.region;
        this.postalCode = value.postalCode;
        this.country = value.country;
        this.timeZone = value.timeZone;
        this.distance = value.distance;
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.email = value.email;
        this.phoneNumber = value.phoneNumber;
        this.orderComment = value.orderComment;

        this.items = value.items;
        this.driver = value.driver;

    }

    updateId: Uint8Array;
    trnOrderId: string;
    orderDT: Moment;
    source: string;
    reference: string;
    sentFfh: boolean;
    storeStatus: TrnOrderStoreStatus;
    deliveryMethodStatus: TrnOrderDeliveryMethodStatus;
    currency: string;
    totalEx: number;
    taxAmount: number;
    total: number;
    paidAmount: number;
    deliveryCost: number;
    deliveryFee: number;
    orderNumber: string;
    pagerNumber: number;
    storeTimeZone: string;
    deliveryMethodType: DeliveryMethodType;
    scheduledStoreTime: Moment;
    scheduledDeliveryMethodTime: Moment;
    deliveryMethodAsap: boolean;
    company: string;
    companyNumber: string;
    addressNote: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    timeZone: string;
    distance: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    orderComment: string;

    items: Array<TrnOrdersItem>;
    driver: TrnOrdersDriverAdminModel;

}

export class UserTransactionReadOption {
    searchTypeId: number;
    userSubscriptionId: string;
    fromDate: Date;
    toDate: Date;
}

export class UserTransactionModel {

    documentId: string;
    documentDate: Date;
    documentType: number;
    documentSource: string;
    documentReference: string;
    userSubscriptionId: string;
    total: number;
    points: number;
    paid: number;
    redeemPoints: number;
    subscriptionBalance: number;
    openingBalance: number;
    closingBalance: number;
    pointBalance: number;
    bonusBalance: number;
    allocated: boolean;
}

export class InvoiceDetailItem {
    itemNumber: number;
    name: string;
    productCode: string;
    description: string;
    taxable: boolean;
    quantity: number;
    discount: number;
    totalExTax: number;
    taxAmount: number;
    total: number;
    productPoints: number;
    spendPoints: number;
}

export class InvoiceDetail {

    documentId: string;
    createdDT: string;
    documentDate: Moment;
    documentDT: Moment;
    documentSource: string;
    documentReference: string;
    userSubscriptionId: string;
    billingCycle: number;
    totalEx: number;
    taxAmount: number;
    total: number;
    productPoints: number;
    spendPoints: number;
    paid: number;
    redeemPoints: number;
    balance: number;
    pointBalance: number;
    bonusBalance: number;
    subscriptionBalance: number;
    allocated: boolean;
    issuerCompany: string;
    issuerCompanyNumber: string;
    issuerStreet: string;
    issuerExtended: string;
    issuerLocality: string;
    issuerRegion: string;
    issuerPostalCode: string;
    issuerCountry: string;
    issuerPhoneNumber: string;
    firstName: string;
    lastName: string;
    company: string;
    companyNumber: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    phoneNumber: string;

    items: Array<InvoiceDetailItem>;

}

export class CreditDetailItem {
    itemNumber: number;
    itemTypeId: number;
    isReadable: boolean;
    name: string;
    productCode: string;
    description: string;
    taxable: boolean;
    quantity: number;
    discount: number;
    totalExTax: number;
    taxAmount: number;
    total: number;
    productPoints: number;
    spendPoints: number;

}

export class CreditDetail {

    documentId: string;
    createdDT: string;
    reasonId: number;
    documentDate: Moment;
    documentDT: Moment;
    documentSource: string;
    documentReference: string;
    userSubscriptionId: string;
    billingCycle: number;
    totalEx: number;
    taxAmount: number;
    total: number;
    productPoints: number;
    spendPoints: number;
    paid: number;
    redeemPoints: number;
    balance: number;
    pointBalance: number;
    bonusBalance: number;
    subscriptionBalance: number;
    allocated: boolean;
    creditApplied: boolean;
    issuerCompany: string;
    issuerCompanyNumber: string;
    issuerStreet: string;
    issuerExtended: string;
    issuerLocality: string;
    issuerRegion: string;
    issuerPostalCode: string;
    issuerCountry: string;
    issuerPhoneNumber: string;
    firstName: string;
    lastName: string;
    company: string;
    companyNumber: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    phoneNumber: string;

    items: Array<CreditDetailItem>;

}

export class PaymentDetailItem {
    itemNumber: number;
    documentId: string;
    documentDate: Date;
    documentType: number;
    documentReference: string;
    total: number;
    redeemedPoints: number;
}

export class PaymentDetail {

    documentId: string;
    createdDT: string;
    documentDate: Date;
    documentSource: string;
    documentReference: string;
    userSubscriptionId: string;
    total: number;
    cardAmount: number;
    redeemAmount: number;
    redeemPoints: number;
    balance: number;
    pointBalance: number;
    bonusBalance: number;
    subscriptionBalance: number;
    allocated: boolean;
    successful: boolean;
    userPaymentMethodId: boolean;
    userPaymentTypeId: number;
    userPaymentName: string;
    paymentReference: string;
    paymentResponseCode: number;
    paymentResponseMessage: string;

    items: Array<PaymentDetailItem>;

}

export class UserPaymentMethodAdd {
    token: string;
    status: string;
    responseMessage: string;
    hash: string;
    cardId: string;
    ivrCardId: string;
    cardKey: string;
    custom1: string;
    custom2: string;
    custom3: string;
    customHash: string;

}

export class UserPaymentMethod {
    updateId: Uint8Array;
    userPaymentMethodId: string;
    typeId: number;
    name: string;
    hasSubscription: boolean;
    defaultMethod: boolean;
    failCount: number;

}

export class Checkout {

    deliveryMethod: number;
    deliveryTime: string;
    deliveryAsap: boolean;

    paymentMethod: UserPaymentMethodRead;
    paymentToken: string;

}

export class UserDashboard {

    constructor(value: UserDashboard) {

        this.address = value.address;
        this.phone = value.phone;
        this.numberOfOrders = value.numberOfOrders;
        this.balance = value.balance;
        this.points = value.points;
        this.bonusTrigger = value.bonusTrigger;
        this.bonus = value.bonus;
        this.nextBonusTrigger = value.nextBonusTrigger;
        this.nextBonus = value.nextBonus;
        this.specialDeals = value.specialDeals;

        if (value.order) {
            this.order = new TrnOrderRead(value.order);
        } else {
            this.order = null;
        }

    }

    address: UserAddress;
    phone: string;
    numberOfOrders: number;
    balance: number;
    points: number;
    bonusTrigger: number;
    bonus: number;
    nextBonusTrigger: number;
    nextBonus: number;
    specialDeals: boolean;

    order: TrnOrderRead;
}

export class UserNotificationUpdate {
    typeId: number;
    enabled: boolean;
}
