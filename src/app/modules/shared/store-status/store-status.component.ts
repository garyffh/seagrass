import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { StoreStatusService } from '../../../services/store-status.service';
import { BusinessService } from '../../../services/business.service';
import { DeliveryMethodOpenStatus } from '../../../services/app.models';
import { StoreBannerService } from '~/app/services/store-banner.service';
import { Subscription } from 'rxjs';
import { AppService } from '~/app/services/app.service';

@Component({
    selector: 'ns-store-status',
    templateUrl: './store-status.component.html',
    styleUrls: ['./store-status.component.scss'],
    moduleId: module.id
})
export class StoreStatusComponent implements OnInit, OnDestroy {

    get showImage(): boolean {

        if (this.storeBannerService.bannerExists) {
            if ((!this.appService.specialsOpen) && this.appService.productsOpenedIndex === -1) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }

    }

    private storeBannerUpdateSubscription: Subscription = null;

    constructor(public appService: AppService,
                public storeBannerService: StoreBannerService,
                public storeStatusService: StoreStatusService,
                public businessService: BusinessService,
                public changeDetectorRef: ChangeDetectorRef) {

    }

    DeliveryMethodOpenStatus = DeliveryMethodOpenStatus;

    ngOnInit(): void {

        this.storeBannerUpdateSubscription = this.storeBannerService.storeBannerUpdate$
            .subscribe(
                (data) => {
                    this.changeDetectorRef.detectChanges();
                }
            );

    }

    ngOnDestroy(): void {

        if (this.storeBannerUpdateSubscription !== null) {
            this.storeBannerUpdateSubscription.unsubscribe();
        }

    }
}
