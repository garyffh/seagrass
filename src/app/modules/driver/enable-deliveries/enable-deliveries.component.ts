import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { DriverDisableDeliveries, DriverEnableDeliveries } from '~/app/modules/driver/services/driver.models';

@Component({
  selector: 'ns-enable-deliveries',
  templateUrl: './enable-deliveries.component.html',
  styleUrls: ['./enable-deliveries.component.scss'],
  moduleId: module.id
})
export class EnableDeliveriesComponent extends ViewBase {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'Error getting data. Have you added your car?',
                this.driverService.driverEnableDeliveriesFind(),
                (view: EnableDeliveriesComponent, data: DriverEnableDeliveries) => {
                    if (data.available) {
                        view.router.navigate(['/driver'], {replaceUrl: false});
                    } else {
                        view.model = data;
                        view.form.get('ackConditions').setValue(view.model.ackConditions);
                    }

                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcess {

        if (this.fUpdateProcess == null) {
            this.fUpdateProcess = new ObservableProcess(this, 'Enabling deliveries failed',
                this.driverService.driverEnableDeliveries(),
                (view: EnableDeliveriesComponent, data: any) => {
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

        this.form = new FormGroup({
                ackConditions: new FormControl(null, [Validators.required, Validators.requiredTrue])
            }
        );

        this.getEntityProcess.do();

    }

    form: FormGroup;

    model: DriverEnableDeliveries = null;

    onSubmit() {

        this.updateProcess.do();

    }

}
