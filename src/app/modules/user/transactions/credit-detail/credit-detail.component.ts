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
import { CreditDetail, CreditDetailItem, InvoiceDetailItem } from '~/app/modules/user/services/user.models';

@Component({
    selector: 'ns-credit-detail',
    templateUrl: './credit-detail.component.html',
    styleUrls: ['./credit-detail.component.scss'],
    moduleId: module.id
})
export class CreditDetailComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting credit',
                this.userService.userCreditDetail(this.id),
                (view: CreditDetailComponent, data: CreditDetail) => {
                    view.model = data;
                    if (view.model) {
                        view.listItems = new ObservableArray<CreditDetailItem>(view.model.items);
                    } else {
                        view.listItems = new ObservableArray<CreditDetailItem>([]);
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
    model: CreditDetail = null;

    listItems: ObservableArray<CreditDetailItem> = new ObservableArray<CreditDetailItem>([]);

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
