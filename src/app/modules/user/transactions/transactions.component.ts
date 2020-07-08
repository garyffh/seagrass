import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UtilityService } from '~/app/services/utility.service';
import { UserService } from '~/app/modules/user/services/user.service';
import { UserTransactionModel } from '~/app/modules/user/services/user.models';

@Component({
    selector: 'ns-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    moduleId: module.id
})
export class TransactionsComponent extends ViewBase {

    get showPaymentFilterApplied(): boolean {
        return this.fShowPaymentFilterApplied;
    }

    set showPaymentFilterApplied(value: boolean) {
        this.fShowPaymentFilterApplied = value;
        this.onPaymentFilterChange(value);
    }

    get getTransactionsProcess(): ObservableProcess {

        if (this.fGetTransactionsProcess == null) {
            this.fGetTransactionsProcess = new ObservableProcess(this, 'Error reading transactions',
                this.userService.userTransactions(),
                (view: TransactionsComponent, data: Array<UserTransactionModel>) => {
                    view.model = data;
                    view.onPaymentFilterChange(view.showPaymentFilterApplied);

                },
                null
            );
        }

        return this.fGetTransactionsProcess;
    }

    private fGetTransactionsProcess: ObservableProcess = null;

    constructor(public userService: UserService,
                public utilityService: UtilityService,
                public ngZone: NgZone,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getTransactionsProcess.do();

    }

    fShowPaymentFilterApplied = false;
    listItems: ObservableArray<UserTransactionModel> = new ObservableArray<UserTransactionModel>([]);
    model: Array<UserTransactionModel> = [];

    onPaymentFilterChange(checked: boolean) {

        if (checked) {
            this.listItems = new ObservableArray<UserTransactionModel>(this.model);
        } else {
            this.listItems = new ObservableArray<UserTransactionModel>(
                this.model.filter((e: UserTransactionModel) => {
                    return e.documentType !== 2;
                }));

        }

    }

    onTransactionView(transaction: UserTransactionModel) {

        if (!transaction) {
            return;
        }

        switch (transaction.documentType) {

            case 0: {
                this.ngZone.run(() => this.router.navigate(['../../user/invoice-detail', transaction.documentId]));
                break;
            }

            case 1: {
                this.ngZone.run(() => this.router.navigate(['../../user/credit-detail', transaction.documentId]));
                break;
            }

            case 2: {
                this.ngZone.run(() => this.router.navigate(['../../user/payment-detail', transaction.documentId]));
                break;
            }

        }
    }

}
