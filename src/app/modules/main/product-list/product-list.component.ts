import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BusinessService } from '~/app/services/business.service';
import { AppService } from '~/app/services/app.service';

@Component({
    selector: 'ns-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    moduleId: module.id
})
export class ProductListComponent {

    constructor(public appService: AppService,
                public businessService: BusinessService,
                public ref: ChangeDetectorRef) {
    }

    onOpenCategory(index: number) {
        this.appService.productsOpenedIndex = index;
        this.ref.detectChanges();

    }

}
