import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpService } from '../../../services/http.service';

import {
  DriverDeliveries,
  DriverDisableDeliveries,
  DriverEnableDeliveries, DriverInvoice, DriverPayment,
  DriverTransactionModel,
  DriverTransactionReadOption,
  TrnDelivery,
  TrnDeliveryAction,
  UserCar
} from './driver.models';

@Injectable({
    providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient,
              private httpService: HttpService) {
  }

  userCarsRead(): Observable<Array<UserCar>> {
    return this.httpService.httpGetWithModel<Array<UserCar>>('user/cars');

  }

  userCarFind(userCarId: string): Observable<UserCar> {
    return this.httpService.httpGetWithModel<UserCar>(`user/car-find/${userCarId}`);

  }

  userCarAdd(model: UserCar): Observable<any> {
    return this.httpService.httpPost('user/car', model);

  }

  userCarUpdate(model: UserCar): Observable<any> {
    return this.httpService.httpPutWithModel<UserCar>('user/car', model);

  }

  userCarCurrent(model: UserCar): Observable<any> {
    return this.httpService.httpPost('user/car-current', model);

  }

  userCarDelete(model: UserCar): Observable<any> {
    return this.httpService.httpPost('user/car-delete', model);

  }

  driverDeliveriesFind(): Observable<DriverDeliveries> {
    return this.httpService.httpGetWithModel<DriverDeliveries>('driver/deliveries');
  }

  driverDeliveryFind(id: string): Observable<TrnDelivery> {
    return this.httpService.httpGetWithModel<TrnDelivery>(`driver/delivery/${id}`);
  }

  driverEnableDeliveriesFind(): Observable<DriverEnableDeliveries> {
    return this.httpService.httpGetWithModel<DriverEnableDeliveries>('driver/enable-deliveries');
  }

  driverEnableDeliveriesAck(): Observable<any> {
    return this.httpService.httpPut('driver/enable-deliveries-ack', null);
  }

  driverEnableDeliveries(): Observable<any> {
    return this.httpService.httpPut('driver/enable-deliveries', null);
  }

  driverDisableDeliveriesFind(): Observable<DriverDisableDeliveries> {
    return this.httpService.httpGetWithModel<DriverDisableDeliveries>('driver/disable-deliveries');
  }

  driverDisableDeliveries(): Observable<any> {
    return this.httpService.httpPut('driver/disable-deliveries', null);
  }

  drive(id: string): Observable<TrnDeliveryAction> {
    return this.httpService.httpGetWithModel<TrnDeliveryAction>(`driver/drive/${id}`);
  }

  deliver(id: string): Observable<TrnDeliveryAction> {
    return this.httpService.httpGetWithModel<TrnDeliveryAction>(`driver/deliver/${id}`);
  }

  driverTransactions(): Observable<Array<DriverTransactionModel>> {
    const apiModel = new DriverTransactionReadOption();
    apiModel.searchTypeId = 0;
    apiModel.userSubscriptionId = null;
    apiModel.fromDate = null;
    apiModel.toDate = null;

    return this.httpService.httpPutWithModel<Array<DriverTransactionModel>>('driver/transactions', apiModel);

  }

  driverInvoice(documentId: string): Observable<DriverInvoice> {
    return this.httpService.httpGetWithModel<DriverInvoice>(`driver/invoice/${documentId}`);
  }

  driverPayment(documentId: string): Observable<DriverPayment> {
    return this.httpService.httpGetWithModel<DriverPayment>(`driver/payment/${documentId}`);
  }

}
