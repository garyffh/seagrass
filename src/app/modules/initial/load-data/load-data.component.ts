import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { Page } from 'tns-core-modules/ui/page';

import { StorageService } from '~/app/services/storage.service';
import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';

import { AppService } from '~/app/services/app.service';
import { BusinessService, ServerBusinessSettings } from '~/app/services/business.service';
import { StoreStatusService } from '~/app/services/store-status.service';
import { NotificationService } from '~/app/services/notification.service';
import { ThemeService } from '~/app/services/theme.service';

@Component({
    selector: 'ns-load-data',
    templateUrl: './load-data.component.html',
    styleUrls: ['./load-data.component.scss'],
    moduleId: module.id
})
export class LoadDataComponent extends ViewBase {


    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {

            this.fGetEntityProcess = new ObservableProcess(this, 'error getting data',
                this.businessService.businessSettings(),
                (view: LoadDataComponent, data: ServerBusinessSettings) => {
                    view.themeService.applyAppTheme(data.theme);
                    view.storeStatusService.load(data.storeStatus, data.timeZone);
                    view.appService.loadCart();
                    view.appService.appDataLoaded = true;

                },
                (view: LoadDataComponent) => {
                    view.router.navigate(['/main'], {replaceUrl: true});
                });
        }

        return this.fGetEntityProcess;
    }

    private fGetEntityProcess: ObservableProcess = null;

    private systemSettingsKey = 'system-settings';

    constructor(viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute,
                public themeService: ThemeService,
                public ngZone: NgZone,
                public businessService: BusinessService,
                public storeStatusService: StoreStatusService,
                public appService: AppService,
                public notifications: NotificationService,
                private storageService: StorageService,
                private page: Page) {

        super(viewService, errorService, router, route);

        if (this.appService.appDataLoaded) {
            this.router.navigate(['/main'], {replaceUrl: true});
        } else {
            this.getEntityProcess.do();
        }

    }

    handleError(error: any, title?: string): void {

        super.handleError(error, title);

        this.router.navigate(['initial', 'server-down'], {replaceUrl: false});

    }

}
