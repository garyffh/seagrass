import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { AppService } from '~/app/services/app.service';
import { BusinessService } from '~/app/services/business.service';
import { UtilityService } from '~/app/services/utility.service';
import { StoreStatusService } from '~/app/services/store-status.service';

@Component({
    moduleId: module.id,
    selector: 'ns-shopping-cart-widget',
    templateUrl: './shopping-cart-widget.component.html',
    styleUrls: ['./shopping-cart-widget.component.scss']
})
export class ShoppingCartWidgetComponent {

    constructor(public utilityService: UtilityService,
                public storeStatusService: StoreStatusService,
                private router: RouterExtensions,
                public businessService: BusinessService,
                public appService: AppService) {

    }

    @Input() showIcon = true;
    @Input() showMinOrder = true;

    goCheckout() {
        // this.router.navigate(['/cart'], {clearHistory: true})
        this.router.navigate(['/cart'], {replaceUrl: false});

    }

}
