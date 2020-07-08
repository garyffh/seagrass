import { Component, OnInit } from '@angular/core';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { TrnDelivery, TrnDeliveryAction } from '~/app/modules/driver/services/driver.models';

@Component({
    selector: 'ns-deliver-confirm',
    templateUrl: './deliver-confirm.component.html',
    styleUrls: ['./deliver-confirm.component.scss'],
    moduleId: module.id
})
export class DeliverConfirmComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting delivery',
                this.driverService.driverDeliveryFind(this.id),
                (view: DeliverConfirmComponent, data: TrnDelivery) => {
                    view.model = data;
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcess {

        if (this.fUpdateProcess === null) {
            this.fUpdateProcess = new ObservableProcessLateBind(this, 'Error confirming delivery');
        }

        return this.fUpdateProcess;

    }

    private routeIdKey = 'id';
    private fUpdateProcess: ObservableProcessLateBind = null;
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    id: string;
    model: TrnDelivery = null;

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.id = params[this.routeIdKey];
            this.getEntityProcess.do();

        });
    }

    onCancel(): void {
        this.router.back();
    }

    onSubmit() {

        this.updateProcess.doLateBind(
            this.driverService.deliver(this.model.trnOrderId),
            (view: DeliverConfirmComponent, data: TrnDeliveryAction) => {

                view.router.navigate([`/driver`], {replaceUrl: false});

            });

    }

}
