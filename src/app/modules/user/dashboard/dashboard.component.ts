import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { Switch } from 'tns-core-modules/ui/switch';

import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';

import { DeliveryMethodType } from '~/app/services/app.models';
import { UserDashboard, UserNotificationUpdate } from '~/app/modules/user/services/user.models';
import { UserService } from '~/app/modules/user/services/user.service';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';

@Component({
    selector: 'ns-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    moduleId: module.id
})
export class DashboardComponent extends ViewBase {

    get userNotificationUpdateProcess(): ObservableProcessLateBind {

        if (this.fUserNotificationUpdateProcess === null) {
            this.fUserNotificationUpdateProcess = new ObservableProcessLateBind(this, 'Error updating notification');
        }

        return this.fUserNotificationUpdateProcess;
    }

    get getDashboardProcess(): ObservableProcess {

        if (this.fGetDashboardProcess == null) {
            this.fGetDashboardProcess = new ObservableProcess(this, 'Error getting dashboard',
                this.userService.userDashboard(),
                (view: DashboardComponent, data: UserDashboard) => {
                    view.model = new UserDashboard(data);
                },
                null);
        }

        return this.fGetDashboardProcess;
    }

    private fGetDashboardProcess: ObservableProcess = null;
    private fUserNotificationUpdateProcess: ObservableProcessLateBind = null;

    constructor(public userService: UserService,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {
        super(viewService, errorService, router, route);

        this.getDashboardProcess.do();

    }

    DeliveryMethodType = DeliveryMethodType;

    model: UserDashboard = null;

    onOrdersTap(): void {
        this.router.navigate(['user/orders']);
    }

    onOrderTap(): void {
        this.router.navigate(['user/order-detail', this.model.order.trnOrderId]);
    }

    onShoppingCartTap(): void {
        if (this.appService.data.cartTransaction.items.length === 0) {
            this.router.navigate(['/main']);
        } else {
            this.router.navigate(['cart']);
        }
    }

    onAccountTap(): void {
        this.router.navigate(['user/transactions']);
    }

    onAddressTap(): void {
        this.router.navigate(['user/addresses']);
    }

    onSpecialDealsChange(event) {

        if (!this.model) {
            return;
        }

        const specialDealsSwitch = event.object as Switch;

        if (specialDealsSwitch.checked !== this.model.specialDeals) {
            const apiModel: UserNotificationUpdate = new UserNotificationUpdate();
            apiModel.typeId = 0;
            apiModel.enabled = specialDealsSwitch.checked;

            this.userNotificationUpdateProcess.doLateBind(
                this.userService.userNotificationUpdate(apiModel),
                (view: DashboardComponent, data: UserNotificationUpdate) => {
                    if (data.typeId === 0) {
                        view.model.specialDeals = data.enabled;
                    }
                }
            );
        }

    }
}
