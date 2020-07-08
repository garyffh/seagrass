import { Component, EventEmitter, NgZone, OnInit, Output, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

import { BusinessService } from '~/app/services/business.service';
import { AuthenticationService } from '~/app/services/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { AppService } from '~/app/services/app.service';

@Component({
    selector: 'ns-action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss'],
    moduleId: module.id
})
export class ActionBarComponent {

    get navBtnVisible(): boolean {
        return this.routerExtensions.canGoBack();
    }

    get showDriverMenu(): boolean {
        return this.authenticationService.userIsAuthenicated && this.authenticationService.user.driver;
    }

    constructor(public businessService: BusinessService,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                public routerExtensions: RouterExtensions) {

    }

    menuOpen = false;

    onBack(): void {
        this.routerExtensions.back();
    }

    onMenuToggle(): void {

        this.appService.actionBarMenuOpen = !this.appService.actionBarMenuOpen;

    }

    // <!--                ios.systemIcon="9"-->
    // <!--                android.systemIcon="ic_menu_view"-->

}
