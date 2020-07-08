import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { UtilityService } from '~/app/services/utility.service';
import { BusinessService } from '~/app/services/business.service';
import { AppService } from '~/app/services/app.service';
import { TranClientCustomerQtyChange, TrnCartDisplayItem } from '~/app/services/app.models';

@Component({
    selector: 'ns-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
    moduleId: module.id
})
export class ShoppingCartComponent {

    constructor(public utilityService: UtilityService,
                public router: RouterExtensions,
                public route: ActivatedRoute,
                public businessService: BusinessService,
                public appService: AppService) {

    }

    @Input() showImage = false;
    @Input() customiseEnabled = true;

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

        if (!this.customiseEnabled) {
            return;
        }

        this.appService.trialData = item.transactionItem;
        this.router.navigate(['customise'], {relativeTo: this.route});

    }

}
