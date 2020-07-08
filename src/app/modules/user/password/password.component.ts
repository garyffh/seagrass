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
import { matchingPasswords, passwordValidators } from '~/app/modules/shared/infrastructure/app-validators';
import { ChangePasswordModel } from '~/app/modules/user/services/user.models';

export enum ComponentUserPasswordView {
    default,
    changePasswordDone,
    changePasswordFail
}

@Component({
    selector: 'ns-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
    moduleId: module.id
})
export class PasswordComponent extends ViewBase {

    get changePasswordProcess(): ObservableProcessLateBind {

        if (this.fChangePasswordProcess === null) {
            this.fChangePasswordProcess = new ObservableProcessLateBind(this, 'Password change failed');
        }

        return this.fChangePasswordProcess;

    }

    private fChangePasswordProcess: ObservableProcessLateBind = null;

    constructor(public formBuilder: FormBuilder,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                public userService: UserService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.passwordForm = this.formBuilder.group({
            currentPassword: ['', Validators.compose(passwordValidators())],
            newPassword: ['', Validators.compose(passwordValidators())],
            confirmNewPassword: ['', Validators.compose([ Validators.required])]
        }, { validator: matchingPasswords('newPassword', 'confirmNewPassword')});

    }

    ComponentUserPasswordView = ComponentUserPasswordView;
    componentView: ComponentUserPasswordView = ComponentUserPasswordView.default;

    failMessage: string;

    passwordForm: FormGroup;

    showValidationError(fieldName: string): boolean {
        return (!this.passwordForm.get(fieldName).valid) &&  this.passwordForm.get(fieldName).touched;
    }

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentUserPasswordView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentUserPasswordView.changePasswordFail;
                this.passwordForm.reset();
                break;
            }

            default: {
                super.handleError(error, title);
            }

        }

    }

    onContinue() {
        switch (this.componentView) {

            case ComponentUserPasswordView.changePasswordFail: {
                this.componentView = ComponentUserPasswordView.default;
                break;
            }

            default: {
                this.router.navigate(['/user'], {replaceUrl: false});

                break;
            }

        }
    }

    onPasswordFormSubmit(): void {
        if (!this.passwordForm.valid) {
            return;
        }

        const content = new ChangePasswordModel();
        content.email = this.authenticationService.user.email;
        content.password = this.passwordForm.get('currentPassword').value;
        content.newPassword = this.passwordForm.get('newPassword').value;
        content.confirmNewPassword = this.passwordForm.get('confirmNewPassword').value;

        this.changePasswordProcess.doLateBind(
            this.userService.userChangePassword(content),
            (view: PasswordComponent, data: any) => {
                view.componentView = ComponentUserPasswordView.changePasswordDone;
            }
        );

    }

}
