import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UserService } from '~/app/modules/user/services/user.service';
import { UserPaymentMethod } from '~/app/modules/user/services/user.models';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { UtilityService } from '~/app/services/utility.service';

@Component({
    selector: 'ns-payment-methods',
    templateUrl: './payment-methods.component.html',
    styleUrls: ['./payment-methods.component.scss'],
    moduleId: module.id
})
export class PaymentMethodsComponent extends ViewBase {

    get getPaymentMethodsProcess(): ObservableProcess {

        if (this.fGetPaymentMethodsProcess == null) {
            this.fGetPaymentMethodsProcess = new ObservableProcess(this, 'Error reading credit cards',
                this.userService.userPaymentMethodsRead(),
                (view: PaymentMethodsComponent, data: Array<UserPaymentMethod>) => {

                    view.listItems = new ObservableArray<UserPaymentMethod>(data);

                },
                null
            );
        }

        return this.fGetPaymentMethodsProcess;
    }

    private fGetPaymentMethodsProcess: ObservableProcess = null;

    constructor(public userService: UserService,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getPaymentMethodsProcess.do();

    }

    listItems: ObservableArray<UserPaymentMethod> = null;

}
