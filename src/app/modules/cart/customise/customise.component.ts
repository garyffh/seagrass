import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppService } from '~/app/services/app.service';
import { TrnClientCustomersItem } from '~/app/services/app.models';
import { BusinessService } from '~/app/services/business.service';

@Component({
  selector: 'ns-customise',
  templateUrl: './customise.component.html',
  styleUrls: ['./customise.component.scss'],
  moduleId: module.id
})
export class CustomiseComponent implements OnDestroy {

    constructor(public businessService: BusinessService,
                public location: Location,
                public appService: AppService) {

    }

    ngOnDestroy(): void {

        this.appService.data.cartTransaction.afterCustomiseUpdate();

    }

    get trnClientCustomerData(): TrnClientCustomersItem {
        return this.appService.trialData;
    }

}
