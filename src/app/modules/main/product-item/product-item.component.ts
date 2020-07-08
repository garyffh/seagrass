import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, RouterExtensions } from 'nativescript-angular';

import { ModalDialogService } from 'nativescript-angular/modal-dialog';
import { OpenStatus, SitemRead, TrnClientCustomersItem } from '~/app/services/app.models';
import { StoreStatusService } from '~/app/services/store-status.service';
import { AppService } from '~/app/services/app.service';
import { BusinessService } from '~/app/services/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCustomiseDialogComponent } from '~/app/modules/shared/product-customise-dialog/product-customise-dialog.component';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';

@Component({
    selector: 'ns-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.scss'],
    moduleId: module.id
})
export class ProductItemComponent {

    constructor(public storeStatusService: StoreStatusService,
                public appService: AppService,
                public businessService: BusinessService,
                public router: RouterExtensions,
                public route: ActivatedRoute,
                private modalService: ModalDialogService,
                private viewContainerRef: ViewContainerRef) {
    }

    @Input() model: SitemRead;

    customise() {

        if (this.storeStatusService.storeStatus.openStatus === OpenStatus.open) {

            const item: TrnClientCustomersItem = this.appService.data.cartTransaction.addToCart(this.model);

            if (!item) {
                return;
            }

            this.appService.trialData = item;
            this.router.navigate(['main', 'customise']);

            // const options: ModalDialogOptions = {
            //     context: item,
            //     fullscreen: false,
            //     viewContainerRef: this.viewContainerRef
            // };
            // return this.modalService.showModal(ProductCustomiseDialogComponent, options)
            //     .then((data) => {
            //         this.appService.data.cartTransaction.afterCustomiseUpdate();
            //
            //     });

        } else {

            const options: ModalDialogOptions = {
                context: this.businessService.getOpenStatusMessage(this.storeStatusService.storeStatus.openStatus),
                fullscreen: false,
                viewContainerRef: this.viewContainerRef
            };

            return this.modalService.showModal(MessageDialogComponent, options);

        }
    }

    viewImage() {
        this.appService.pagePosition = 0;
        this.router.navigate(['main/product-image', this.model.sysSitemId]);

    }

}
