import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UtilityService } from '~/app/services/utility.service';
import { UserService } from '~/app/modules/user/services/user.service';
import { PaymentDetail, PaymentDetailItem } from '~/app/modules/user/services/user.models';

@Component({
    selector: 'ns-payment-detail',
    templateUrl: './payment-detail.component.html',
    styleUrls: ['./payment-detail.component.scss'],
    moduleId: module.id
})
export class PaymentDetailComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting payment detail',
                this.userService.userPaymentDetail(this.id),
                (view: PaymentDetailComponent, data: PaymentDetail) => {
                    view.model = data;
                    if (view.model) {
                        view.listItems = new ObservableArray<PaymentDetailItem>(view.model.items);
                    } else {
                        view.listItems = new ObservableArray<PaymentDetailItem>([]);
                    }
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    private routeIdKey = 'id';
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public userService: UserService,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    id: string;
    model: PaymentDetail = null;

    listItems: ObservableArray<PaymentDetailItem> = new ObservableArray<PaymentDetailItem>([]);

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.id = params[this.routeIdKey];
            this.getEntityProcess.do();

        });
    }

    onBack() {
        this.router.back();
    }

}
