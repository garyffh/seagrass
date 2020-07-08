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
    selector: 'ns-drive-confirm',
    templateUrl: './drive-confirm.component.html',
    styleUrls: ['./drive-confirm.component.scss'],
    moduleId: module.id
})
export class DriveConfirmComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting delivery',
                this.driverService.driverDeliveryFind(this.id),
                (view: DriveConfirmComponent, data: TrnDelivery) => {
                    view.model = data;
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcess {

        if (this.fUpdateProcess === null) {
            this.fUpdateProcess = new ObservableProcessLateBind(this, 'Error confirming pickup');
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

            this.driverService.drive(this.model.trnOrderId),
            (view: DriveConfirmComponent, data: TrnDeliveryAction) => {

                view.router.navigate(['driver/delivery-detail', data.trnOrderId]);

            });

    }

}
