import { throwError } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { HttpService, ServerToken } from './http.service';
import { RouterExtensions } from 'nativescript-angular';

import { StorageService } from './storage.service';
import {
    LoginModel,
    RegistrationModel,
    VerifyModel,
    User,
    ForgotPassword,
    PasswordReset,
    DeviceUpdateModel
} from './authentication.models';
import { isAndroid } from 'tns-core-modules/platform';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
  get authenticationStateEvent(): EventEmitter<boolean> {
    return this.fAuthenticationStateEvent;
  }

  get user(): User {
    return this.fUser;
  }

  set user(value: User) {
    this.fUser = value;
    if (value != null) {
      this.fLastEmail = this.fUser.email;
    }
    this.storageService.setObject(this.fUserStorageKey, this.fUser);
  }

  get userIsAuthenicated(): boolean {
    return this.fUser != null;
  }

  private fUser: User = null;
  private fLastEmail = '';
  private fUserStorageKey = 'user';
  private fDeviceTokenKey: string = 'device-token';

  private fAuthenticationStateEvent: EventEmitter<boolean> = new EventEmitter();

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  constructor(private router: RouterExtensions,
              private storageService: StorageService,
              private httpService: HttpService) {

    this.fUser = this.storageService.getObject(this.fUserStorageKey);

  }

  redirectUrl: string;

  // updates from server token
  updateUser(data: ServerToken) {
    this.user = new User(data.userName, data.firstName, data.lastName, data.cardNumber,  data.ceo, data.admin,
        data.driver, data.waiter);
  }

  removeUser() {
    if (this.fUser != null) {
      this.fLastEmail = this.fUser.email;
    } else {
      this.fLastEmail = '';
    }

    this.user = null;
    this.httpService.token = null;
  }

  loginUser(model: LoginModel) {

    this.removeUser();

    return this.httpService.loginUser(model.email, model.password)
      .pipe(
        tap((data) => {
          this.updateUser(data);
          this.authenticationStateEvent.emit(true);
          this.deviceUpdate();
        })
      );
  }

  logoutUser() {
    this.removeUser();
    this.authenticationStateEvent.emit(false);

  }

  getDefaultLoginModel() {
    const rtn = new LoginModel();

    return rtn;
  }

  verifyUser(model: VerifyModel) {

    return this.httpService.httpPost('user/verification', model);
  }

  registerUser(model: RegistrationModel) {
    return this.httpService.httpPost('store-user', model);
  }

  forgotPassword(model: ForgotPassword) {
    return this.httpService.httpPut('user/forgot-password', model);
  }

  passwordReset(model: PasswordReset) {
    return this.httpService.httpPut('user/reset-password', model);
  }

  deviceUpdate() {

      const deviceToken: string = this.storageService.getObject(this.fDeviceTokenKey);

      if (deviceToken !== null) {

          const apiModel: DeviceUpdateModel = new DeviceUpdateModel();
          if (isAndroid) {
              apiModel.typeId = 1;
          } else {
              apiModel.typeId = 2;
          }
          apiModel.token = deviceToken;

          this.httpService.httpPut('user/device-update', apiModel)
              // tslint:disable-next-line:no-empty
              .subscribe((data) => {
              },
                  // tslint:disable-next-line:no-empty
             (err) => {
             });
      }
  }

}
