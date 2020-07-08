import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { ObservableProcess } from '../../shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { DriverService } from '~/app/modules/driver/services/driver.service';

import { DriverDeliveries, TrnDeliveryRead } from '~/app/modules/driver/services/driver.models';
import { UtilityService } from '~/app/services/utility.service';
import { TrnOrderDriverAllocateDriverModel, TrnOrderUpdateModel } from '~/app/modules/user/services/user.models';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AppGlobals } from '~/app/modules/shared/infrastructure/app-initialise';

@Component({
    selector: 'ns-deliveries',
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.scss'],
    moduleId: module.id
})
export class DeliveriesComponent extends ViewBase implements OnDestroy {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting deliveries',
                this.driverService.driverDeliveriesFind(),
                (view: DeliveriesComponent, data: DriverDeliveries) => {
                    view.model = data;
                    view.listItems = new ObservableArray<TrnDeliveryRead>(data.deliveries);
                    view.changeDectorRef.detectChanges();
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    private driverStateSubscription: Subscription = null;
    private driverAllocateDriverSubscription: Subscription = null;

    private fGetEntityProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                public utilityService: UtilityService,
                public changeDectorRef: ChangeDetectorRef,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.driverStateSubscription = AppGlobals.instance.driverStateEvent
            .subscribe((message: TrnOrderUpdateModel) => {

                const componentOrders = this.listItems.filter((o) => o.trnOrderId === message.trnOrderId);
                if (componentOrders.length === 1) {
                    const componentOrder = componentOrders[0];
                    if (componentOrder) {
                        componentOrder.storeStatus = message.storeStatus;
                        this.changeDectorRef.detectChanges();
                    }

                }
            });

        this.driverAllocateDriverSubscription = AppGlobals.instance.driverAllocateDriverEvent
            .subscribe((message: TrnOrderDriverAllocateDriverModel) => {

                this.getEntityProcess.do();

            });

        this.getEntityProcess.do();

    }

    listItems: ObservableArray<TrnDeliveryRead> = new ObservableArray<TrnDeliveryRead>([]);

    model: DriverDeliveries = null;

    ngOnDestroy() {

        this.driverStateSubscription.unsubscribe();
        this.driverAllocateDriverSubscription.unsubscribe();
    }

    onDeliveryView(delivery: TrnDeliveryRead) {

        if (!delivery) {
            return;
        }

        this.router.navigate(['../delivery-detail', delivery.trnOrderId], {relativeTo: this.route});

    }

}
