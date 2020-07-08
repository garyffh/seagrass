import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ObservableProcess } from '../../shared/infrastructure/observable-process';
import { UserService } from '../services/user.service';
import { ErrorService } from '../../../services/error.service';

import {
    TrnOrderRead,
    TrnOrderUpdateModel,
    TrnOrderUserAllocateDriverModel,
    UserPaymentMethod
} from '../services/user.models';

import { UtilityService } from '~/app/services/utility.service';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { ViewService } from '~/app/services/view.service';
import { RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { MessageService } from '~/app/services/message.service';
import { AppGlobals } from '~/app/modules/shared/infrastructure/app-initialise';

@Component({
    selector: 'ns-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    moduleId: module.id
})
export class OrdersComponent extends ViewBase implements OnDestroy {

    get getOrdersProcess(): ObservableProcess {

        if (this.fGetOrdersProcess == null) {
            this.fGetOrdersProcess = new ObservableProcess(this, 'Error getting orders',
                this.userService.userOrders(),
                (view: OrdersComponent, data: Array<TrnOrderRead>) => {
                    view.listItems = new ObservableArray<TrnOrderRead>(data);
                },
                null
            );
        }

        return this.fGetOrdersProcess;
    }

    private fGetOrdersProcess: ObservableProcess = null;
    private userStateSubscription: Subscription = null;
    private userAllocateDriverSubscription: Subscription = null;

    constructor(public userService: UserService,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                public utilityService: UtilityService,
                private messageService: MessageService,
                public changeDectorRef: ChangeDetectorRef,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.userStateSubscription = AppGlobals.instance.userStateEvent
            .subscribe((message: TrnOrderUpdateModel) => {

                const componentOrders = this.listItems.filter((o) => o.trnOrderId === message.trnOrderId);
                if (componentOrders.length === 1) {
                    const componentOrder = componentOrders[0];
                    if (componentOrder) {
                         componentOrder.deliveryMethodStatus = message.deliveryMethodStatus;
                         this.changeDectorRef.detectChanges();
                    }

                }

            });

        this.userAllocateDriverSubscription = AppGlobals.instance.userAllocateDriverEvent
            .subscribe((message: TrnOrderUserAllocateDriverModel) => {
                const componentOrders = this.listItems.filter((o) => o.trnOrderId === message.trnOrderId);
                if (componentOrders.length === 1) {
                    const componentOrder = componentOrders[0];
                    if (componentOrder) {
                        componentOrder.deliveryMethodStatus = message.deliveryMethodStatus;
                        this.changeDectorRef.detectChanges();
                    }

                }
            });

        this.getOrdersProcess.do();
    }

    listItems: ObservableArray<TrnOrderRead> = null;

    ngOnDestroy() {

        this.userStateSubscription.unsubscribe();
        this.userAllocateDriverSubscription.unsubscribe();
    }

    onOrderView(order: TrnOrderRead) {

        if (!order) {
            return;
        }

        this.router.navigate(['../order-detail', order.trnOrderId], {relativeTo: this.route});
    }

}
