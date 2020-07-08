import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { UtilityService } from '~/app/services/utility.service';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { DriverTransactionModel } from '../services/driver.models';

@Component({
    selector: 'ns-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    moduleId: module.id
})
export class TransactionsComponent extends ViewBase {

    get getTransactionsProcess(): ObservableProcess {

        if (this.fGetTransactionsProcess == null) {
            this.fGetTransactionsProcess = new ObservableProcess(this, 'Error reading transactions',
                this.driverService.driverTransactions(),
                (view: TransactionsComponent, data: Array<DriverTransactionModel>) => {
                    view.listItems = new ObservableArray<DriverTransactionModel>(data);
                },
                null
            );
        }

        return this.fGetTransactionsProcess;
    }

    private fGetTransactionsProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getTransactionsProcess.do();

    }

    listItems: ObservableArray<DriverTransactionModel> = null;

    onTransactionView(transaction: DriverTransactionModel) {

        if (!transaction) {
            return;
        }

        switch (transaction.documentType) {

            case 0: {
                this.router.navigate(['../../driver/invoice-detail', transaction.documentId], {relativeTo: this.route});

                break;
            }

            case 2: {
                this.router.navigate(['../../driver/payment-detail', transaction.documentId], {relativeTo: this.route});

                break;
            }

        }
    }

}
