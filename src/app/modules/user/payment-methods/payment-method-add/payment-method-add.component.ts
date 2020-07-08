import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UserService } from '~/app/modules/user/services/user.service';
import { UserPaymentMethodAdd } from '~/app/modules/user/services/user.models';
import { Card, Stripe, Token } from 'nativescript-stripe';
import { BusinessService } from '~/app/services/business.service';

export enum ComponentPaymentMethodAddView {
    default,
    paymentMethodAddDone,
    paymentMethodAddFail
}

@Component({
    selector: 'ns-payment-method-add',
    templateUrl: './payment-method-add.component.html',
    styleUrls: ['./payment-method-add.component.scss'],
    moduleId: module.id
})
export class PaymentMethodAddComponent extends ViewBase {

    get paymentMethodAddProcess(): ObservableProcessLateBind {

        if (this.fPaymentMethodAddProcess === null) {
            this.fPaymentMethodAddProcess = new ObservableProcessLateBind(this, 'Adding credit card failed');
        }

        return this.fPaymentMethodAddProcess;

    }

    private fPaymentMethodAddProcess: ObservableProcessLateBind = null;

    constructor(public formBuilder: FormBuilder,
                public businessService: BusinessService,
                public userService: UserService,
                public changeDetectionRef: ChangeDetectorRef,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.stripe = new Stripe(businessService.business.paymentKey);

    }

    ComponentPaymentMethodAddView = ComponentPaymentMethodAddView;
    componentView: ComponentPaymentMethodAddView = ComponentPaymentMethodAddView.default;

    failMessage: string;

    inProcess = false;

    stripe: Stripe;
    showCardError = false;
    cardErrorMessage = 'card details required';

    paymentMethodAddForm: FormGroup = new FormGroup({});

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentPaymentMethodAddView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentPaymentMethodAddView.paymentMethodAddFail;
                this.paymentMethodAddForm.reset();

                break;
            }

            default: {
                super.handleError(error, title);
            }

        }

        this.paymentMethodAddForm.reset();

        this.changeDetectionRef.detectChanges();

    }

    onContinue() {
        switch (this.componentView) {

            case ComponentPaymentMethodAddView.paymentMethodAddFail: {
                this.componentView = ComponentPaymentMethodAddView.default;

                break;
            }

            default: {

                this.onBack();

                break;
            }

        }
    }

    onBack() {

        this.router.navigate(['user/payment-methods'], {replaceUrl: false});

    }

    onSubmit(): void {

        if (!this.paymentMethodAddForm.valid) {
            return;
        }

        this.inProcess = true;
        this.viewService.addWorkingProcess();

        this.stripe.createToken(new Card(
            this.paymentMethodAddForm.get('cardNumber').value,
            this.paymentMethodAddForm.get('cardExpiryMonth').value,
            this.paymentMethodAddForm.get('cardExpiryYear').value,
            this.paymentMethodAddForm.get('cardCVC').value), (error: Error, result: Token) => {

            if (!error) {

                if (result.id) {

                    if (result.card) {

                        const apiModel = new UserPaymentMethodAdd();
                        apiModel.token = result.id;
                        apiModel.status = this.paymentMethodAddForm.get('name').value;
                        apiModel.responseMessage = null;
                        apiModel.hash = null;
                        apiModel.cardId = null;
                        apiModel.ivrCardId = null;
                        apiModel.cardKey = null;
                        apiModel.custom1 = null;
                        apiModel.custom2 = null;
                        apiModel.custom3 = null;
                        apiModel.customHash = null;

                        this.paymentMethodAddForm.reset();

                        this.paymentMethodAddProcess.doLateBind(
                            this.userService.userPaymentMethodAdd(apiModel),
                            (view: PaymentMethodAddComponent, data: any) => {
                                view.componentView = ComponentPaymentMethodAddView.paymentMethodAddDone;
                                view.changeDetectionRef.detectChanges();
                            }
                        );

                    } else {
                        this.handleError(Error('UNKNOWN CARD ERROR'));
                    }

                } else {

                    this.handleError(Error('UNKNOWN CARD ERROR'));
                }

                this.cardErrorMessage = '';
                this.showCardError = false;
                this.inProcess = false;

            } else {
                this.handleError(Error(error.message));
            }

            this.inProcess = false;
            this.viewService.removeWorkingProcess();
        });

    }

}
