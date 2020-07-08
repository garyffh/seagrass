import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UserService } from '~/app/modules/user/services/user.service';
import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { UserPaymentMethod } from '~/app/modules/user/services/user.models';

export enum ComponentPaymentMethodDeleteView {
    default,
    done,
    fail
}

@Component({
    selector: 'ns-payment-method-delete',
    templateUrl: './payment-method-delete.component.html',
    styleUrls: ['./payment-method-delete.component.scss'],
    moduleId: module.id
})
export class PaymentMethodDeleteComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting card',
                this.userService.userPaymentMethodFind(this.id),
                (view: PaymentMethodDeleteComponent, data: UserPaymentMethod) => {
                    view.model = data;
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcessLateBind {

        if (this.fUpdateProcess === null) {
            this.fUpdateProcess = new ObservableProcessLateBind(this, 'Removing card failed');
        }

        return this.fUpdateProcess;

    }

    private routeIdKey = 'id';
    private fUpdateProcess: ObservableProcessLateBind = null;
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public userService: UserService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    ComponentPaymentMethodDeleteView = ComponentPaymentMethodDeleteView;
    componentView: ComponentPaymentMethodDeleteView = ComponentPaymentMethodDeleteView.default;

    failMessage: string;

    id: string;
    model: UserPaymentMethod = null;

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.id = params[this.routeIdKey];
            this.getEntityProcess.do();

        });

    }

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentPaymentMethodDeleteView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentPaymentMethodDeleteView.fail;

                break;
            }

            default: {
                super.handleError(error, title);
                break;
            }

        }

    }

    onBack() {

        this.router.navigate(['user/payment-methods'], {replaceUrl: false});

    }

    onContinue() {

        switch (this.componentView) {

            case ComponentPaymentMethodDeleteView.done: {
                this.onBack();
                break;
            }

            default: {
                this.componentView = ComponentPaymentMethodDeleteView.default;
                break;
            }
        }

    }

    onSubmit(): void {

        this.updateProcess.doLateBind(
            this.userService.userPaymentMethodDelete(this.model),
            (view: PaymentMethodDeleteComponent, data: any) => {
                view.componentView = ComponentPaymentMethodDeleteView.done;
            }
        );

    }

}
