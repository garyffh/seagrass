import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { BusinessService } from '~/app/services/business.service';
import { UtilityService } from '~/app/services/utility.service';
import { RouterExtensions } from 'nativescript-angular';
import { AppService } from '~/app/services/app.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'ns-user-tab',
    templateUrl: './user-tab.component.html',
    styleUrls: ['./user-tab.component.scss'],
    moduleId: module.id
})
export class UserTabComponent implements OnInit {

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
                        this.appService.userTabSelectedIndex = 0;
                    } else if (e.urlAfterRedirects === this.route2) {
                        this.appService.userTabSelectedIndex = 1;
                    } else if (e.urlAfterRedirects === this.route3) {
                        this.appService.userTabSelectedIndex = 2;
                    } else if (e.urlAfterRedirects === this.route4) {
                        this.appService.userTabSelectedIndex = 3;
                    } else if (e.urlAfterRedirects === this.route5) {
                        this.appService.userTabSelectedIndex = 4;
                    } else {
                        this.appService.userTabSelectedIndex = -1;
                    }

                }
            });

    }

    route1 = '/user/user-card';
    route2 = '/user';
    route3 = '/main';
    route4 = '/cart';
    route5 = '/trading-hours';

    ngOnInit() {
        this.page.actionBarHidden = false;
    }

    onSelectTab(index: number): void {

        if (index !== this.appService.userTabSelectedIndex) {

            this.appService.userTabSelectedIndex = index;

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

                case 3: {
                    this.routerExtensions.navigate([this.route4], {replaceUrl: false});
                    break;
                }

                case 4: {
                    this.routerExtensions.navigate([this.route5], {replaceUrl: false});
                    break;
                }

            }

        }
    }

}
