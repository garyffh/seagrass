import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UtilityService } from '~/app/services/utility.service';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { DriverPayment } from '~/app/modules/driver/services/driver.models';

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
                this.driverService.driverPayment(this.id),
                (view: PaymentDetailComponent, data: DriverPayment) => {
                    view.model = data;

                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    private routeKey = 'id';
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);
    }

    id: string;
    model: DriverPayment = null;

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.id = params[this.routeKey];
            this.getEntityProcess.do();

        });
    }

    onBack() {
        this.router.back();
    }

}
