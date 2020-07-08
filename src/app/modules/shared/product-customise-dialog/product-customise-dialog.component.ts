import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TrnClientCustomersItem } from '~/app/services/app.models';

@Component({
    selector: 'ns-product-customise-dialog',
    templateUrl: './product-customise-dialog.component.html',
    styleUrls: ['./product-customise-dialog.component.scss'],
    moduleId: module.id
})
export class ProductCustomiseDialogComponent {

    get trnClientCustomerData(): TrnClientCustomersItem {
        return this.params.context as TrnClientCustomersItem;
    }

    constructor(private params: ModalDialogParams,
                public ref: ChangeDetectorRef) {
    }
    title: string = 'Title';

    onClose(event: string) {
        this.params.closeCallback(event);
    }

}
