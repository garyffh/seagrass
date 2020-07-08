import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { LoginModel } from '~/app/services/authentication.models';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { emailValidator, passwordValidators } from '~/app/modules/shared/infrastructure/app-validators';
import { BusinessService } from '~/app/services/business.service';

@Component({
  selector: 'ns-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  moduleId: module.id
})
export class DefaultComponent extends ViewBase {

    get signInProcess(): ObservableProcessLateBind {

        if (this.fSignInProcess === null) {
            this.fSignInProcess = new ObservableProcessLateBind(this, 'Sign In failed');
        }

        return this.fSignInProcess;

    }

    private fSignInProcess: ObservableProcessLateBind = null;

    constructor(public authenticationService: AuthenticationService,
                public appService: AppService,
                public businessService: BusinessService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);
    }

    signInForm = new FormGroup({
        email: new FormControl('', [Validators.required, emailValidator ]),
        password: new FormControl('', Validators.compose(passwordValidators()))
    });

    showValidationError(fieldName: string): boolean {
        return (!this.signInForm.get(fieldName).valid) &&  this.signInForm.get(fieldName).touched;
    }

    onSignIn(): void {

        if (!this.signInForm.valid) {
            return;
        }

        const apiModel = new LoginModel();
        apiModel.email = this.signInForm.get('email').value;
        apiModel.password = this.signInForm.get('password').value;

        this.signInProcess.doLateBind(
            this.authenticationService.loginUser(apiModel),
            (view: DefaultComponent, data: any) => {
                view.signInForm.reset();
                if (this.appService.data.cartTransaction.items.length === 0) {
                    view.router.navigate(['/user'], {replaceUrl: false});
                } else {
                    view.router.navigate(['/user/checkout'], {replaceUrl: false});
                }
            }
        );

    }

}
