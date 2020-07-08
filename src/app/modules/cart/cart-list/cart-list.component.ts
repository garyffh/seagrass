import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular';

import { AuthenticationService } from '~/app/services/authentication.service';
import { BusinessService } from '~/app/services/business.service';
import { AppService } from '~/app/services/app.service';

import { TranClientCustomerQtyChange, TrnCartDisplayItem } from '~/app/services/app.models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ns-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrls: ['./cart-list.component.scss'],
    moduleId: module.id
})
export class CartListComponent {

    constructor(public router: RouterExtensions,
                public route: ActivatedRoute,
                public changeDetectorRef: ChangeDetectorRef,
                public authService: AuthenticationService,
                public businessService: BusinessService,
                public appService: AppService) {

    }

    increment(item: TrnCartDisplayItem) {

        const change: TranClientCustomerQtyChange = new TranClientCustomerQtyChange(item.transactionItem.itemNumber,
            item.description, 1);

        this.appService.data.cartTransaction.qtyTranChange(change);
    }

    decrement(item: TrnCartDisplayItem) {

        const change: TranClientCustomerQtyChange = new TranClientCustomerQtyChange(item.transactionItem.itemNumber,
            item.description, -1);

        this.appService.data.cartTransaction.qtyTranChange(change);

    }

    customise(item: TrnCartDisplayItem) {

        this.appService.trialData = item.transactionItem;
        this.router.navigate(['../customise']);

    }

    clearCart(): void {
        this.appService.data.cartTransaction.clearCart();
    }

}
