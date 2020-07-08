import { Subject, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { AppService } from '~/app/services/app.service';
import { Message } from 'nativescript-plugin-firebase';
import { StorageService } from '~/app/services/storage.service';
import {
    TrnOrderDeliveryMethodStatus,
    TrnOrderDriverAllocateDriverModel,
    TrnOrderStoreStatus,
    TrnOrderUpdateModel,
    TrnOrderUserAllocateDriverModel
} from '~/app/modules/user/services/user.models';
import { AppSound, SoundService } from '~/app/services/sound.service';
import { LocalNotifications } from 'nativescript-local-notifications';
import { AppFirebaseMessage, AppGlobals } from '~/app/modules/shared/infrastructure/app-initialise';

@Injectable(
)
export class MessageService implements OnDestroy {

    get businessName(): string {
        return this.appService.businessService.business.businessName;
    }

    get hasPermission(): boolean {
        return this.fHasPermission;
    }

    private firebaseMessageSubscription: Subscription = null;

    private fHasPermission = true;

    private fDeviceTokenKey: string = 'device-token';

    private messageHandler(message: Message) {

        if (!message.data) {
            return;
        }

        if (!message.foreground) {

            // the app is not in the foreground show a local notification

            if (!message.data.title || !message.data.text || !message.data.localNotification) {
                return;
            }

            if (message.data.localNotification.toLowerCase() === 'true') {
                LocalNotifications.schedule(
                    [{
                        thumbnail: true,
                        title: message.data.title,
                        body: message.data.text,
                        forceShowWhenInForeground: false,
                        at: new Date(new Date().getTime() + 1000),
                        actions: []
                    }])
                    .catch((error) => console.error(error));
            }

        } else {

            // the app is in the foreground update the app view

            if (!message.data.messageId) {
                return;
            }

            if (!message.data.method) {
                return;
            }

            switch (message.data.method) {

                case 'localMessage': {

                    if (message.data.text !== undefined && message.data.localNotification !== undefined) {

                        if (message.data.localNotification.toLowerCase() === 'true') {
                            AppGlobals.instance.publishNotificationMessage(message.data.text);
                            this.soundService.playSound(AppSound.message);
                        }
                    }

                    break;
                }

                case 'TrnOrderPrepareUpdateDriver': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishDriverState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.driverStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderDispatchUpdateUser': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishUserState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.userStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderDispatchUpdateDriver': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishDriverState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.driverStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderPickupUpdateUser': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishUserState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.driverStateMessage(noticeData));
                    this.soundService.playSound(AppSound.userPickup);

                    break;
                }

                case 'TrnOrderCancelUpdateUser': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishUserState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.userStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderCancelUpdateDriver': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishDriverState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.driverStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderAllocateDriverUser': {

                    const noticeData: TrnOrderUserAllocateDriverModel =
                        new TrnOrderUserAllocateDriverModel(message.data);
                    AppGlobals.instance.publishUserAllocateDriver(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.userAllocateDriverMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderAllocateDriverDriver': {

                    const noticeData: TrnOrderDriverAllocateDriverModel =
                        new TrnOrderDriverAllocateDriverModel(message.data);
                    AppGlobals.instance.publishDriverAllocateDriver(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.driverAllocateDriverMessage(noticeData));
                    this.soundService.playSound(AppSound.driverDelivery);

                    break;
                }

                case 'TrnOrderQueueUpdateUser': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishUserState(noticeData);

                    // AppGlobals.instance.publishNotificationMessage(this.userStateMessage(noticeData));
                    // this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderDriveUpdateUser': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishUserState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.userStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

                case 'TrnOrderDeliveryUpdateUser': {

                    const noticeData: TrnOrderUpdateModel = new TrnOrderUpdateModel(message.data);
                    AppGlobals.instance.publishUserState(noticeData);
                    AppGlobals.instance.publishNotificationMessage(this.userStateMessage(noticeData));
                    this.soundService.playSound(AppSound.message);

                    break;
                }

            }
        }

    }

    private userStateMessage(message: TrnOrderUpdateModel): string {

        switch (message.deliveryMethodStatus) {

            case TrnOrderDeliveryMethodStatus.scheduled:
                return 'Your order has been scheduled';

            case TrnOrderDeliveryMethodStatus.preparing:
                return 'Your order is being prepared';

            case TrnOrderDeliveryMethodStatus.readyForPickup:
                return 'Your order is ready to be picked up';

            case TrnOrderDeliveryMethodStatus.delivering:
                return 'Your order is being delivered';

            case TrnOrderDeliveryMethodStatus.completed:
                return 'Your order is complete';

            case TrnOrderDeliveryMethodStatus.cancelled:
                return 'Your order has been cancelled';

        }

    }

    private driverStateMessage(message: TrnOrderUpdateModel): string {

        switch (message.storeStatus) {

            case TrnOrderStoreStatus.scheduled:
                return `${this.businessName} delivery has been scheduled`;

            case TrnOrderStoreStatus.noDriver:
                return `${this.businessName} delivery has no driver`;

            case TrnOrderStoreStatus.queued:
                return `${this.businessName} delivery has been queued`;

            case TrnOrderStoreStatus.preparing:
                return `${this.businessName} delivery is being prepared`;

            case TrnOrderStoreStatus.waitingForPickup:
                return `${this.businessName} order is ready for pickup`;

            case TrnOrderStoreStatus.waitingForDelivery:
                return `${this.businessName} delivery is ready for pickup`;

            case TrnOrderStoreStatus.delivering:
                return `Delivering ${this.businessName} order`;

            case TrnOrderStoreStatus.completed:
                return `${this.businessName} delivery has been completed`;

            case TrnOrderStoreStatus.cancelled:
                return `${this.businessName} delivery has been cancelled`;

        }
    }

    private userAllocateDriverMessage(message: TrnOrderUserAllocateDriverModel): string {

        return 'Your order has been allocated a delivery driver';
    }

    private driverAllocateDriverMessage(message: TrnOrderDriverAllocateDriverModel): string {

        return `New ${this.businessName} delivery`;
    }

    constructor(public soundService: SoundService,
                public appService: AppService,
                public storageService: StorageService) {

        this.firebaseMessageSubscription = AppFirebaseMessage.instance.firebaseMessageEvent
            .subscribe((message) => {
                    this.messageHandler(message);
                }
            );
    }

    // notificationMessageSource = new Subject<string>();
    // driverStateSource = new Subject<TrnOrderUpdateModel>();
    // userStateSource = new Subject<TrnOrderUpdateModel>();
    // userAllocateDriverSource = new Subject<TrnOrderUserAllocateDriverModel>();
    // driverAllocateDriverSource = new Subject<TrnOrderDriverAllocateDriverModel>();
    //
    // notificationMessage$ = this.notificationMessageSource.asObservable();
    // driverState$ = this.driverStateSource.asObservable();
    // userState$ = this.userStateSource.asObservable();
    // userAllocateDriver$ = this.userAllocateDriverSource.asObservable();
    // driverAllocateDriver$ = this.driverAllocateDriverSource.asObservable();

    ngOnDestroy(): void {
         this.firebaseMessageSubscription.unsubscribe();
    }

}
