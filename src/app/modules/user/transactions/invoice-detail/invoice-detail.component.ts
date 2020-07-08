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
import { InvoiceDetail, InvoiceDetailItem } from '~/app/modules/user/services/user.models';

@Component({
    selector: 'ns-invoice-detail',
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.scss'],
    moduleId: module.id
})
export class InvoiceDetailComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting invoice detail',
                this.userService.userInvoiceDetail(this.id),
                (view: InvoiceDetailComponent, data: InvoiceDetail) => {
                    view.model = data;
                    if (view.model) {
                        view.listItems = new ObservableArray<InvoiceDetailItem>(view.model.items);
                    } else {
                        view.listItems = new ObservableArray<InvoiceDetailItem>([]);
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
    model: InvoiceDetail = null;

    listItems: ObservableArray<InvoiceDetailItem> = new ObservableArray<InvoiceDetailItem>([]);

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
