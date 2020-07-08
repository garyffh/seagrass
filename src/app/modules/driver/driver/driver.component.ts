import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { BusinessService } from '~/app/services/business.service';
import { UtilityService } from '~/app/services/utility.service';
import { RouterExtensions } from 'nativescript-angular';
import { AppService } from '~/app/services/app.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'ns-driver',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.scss'],
    moduleId: module.id
})
export class DriverComponent implements OnInit {

    constructor(public businessService: BusinessService,
                public utilityService: UtilityService,
                public appService: AppService,
                public router: Router,
                public routerExtensions: RouterExtensions,
                private page: Page) {

        this.router.events
            .subscribe((e) => {

                if (e instanceof NavigationEnd) {

                    if (e.urlAfterRedirects === this.route1) {
                        this.appService.driverTabSelectedIndex = 0;
                    } else if (e.urlAfterRedirects === this.route2) {
                        this.appService.driverTabSelectedIndex = 1;
                    } else if (e.urlAfterRedirects === this.route3) {
                        this.appService.driverTabSelectedIndex = 2;
                    } else {
                        this.appService.driverTabSelectedIndex = -1;
                    }

                }
            });

    }

    route1 = '/driver/transactions';
    route2 = '/driver';
    route3 = '/driver/cars';

    ngOnInit() {
        this.page.actionBarHidden = false;
    }

    onSelectTab(index: number): void {

        if (index !== this.appService.driverTabSelectedIndex) {

            this.appService.driverTabSelectedIndex = index;

            switch (index) {

                case 0: {
                    this.routerExtensions.navigate([this.route1], {replaceUrl: false});
                    break;
                }

                case 1: {
                    this.routerExtensions.navigate([this.route2], {replaceUrl: false});
                    break;
                }

                case 2: {
                    this.routerExtensions.navigate([this.route3], {replaceUrl: false});
                    break;
                }

            }

        }
    }

}
