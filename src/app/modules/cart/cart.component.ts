import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { BusinessService } from '~/app/services/business.service';

@Component({
    selector: 'ns-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    moduleId: module.id
})
export class CartComponent implements OnInit {

    constructor(public businessService: BusinessService,
                private page: Page) {
    }

    ngOnInit() {
        this.page.actionBarHidden = false;
    }

}
