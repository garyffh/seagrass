import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { LoginModel, RegistrationModel, VerifyModel } from '~/app/services/authentication.models';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { SixDigitEntryComponent } from '~/app/modules/ui/six-digit-entry/six-digit-entry.component';
import {
    emailValidator,
    matchingPasswords,
    passwordValidators
} from '~/app/modules/shared/infrastructure/app-validators';

export enum ComponentSignUpView {
    default,
    registerConfirm,
    registerDone,
    registerFail
}

@Component({
    selector: 'ns-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    moduleId: module.id
})
export class SignUpComponent extends ViewBase {

    get mobileSubmitted(): boolean {
        return this.fMobileSubmitted;
    }

    get registrationProcess(): ObservableProcessLateBind {
        if (this.fRegistrationProcess === null) {
            this.fRegistrationProcess = new ObservableProcessLateBind(this, 'error registering');
        }

        return this.fRegistrationProcess;
    }

    get signInProcess(): ObservableProcessLateBind {

        if (this.fSignInProcess === null) {
            this.fSignInProcess = new ObservableProcessLateBind(this, 'Sign In failed');
        }

        return this.fSignInProcess;

    }

    private fRegistrationProcess: ObservableProcessLateBind = null;
    private fSignInProcess: ObservableProcessLateBind = null;

    private fMobileSubmitted = false;

    constructor(public formBuilder: FormBuilder,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.compose([Validators.required, Validators.maxLength(80)])],
            lastName: ['', Validators.compose([Validators.required, Validators.maxLength(80)])],
            email: ['', Validators.compose([Validators.required, emailValidator])],
            mobile: ['', Validators.compose([Validators.maxLength(20)])],
            password: ['', Validators.compose(passwordValidators())],
            confirmPassword: ['', Validators.required]
        }, {validator: matchingPasswords('password', 'confirmPassword')});

        this.registerForm.statusChanges.subscribe(() => {
            // console.error(this.registerForm.controls.password.errors);
        });

    }

    ComponentSignUpView = ComponentSignUpView;
    componentView: ComponentSignUpView = ComponentSignUpView.default;

    failMessage: string;
    signInFailMessage: string;

    registerForm: FormGroup = new FormGroup({});

    mobileCodeForm: FormGroup = new FormGroup({});
    emailCodeForm: FormGroup = new FormGroup({});

    showRegisterValidationError(fieldName: string): boolean {
        return (!this.registerForm.get(fieldName).valid) && this.registerForm.get(fieldName).touched;
    }

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentSignUpView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.registerForm.get('password').reset();
                this.registerForm.get('confirmPassword').reset();

                this.componentView = ComponentSignUpView.registerFail;

                break;
            }

            case ComponentSignUpView.registerConfirm: {

                this.registerForm.get('password').reset();
                this.registerForm.get('confirmPassword').reset();

                this.mobileCodeForm.reset();
                this.emailCodeForm.reset();

                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentSignUpView.registerFail;

                break;
            }

            case ComponentSignUpView.registerDone: {

                this.signInFailMessage = this.errorService.getErrorMessage(error);

                break;
            }

        }

    }

    onMobileCodeComplete(emailCodeEntry: SixDigitEntryComponent, event: boolean) {

        if (event) {
            if (!this.emailCodeForm.valid) {
               emailCodeEntry.setFocus();
            }
        }

    }

    onEmailCodeComplete(mobileCodeEntry: SixDigitEntryComponent, event: boolean) {

        if (event) {
            if (!this.mobileCodeForm.valid) {
                mobileCodeEntry.setFocus();
            }
        }

    }

    onContinue() {
        if (this.componentView === ComponentSignUpView.registerDone) {

            const apiModel = new LoginModel();
            apiModel.email = this.registerForm.get('email').value;
            apiModel.password = this.registerForm.get('password').value;

            this.signInProcess.doLateBind(
                this.authenticationService.loginUser(apiModel),
                (view: SignUpComponent, data: any) => {

                    view.registerForm.reset();
                    if (this.appService.data.cartTransaction.items.length === 0) {
                        view.router.navigate(['/user'], {replaceUrl: false});
                    } else {
                        view.router.navigate(['/user/checkout'], {replaceUrl: false});
                    }
                }
            );

        } else {
            this.componentView = ComponentSignUpView.default;
        }
    }

    onRegisterFormSubmit(): void {
        if (!this.registerForm.valid) {
            return;
        }

        const content = new VerifyModel();
        content.emailAddress = this.registerForm.get('email').value;
        content.firstName = this.registerForm.get('firstName').value;
        content.lastName = this.registerForm.get('lastName').value;
        content.mobileNumber = this.registerForm.get('mobile').value;
        content.captcha = null;

        if (content.mobileNumber) {
            this.fMobileSubmitted = true;
        } else {
            this.fMobileSubmitted = false;
        }

        // this.mobileCodeForm.removeControl('mobileCode');

        // if (this.mobileSubmitted) {
        //     this.verificationForm.addControl('mobileCode', new FormControl('', [Validators.required]));
        // } else {
        //     this.verificationForm.addControl('mobileCode', new FormControl(''));
        // }

        this.registrationProcess.doLateBind(
            this.authenticationService.verifyUser(content),
            (view: SignUpComponent, data: any) => {
                view.componentView = ComponentSignUpView.registerConfirm;
            }
        );

    }

    onVerificationFormSubmit(): void {
        if (!this.mobileCodeForm.valid || !this.emailCodeForm.valid) {
            return;
        }

        const content = new RegistrationModel();
        content.email = this.registerForm.get('email').value;
        content.firstName = this.registerForm.get('firstName').value;
        content.lastName = this.registerForm.get('lastName').value;
        content.emailCode = this.emailCodeForm.get('digit1').value + this.emailCodeForm.get('digit2').value +
            this.emailCodeForm.get('digit3').value + this.emailCodeForm.get('digit4').value +
            this.emailCodeForm.get('digit5').value + this.emailCodeForm.get('digit6').value;
        content.password = this.registerForm.get('password').value;
        content.confirmPassword = this.registerForm.get('confirmPassword').value;

        if (this.mobileSubmitted) {
            content.mobileCode = this.mobileCodeForm.get('digit1').value + this.mobileCodeForm.get('digit2').value +
                this.mobileCodeForm.get('digit3').value + this.mobileCodeForm.get('digit4').value +
                this.mobileCodeForm.get('digit5').value + this.mobileCodeForm.get('digit6').value;

            content.mobileNumber = this.registerForm.get('mobile').value;

        } else {
            content.mobileNumber = '';
            content.mobileCode = '';
        }
        content.captcha = null;

        this.emailCodeForm.get('digit1').setValue('');
        this.emailCodeForm.get('digit2').setValue('');
        this.emailCodeForm.get('digit3').setValue('');
        this.emailCodeForm.get('digit4').setValue('');
        this.emailCodeForm.get('digit5').setValue('');
        this.emailCodeForm.get('digit6').setValue('');

        this.mobileCodeForm.get('digit1').setValue('');
        this.mobileCodeForm.get('digit2').setValue('');
        this.mobileCodeForm.get('digit3').setValue('');
        this.mobileCodeForm.get('digit4').setValue('');
        this.mobileCodeForm.get('digit5').setValue('');
        this.mobileCodeForm.get('digit6').setValue('');

        this.registrationProcess.doLateBind(
            this.authenticationService.registerUser(content),
            (view: SignUpComponent, data: any) => {

                this.emailCodeForm.reset();
                this.mobileCodeForm.reset();
                view.componentView = ComponentSignUpView.registerDone;

            }
        );

    }

}
