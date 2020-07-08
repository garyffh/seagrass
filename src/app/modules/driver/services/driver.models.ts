import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { DeliveryMethodType } from '../../../services/app.models';
import { InvoiceDetailItem, TrnOrderDeliveryMethodStatus, TrnOrderStoreStatus } from '../../user/services/user.models';

export class UserCar {

  updateId: Uint8Array;
  userCarId: string;
  plate: string;
  model: string;
  make: string;
  colour: string;
  currentCar: boolean;

}

export class TrnDeliveryRead {

  constructor(value: TrnDeliveryRead) {
    this.updateId = value.updateId;
    this.trnOrderId = value.trnOrderId;
    this.reference = value.reference;
    this.storeStatus = value.storeStatus;
    this.deliveryMethodStatus = value.deliveryMethodStatus;
    this.scheduledStoreTime = moment(value.scheduledStoreTime);
    this.scheduledDeliveryMethodTime = moment(value.scheduledDeliveryMethodTime);
    this.deliveryMethodAsap = value.deliveryMethodAsap;
    this.firstName = value.firstName;
    this.lastName = value.lastName;

  }

  updateId: Uint8Array;
  trnOrderId: string;
  reference: string;
  storeStatus: number;
  deliveryMethodStatus: number;
  scheduledStoreTime: Moment;
  scheduledDeliveryMethodTime: Moment;
  deliveryMethodAsap: boolean;
  firstName: string;
  lastName: string;
}

export class DriverDeliveries {

  available: boolean;
  deliveries: Array<TrnDeliveryRead>;

}

export class DriverEnableDeliveries {

  ackConditions: boolean;
  available: boolean;
  conditions: boolean;
  plate: string;
  model: string;
  make: string;
  colour: string;

}

export class DriverDisableDeliveries {

  available: boolean;

}

export class TrnDeliveriesItem {

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
  plu: string;

}

export class TrnDelivery {

  constructor(value: TrnDelivery) {

    this.updateId = value.updateId;
    this.trnOrderId = value.trnOrderId;
    this.reference = value.reference;
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
    this.phoneNumber = value.phoneNumber;
    this.orderComment = value.orderComment;

    this.items = value.items;

  }

  updateId: Uint8Array;
  trnOrderId: string;
  reference: string;
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
  phoneNumber: string;
  orderComment: string;

  items: Array<TrnDeliveriesItem>;

}

export class TrnDeliveryAction {
  updateId: Array<number>;
  trnOrderId: string;
  deliveryMethodStatus: number;
  storeStatus: number;
  deliveryMethodStatusDT: Moment;
  storeStatusDT: Moment;

}

export class DriverTransactionReadOption {
  searchTypeId: number;
  userSubscriptionId: string;
  fromDate: Date;
  toDate: Date;
}

export class DriverTransactionModel {

  documentId: string;
  documentDate: Moment;
  documentType: number;
  documentReference: string;
  total: number;
  openingBalance: number;
  closingBalance: number;

}

export class DriverInvoice {

  documentId: string;
  createdDT: string;
  documentDate: Moment;
  documentDT: Moment;
  documentReference: string;
  totalEx: number;
  taxAmount: number;
  total: number;
  balance: number;

}

export class DriverPayment {

  documentId: string;
  createdDT: string;
  documentDate: Moment;
  documentDT: Moment;
  documentReference: string;
  comment: string;
  total: number;
  balance: number;

}
