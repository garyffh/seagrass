import { Component, OnInit, OnChanges, Input, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ErrorService } from '~/app/services/error.service';
import { ViewService } from '~/app/services/view.service';

import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AppService } from '~/app/services/app.service';
import { SitemRead } from '~/app/services/app.models';

@Component({
    selector: 'ns-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss'],
    moduleId: module.id
})
export class ProductCategoryComponent extends ViewBase implements OnChanges {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess === null) {
            this.entityLoaded = true;
            this.fGetEntityProcess = new ObservableProcess(this, 'Error reading menu',
                this.appService.sitemsRead(this.sysCategoryId),
                (view: ProductCategoryComponent, data: Array<SitemRead>) => {
                    view.products = data;
                }
            );
        }

        return this.fGetEntityProcess;
    }

    private fGetEntityProcess: ObservableProcess = null;

    constructor(public appService: AppService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);
    }

    @Input() sysCategoryId: string;
    @Input() index: number;
    @Input() openedIndex: number;

    entityLoaded = false;
    products: Array<SitemRead> = [];

    ngOnChanges(changes) {

        if (this.openedIndex < 0) {
            return;
        }

        if ((this.openedIndex === this.index) && (!this.entityLoaded)) {
            this.getEntityProcess.do();
        }

    }

}
