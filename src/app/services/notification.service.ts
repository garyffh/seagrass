import { Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

import { Toasty, ToastDuration, ToastPosition } from 'nativescript-toasty';
import { AppGlobals } from '~/app/modules/shared/infrastructure/app-initialise';

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements OnDestroy {

    private userHubSubscription: Subscription = null;

    constructor() {

        this.userHubSubscription = AppGlobals.instance.notificationMessageEvent
            .subscribe((message) => {

                    new Toasty({ text: message })
                        .setToastDuration(ToastDuration.LONG)
                        .setToastPosition(ToastPosition.CENTER)
                        .show();
                }
            );
    }

    ngOnDestroy(): void {
        this.userHubSubscription.unsubscribe();
    }

}
