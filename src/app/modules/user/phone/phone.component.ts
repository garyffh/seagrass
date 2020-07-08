import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { UserService } from '~/app/modules/user/services/user.service';
import { PhoneVerifyModel, PhoneUpdateModel } from '../services/user.models';

export enum ComponentPhoneView {
    default,
    phoneCode,
    phoneDone,
    phoneFail
}

@Component({
    selector: 'ns-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss'],
    moduleId: module.id
})
export class PhoneComponent extends ViewBase {

    set newPhoneNumber(value: string) {
        this.fNewPhoneNumber = value;
    }

    get newPhoneNumber(): string {

        return this.fNewPhoneNumber;

    }

    get phoneNumberProcess(): ObservableProcessLateBind {

        if (this.fPhoneNumberProcess === null) {
            this.fPhoneNumberProcess = new ObservableProcessLateBind(this, 'Phone update failed');
        }

        return this.fPhoneNumberProcess;

    }

    get phoneCodeProcess(): ObservableProcessLateBind {

        if (this.fPhoneCodeProcess === null) {
            this.fPhoneCodeProcess = new ObservableProcessLateBind(this, 'Phone update failed');
        }

        return this.fPhoneCodeProcess;

    }

    private fPhoneNumberProcess: ObservableProcessLateBind = null;
    private fPhoneCodeProcess: ObservableProcessLateBind = null;

    private fNewPhoneNumber = '';

    constructor(public formBuilder: FormBuilder,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                public userService: UserService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.phoneNumberForm = this.formBuilder.group({
            mobile: ['', Validators.compose([Validators.required])]
        });

    }

    ComponentPhoneView = ComponentPhoneView;
    componentView: ComponentPhoneView = ComponentPhoneView.default;

    failMessage: string;

    phoneNumberForm: FormGroup;
    mobileCodeForm: FormGroup = new FormGroup({});

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentPhoneView.phoneCode:
            case ComponentPhoneView.default: {
                this.newPhoneNumber = '';
                this.mobileCodeForm.reset();
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentPhoneView.phoneFail;

                break;
            }

            default: {
                super.handleError(error, title);
                break;
            }

        }

    }

    onContinue() {

        switch (this.componentView) {

            case ComponentPhoneView.phoneDone: {
                this.router.navigate(['/user'], {replaceUrl: false});
                break;
            }

            default: {
                this.componentView = ComponentPhoneView.default;
                break;
            }
        }

    }

    onPhoneNumberFormSubmit(): void {

        if (!this.phoneNumberForm.valid) {
            return;
        }

        this.fNewPhoneNumber = '';

        const content = new PhoneVerifyModel();
        content.updateId = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
        content.mobileNumber = this.phoneNumberForm.get('mobile').value;

        this.phoneNumberProcess.doLateBind(
            this.userService.phoneVerify(content),
            (view: PhoneComponent, data: PhoneVerifyModel) => {
                view.newPhoneNumber = data.mobileNumber;
                view.componentView = ComponentPhoneView.phoneCode;
            }
        );

    }

    onPhoneCodeFormSubmit(): void {

        if (!this.mobileCodeForm.valid) {
            return;
        }

        const content = new PhoneUpdateModel();
        content.updateId = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
        content.mobileCode = this.mobileCodeForm.get('digit1').value + this.mobileCodeForm.get('digit2').value +
            this.mobileCodeForm.get('digit3').value + this.mobileCodeForm.get('digit4').value +
            this.mobileCodeForm.get('digit5').value + this.mobileCodeForm.get('digit6').value;

        content.mobileNumber = this.phoneNumberForm.get('mobile').value;

        this.phoneCodeProcess.doLateBind(
            this.userService.phoneUpdate(content),
            (view: PhoneComponent, data: any) => {
                view.newPhoneNumber = '';
                view.phoneNumberForm.reset();
                view.mobileCodeForm.reset();
                view.componentView = ComponentPhoneView.phoneDone;
            }
        );

    }

}
