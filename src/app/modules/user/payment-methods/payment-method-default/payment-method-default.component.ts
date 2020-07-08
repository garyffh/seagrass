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

export enum ComponentPaymentMethodDefaultView {
    default,
    done,
    fail
}

@Component({
    selector: 'ns-payment-method-default',
    templateUrl: './payment-method-default.component.html',
    styleUrls: ['./payment-method-default.component.scss'],
    moduleId: module.id
})
export class PaymentMethodDefaultComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting payment method',
                this.userService.userPaymentMethodFind(this.id),
                (view: PaymentMethodDefaultComponent, data: UserPaymentMethod) => {
                    view.model = data;
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcessLateBind {

        if (this.fUpdateProcess === null) {
            this.fUpdateProcess = new ObservableProcessLateBind(this, 'Setting default failed');
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

    ComponentPaymentMethodDefaultView = ComponentPaymentMethodDefaultView;
    componentView: ComponentPaymentMethodDefaultView = ComponentPaymentMethodDefaultView.default;

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

            case ComponentPaymentMethodDefaultView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentPaymentMethodDefaultView.fail;

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

            case ComponentPaymentMethodDefaultView.done: {
                this.router.navigate(['user'], {replaceUrl: false});
                break;
            }

            default: {
                this.componentView = ComponentPaymentMethodDefaultView.default;
                break;
            }
        }

    }

    onSubmit(): void {

        this.updateProcess.doLateBind(
            this.userService.userPaymentMethodDefault(this.model),
            (view: PaymentMethodDefaultComponent, data: any) => {
                view.componentView = ComponentPaymentMethodDefaultView.done;
            }
        );

    }

}
