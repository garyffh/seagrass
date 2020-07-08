import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { Page } from 'tns-core-modules/ui/page';
import { isAndroid } from 'tns-core-modules/platform';
import { AndroidActivityBackPressedEventData, AndroidApplication, android } from 'tns-core-modules/application';
import { Frame } from 'tns-core-modules/ui/frame';

import { Toasty, ToastDuration, ToastPosition } from 'nativescript-toasty';

import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { StorageService } from '~/app/services/storage.service';
import { MessageService } from '~/app/services/message.service';
import { ThemeService } from '~/app/services/theme.service';
import { Subscription } from 'rxjs';
import { AppFirebaseToken } from '~/app/modules/shared/infrastructure/app-initialise';

export enum DisplayMenu {none, user, driver }

@Component({
    selector: 'ns-app',
    templateUrl: './app.component.html',
    moduleId: module.id
})
export class AppComponent implements OnInit, OnDestroy {

    get showDriverMenu(): boolean {
        return this.authenticationService.userIsAuthenicated && this.authenticationService.user.driver;
    }

    private fDeviceTokenKey: string = 'device-token';
    private firebaseTokenSubscription: Subscription = null;

    constructor(public themeService: ThemeService,
                public page: Page,
                public messageService: MessageService,
                public authenticationService: AuthenticationService,
                public storageService: StorageService,
                public appService: AppService,
                public router: Router,
                public routerExtension: RouterExtensions,
                private route: ActivatedRoute) {

        this.firebaseTokenSubscription = AppFirebaseToken.instance.firebaseTokenEvent
            .subscribe((token: string) => {
                    this.storageService.setObject(this.fDeviceTokenKey, token);
                }
            );

        this.themeService.applySavedAppTheme();

        this.router.events
            .subscribe((e) => {

                if (e instanceof NavigationEnd) {
                    if (e.urlAfterRedirects.substring(0, 5) === '/user') {
                        this.displayMenu = DisplayMenu.user;
                    } else if (e.urlAfterRedirects.substring(0, 7) === '/driver') {
                        this.displayMenu = DisplayMenu.driver;
                    } else {
                        this.displayMenu = DisplayMenu.none;
                    }
                }
            });

    }

    DisplayMenu = DisplayMenu;
    displayMenu: DisplayMenu = DisplayMenu.none;

    exitTries = 0;

    ngOnInit(): void {

        this.page.actionBarHidden = true;

        if (isAndroid) {
            android.on(AndroidApplication.activityBackPressedEvent,
                (data: AndroidActivityBackPressedEventData) => {

                    if (this.routerExtension) {
                        if (this.routerExtension.frameService.getFrame() instanceof Frame) {
                            if (!this.routerExtension.canGoBackToPreviousPage()) {

                                data.cancel = (this.exitTries++ > 0) ? false : true;

                                if (data.cancel) {
                                    new Toasty({ text: 'Press again to exit' })
                                        .setToastDuration(ToastDuration.LONG)
                                        .setToastPosition(ToastPosition.BOTTOM)
                                        .show();
                                }

                                setTimeout(() => {
                                        this.exitTries = 0;
                                    },
                                    2000);
                            }
                        }
                    }
                });

        }

    }

    ngOnDestroy(): void {

        this.firebaseTokenSubscription.unsubscribe();

        this.appService.appDataLoaded = false;
    }

    onSignIn(): void {

        this.appService.actionBarMenuOpen = false;
        if (this.authenticationService.userIsAuthenicated) {

            this.authenticationService.logoutUser();
            this.routerExtension.navigate(['main'], {replaceUrl: false});

        } else {
            this.routerExtension.navigate(['sign-in'], {replaceUrl: false});
        }
    }

    onNavigateDriver(): void {
        this.appService.actionBarMenuOpen = false;
        this.routerExtension.navigate(['driver'], {replaceUrl: false});
    }

    onNavigateUser(): void {
        this.appService.actionBarMenuOpen = false;
        this.routerExtension.navigate(['user'], {replaceUrl: false});
    }

    onCancel(): void {
        this.appService.actionBarMenuOpen = false;
    }

}
