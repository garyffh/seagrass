import { Component, OnInit } from '@angular/core';
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
export class CustomiseComponent {

    constructor(public location: Location,
                public router: RouterExtensions,
                public appService: AppService) {
    }

    get trnClientCustomerData(): TrnClientCustomersItem {
        return this.appService.trialData;
    }

    back(): void {
        this.router.navigate(['../']);
    }

}
