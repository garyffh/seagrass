import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import {
  UserDashboard, UserModel, IdentityConfirmModel, ChangePasswordModel, UserAddress, PhoneVerifyModel,
  PhoneUpdateModel, UserPaymentMethodAdd, UserPaymentMethod, UserBillingClient, UserInvoiceWithPaymentAdd,
  UserTransactionReadOption, UserTransactionModel, InvoiceDetail, CreditDetail, PaymentDetail, UserPhone, TrnOrderRead,
  TrnOrder, UserNotificationUpdate
} from './user.models';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private httpService: HttpService) {
  }

  userGet(): Observable<UserModel> {
    return this.httpService.httpGetWithModel<UserModel>('user');

  }

  userChangePassword(model: ChangePasswordModel): Observable<any> {
    return this.httpService.httpPut('user/change-password', model);

  }

  userDelete(model: IdentityConfirmModel): Observable<any> {
    return this.httpService.httpPost('user/delete', model);

  }

  userRenewVerificationCode(): Observable<UserModel> {
    return this.httpService.httpPostWithModel<UserModel>('user/renew-verification-code', null);
  }

  userDashboard(): Observable<UserDashboard> {
    return this.httpService.httpGetWithModel<UserDashboard>(`user/dashboard`);

  }

  userAddressFind(): Observable<UserAddress> {
    return this.httpService.httpGetWithModel<UserAddress>(`user/address`);

  }

  userAddressUpdate(model: UserAddress): Observable<UserAddress> {

    return this.httpService.httpPutWithModel<UserAddress>(`store-user/address`, model);

  }

  phoneVerify(model: PhoneVerifyModel): Observable<PhoneVerifyModel> {
    return this.httpService.httpPutWithModel<PhoneVerifyModel>('user/phone-verify', model);

  }

  phoneUpdate(model: PhoneUpdateModel) {
    return this.httpService.httpPut('store-user/phone-update', model);
  }

  userPhoneFind(): Observable<UserPhone> {
    return this.httpService.httpGetWithModel<UserPhone>(`user/phone-find`);

  }

  userPaymentMethodsRead(): Observable<Array<UserPaymentMethod>> {
    return this.httpService.httpGetWithModel<Array<UserPaymentMethod>>('user/payment-methods');

  }

  userPaymentMethodFind(paymentMethodId: string): Observable<UserPaymentMethod> {
    return this.httpService.httpGetWithModel<UserPaymentMethod>(`user/payment-method-find/${paymentMethodId}`);

  }

  userPaymentMethodAdd(model: UserPaymentMethodAdd): Observable<any> {
    return this.httpService.httpPost('user/payment-method', model);

  }

  userPaymentMethodUpdate(model: UserPaymentMethod): Observable<any> {
    return this.httpService.httpPutWithModel<UserPaymentMethod>('user/payment-methods', model);

  }

  userPaymentMethodDefault(model: UserPaymentMethod): Observable<any> {
    return this.httpService.httpPost('user/payment-method-default', model);

  }

  userPaymentMethodDelete(model: UserPaymentMethod): Observable<any> {
    return this.httpService.httpPost('user/payment-method-delete', model);

  }

  userBillingClient(): Observable<UserBillingClient> {

    return this.httpService.httpGetWithModel<UserBillingClient>(`user/billing-client`);

  }

  invoiceWithPayment(model: UserInvoiceWithPaymentAdd): Observable<TrnOrder> {

    return this.httpService.httpPostWithModel<TrnOrder>(`checkout/invoice-with-payment`, model);

  }

  userOrders(): Observable<Array<TrnOrderRead>> {

    return this.httpService.httpGetWithModel<Array<TrnOrderRead>>('trn-order')
      .pipe(
        map((data) => data.map((e) => new TrnOrderRead(e)))
      );

  }

  userOrderFind(trnOrderId: string): Observable<TrnOrder> {

    return this.httpService.httpGetWithModel<TrnOrder>(`trn-order/${trnOrderId}`)
      .pipe(
        map((data) => new TrnOrder(data))
      );

  }

  userTransactions(): Observable<Array<UserTransactionModel>> {
    const apiModel = new UserTransactionReadOption();
    apiModel.searchTypeId = 0;
    apiModel.userSubscriptionId = null;
    apiModel.fromDate = null;
    apiModel.toDate = null;

    return this.httpService.httpPutWithModel<Array<UserTransactionModel>>('user/user-transaction', apiModel);

  }

  userInvoiceDetail(documentId: string): Observable<InvoiceDetail> {

    return this.httpService.httpGetWithModel<InvoiceDetail>(`user/user-transaction/invoice/${documentId}`);

  }

  userCreditDetail(documentId: string): Observable<CreditDetail> {

    return this.httpService.httpGetWithModel<CreditDetail>(`user/user-transaction/credit/${documentId}`);

  }

  userPaymentDetail(documentId: string): Observable<PaymentDetail> {

    return this.httpService.httpGetWithModel(`user/user-transaction/payment/${documentId}`);

  }

  userNotificationUpdate(record: UserNotificationUpdate): Observable<UserNotificationUpdate> {
    return this.httpService.httpPutWithModel<UserNotificationUpdate>('store-user/notification-update', record);
  }

}
