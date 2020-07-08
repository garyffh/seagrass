import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { DriverDisableDeliveries } from '~/app/modules/driver/services/driver.models';

@Component({
    selector: 'ns-disable-deliveries',
    templateUrl: './disable-deliveries.component.html',
    styleUrls: ['./disable-deliveries.component.scss'],
    moduleId: module.id
})
export class DisableDeliveriesComponent extends ViewBase {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'Error getting data',
                this.driverService.driverDisableDeliveriesFind(),
                (view: DisableDeliveriesComponent, data: DriverDisableDeliveries) => {
                    if (!data.available) {
                        view.router.navigate(['/driver'], {replaceUrl: false});
                    } else {
                        view.model = data;
                    }

                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcess {

        if (this.fUpdateProcess == null) {
            this.fUpdateProcess = new ObservableProcess(this, 'Error disabling deliveries',
                this.driverService.driverDisableDeliveries(),
                (view: DisableDeliveriesComponent, data: any) => {
                    view.router.navigate(['/driver'], {replaceUrl: false});
                }
            );
        }

        return this.fUpdateProcess;

    }

    private fUpdateProcess: ObservableProcess = null;
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    model: DriverDisableDeliveries = null;

    onSubmit() {

        this.updateProcess.do();

    }

}
