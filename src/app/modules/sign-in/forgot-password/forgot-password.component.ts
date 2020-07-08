import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import {
    emailValidator,
    matchingPasswords,
    passwordValidators
} from '~/app/modules/shared/infrastructure/app-validators';
import { ForgotPassword, LoginModel, PasswordReset } from '~/app/services/authentication.models';

export enum ComponentForgotPasswordView {
    default,
    forgotPasswordCode,
    forgotPasswordDone,
    forgotPasswordFail
}

@Component({
    selector: 'ns-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    moduleId: module.id
})
export class ForgotPasswordComponent extends ViewBase {

    get forgotPasswordEmailProcess(): ObservableProcessLateBind {

        if (this.fForgotPasswordEmailProcess === null) {
            this.fForgotPasswordEmailProcess = new ObservableProcessLateBind(this, 'Password reset failed');
        }

        return this.fForgotPasswordEmailProcess;
    }

    get forgotPasswordCodeProcess(): ObservableProcessLateBind {

        if (this.fForgotPasswordCodeProcess === null) {
            this.fForgotPasswordCodeProcess = new ObservableProcessLateBind(this, 'Password reset failed');
        }

        return this.fForgotPasswordCodeProcess;

    }

    get signInProcess(): ObservableProcessLateBind {

        if (this.fSignInProcess === null) {
            this.fSignInProcess = new ObservableProcessLateBind(this, 'Sign In failed');
        }

        return this.fSignInProcess;

    }

    private fForgotPasswordEmailProcess: ObservableProcessLateBind = null;
    private fForgotPasswordCodeProcess: ObservableProcessLateBind = null;
    private fSignInProcess: ObservableProcessLateBind = null;

    constructor(public formBuilder: FormBuilder,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.forgotPasswordEmailForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, emailValidator])]
        });

        this.forgotPasswordCodeForm = this.formBuilder.group({
                password: ['', Validators.compose(passwordValidators())],
                confirmPassword: ['', Validators.compose([Validators.required])]
            },
            {validator: matchingPasswords('password', 'confirmPassword')});

    }

    ComponentForgotPasswordView = ComponentForgotPasswordView;
    componentView: ComponentForgotPasswordView = ComponentForgotPasswordView.default;

    failMessage: string;
    signInFailMessage: string;

    forgotPasswordEmailForm: FormGroup;
    forgotPasswordCodeForm: FormGroup;
    emailCodeForm: FormGroup = new FormGroup({});

    showEmailValidationError(fieldName: string): boolean {
        // tslint:disable-next-line:max-line-length
        return (!this.forgotPasswordEmailForm.get(fieldName).valid) &&  this.forgotPasswordEmailForm.get(fieldName).touched;
    }

    showCodeValidationError(fieldName: string): boolean {
        // tslint:disable-next-line:max-line-length
        return (!this.forgotPasswordCodeForm.get(fieldName).valid) &&  this.forgotPasswordCodeForm.get(fieldName).touched;
    }

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentForgotPasswordView.forgotPasswordCode:
            case ComponentForgotPasswordView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentForgotPasswordView.forgotPasswordFail;

                break;
            }

            case ComponentForgotPasswordView.forgotPasswordDone: {

                this.signInFailMessage = this.errorService.getErrorMessage(error);

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

            case ComponentForgotPasswordView.forgotPasswordDone: {

                const apiModel = new LoginModel();
                apiModel.email = this.forgotPasswordEmailForm.get('email').value;
                apiModel.password = this.forgotPasswordCodeForm.get('password').value;

                this.signInProcess.doLateBind(
                    this.authenticationService.loginUser(apiModel),
                    (view: ForgotPasswordComponent, data: any) => {

                        view.forgotPasswordEmailForm.reset();
                        view.forgotPasswordCodeForm.reset();
                        view.emailCodeForm.reset();

                        if (this.appService.data.cartTransaction.items.length === 0) {
                            view.router.navigate(['/user'], {replaceUrl: false});
                        } else {
                            view.router.navigate(['/user/checkout'], {replaceUrl: false});
                        }
                    }
                );

                break;
            }

            default: {
                this.componentView = ComponentForgotPasswordView.default;
                break;
            }
        }

    }

    onForgotPasswordEmailFormSubmit(): void {

        if (!this.forgotPasswordEmailForm.valid) {
            return;
        }

        const content = new ForgotPassword();
        content.email = this.forgotPasswordEmailForm.get('email').value;
        content.captcha = null;

        this.forgotPasswordEmailProcess.doLateBind(
            this.authenticationService.forgotPassword(content),
            (view: ForgotPasswordComponent, data: any) => {
                view.componentView = ComponentForgotPasswordView.forgotPasswordCode;
            }
        );

    }

    onForgotPasswordCodeFormSubmit(): void {

        if (!this.forgotPasswordCodeForm.valid || !this.emailCodeForm.valid) {
            return;
        }

        const content = new PasswordReset();
        content.code = this.emailCodeForm.get('digit1').value + this.emailCodeForm.get('digit2').value +
            this.emailCodeForm.get('digit3').value + this.emailCodeForm.get('digit4').value +
            this.emailCodeForm.get('digit5').value + this.emailCodeForm.get('digit6').value;

        content.email = this.forgotPasswordEmailForm.get('email').value;
        content.password = this.forgotPasswordCodeForm.get('password').value;
        content.confirmPassword = this.forgotPasswordCodeForm.get('confirmPassword').value;
        content.captcha = null;

        this.forgotPasswordCodeProcess.doLateBind(
            this.authenticationService.passwordReset(content),
            (view: ForgotPasswordComponent, data: any) => {
                view.componentView = ComponentForgotPasswordView.forgotPasswordDone;
            }
        );

    }

}
