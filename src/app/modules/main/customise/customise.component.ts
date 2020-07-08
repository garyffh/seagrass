import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrnClientCustomersItem } from '~/app/services/app.models';
import { AppService } from '~/app/services/app.service';
import { Location } from '@angular/common';
import { RouterExtensions } from 'nativescript-angular';

@Component({
    selector: 'ns-customise',
    templateUrl: './customise.component.html',
    styleUrls: ['./customise.component.scss'],
    moduleId: module.id
})
export class CustomiseComponent implements OnDestroy {

    constructor(public location: Location,
                public router: RouterExtensions,
                public appService: AppService) {

    }

    ngOnDestroy(): void {

        this.appService.data.cartTransaction.afterCustomiseUpdate();
    }

    get trnClientCustomerData(): TrnClientCustomersItem {
        return this.appService.trialData;
    }

}
