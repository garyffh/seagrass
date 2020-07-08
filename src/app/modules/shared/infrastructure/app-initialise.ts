import { Observable, Subject } from 'rxjs';
import { Message } from 'nativescript-plugin-firebase';
import { LocalNotifications } from 'nativescript-local-notifications';
import {
    TrnOrderDriverAllocateDriverModel,
    TrnOrderUpdateModel,
    TrnOrderUserAllocateDriverModel
} from '~/app/modules/user/services/user.models';

const firebase = require('nativescript-plugin-firebase');

export class AppGlobals {

    static initialise() {
        if (!AppGlobals.fInstance) {
            AppGlobals.fInstance = new AppGlobals();
        }
    }

    static get instance(): AppGlobals {
        if (!AppGlobals.fInstance) {
            throw new Error('AppGlobals has not been initialised!');
        }

        return AppGlobals.fInstance;
    }

    private static fInstance: AppGlobals;

    private notificationMessageSource = new Subject<string>();
    private driverStateSource = new Subject<TrnOrderUpdateModel>();
    private userStateSource = new Subject<TrnOrderUpdateModel>();
    private userAllocateDriverSource = new Subject<TrnOrderUserAllocateDriverModel>();
    private driverAllocateDriverSource = new Subject<TrnOrderDriverAllocateDriverModel>();

    constructor() {
    }

    notificationMessageEvent = this.notificationMessageSource.asObservable();
    driverStateEvent = this.driverStateSource.asObservable();
    userStateEvent = this.userStateSource.asObservable();
    userAllocateDriverEvent = this.userAllocateDriverSource.asObservable();
    driverAllocateDriverEvent = this.driverAllocateDriverSource.asObservable();

    publishNotificationMessage(value: string) {
        this.notificationMessageSource.next(value);
    }

    publishDriverState(value: TrnOrderUpdateModel) {
        this.driverStateSource.next(value);
    }

    publishUserState(value: TrnOrderUpdateModel) {
        this.userStateSource.next(value);
    }

    publishUserAllocateDriver(value: TrnOrderUserAllocateDriverModel) {
        this.userAllocateDriverSource.next(value);
    }

    publishDriverAllocateDriver(value: TrnOrderDriverAllocateDriverModel) {
        this.driverAllocateDriverSource.next(value);
    }

}

export class AppFirebaseToken {

    static initialise() {
        if (!AppFirebaseToken.fInstance) {
            AppFirebaseToken.fInstance = new AppFirebaseToken();
        }
    }

    static get instance(): AppFirebaseToken {
        if (!AppFirebaseToken.fInstance) {
            throw new Error('AppFirebaseToken has not been initialised!');
        }

        return AppFirebaseToken.fInstance;
    }

    private static fInstance: AppFirebaseToken;

    private firebaseTokenSource = new Subject<string>();

    constructor() {
    }

    firebaseTokenEvent: Observable<string>  = this.firebaseTokenSource.asObservable();

    publishFirebaseToken(token: string) {
        this.firebaseTokenSource.next(token);
    }
}

export class AppFirebaseMessage {

    static initialise() {
        if (!AppFirebaseMessage.fInstance) {
            AppFirebaseMessage.fInstance = new AppFirebaseMessage();
        }
    }

    static get instance(): AppFirebaseMessage {
        if (!AppFirebaseMessage.fInstance) {
            throw new Error('AppFirebaseMessage has not been initialised!');
        }

        return AppFirebaseMessage.fInstance;
    }

    private static fInstance: AppFirebaseMessage;

    private firebaseMessageSource = new Subject<Message>();

    constructor() {
    }

    firebaseMessageEvent: Observable<Message>  = this.firebaseMessageSource.asObservable();

    publishFirebaseMessage(message: Message) {
        this.firebaseMessageSource.next(message);
    }
}

export class AppFfhAccessToken {

    static initialise() {
        if (!AppFfhAccessToken.fInstance) {
            AppFfhAccessToken.fInstance = new AppFfhAccessToken();
        }
    }

    static get instance(): AppFfhAccessToken {
        if (!AppFfhAccessToken.fInstance) {
            throw new Error('AppFfhAccessToken has not been initialised!');
        }

        return AppFfhAccessToken.fInstance;
    }

    private static fInstance: AppFfhAccessToken;

    private ffhAccessTokenSource = new Subject<boolean>();

    constructor() {
    }

    ffhAccessTokenEvent: Observable<boolean>  = this.ffhAccessTokenSource.asObservable();

    publishFfhAccessToken(accessTokenValid: boolean) {
        this.ffhAccessTokenSource.next(accessTokenValid);
    }
}

(() => {
        AppGlobals.initialise();
        AppFirebaseToken.initialise();
        AppFirebaseMessage.initialise();
        AppFfhAccessToken.initialise();

        LocalNotifications.cancelAll();

        try {
            firebase.init({
                persist: false,
                showNotifications: false, // handled by nativescript-local-notifications conflict??!
                showNotificationsWhenInForeground: false, // handled by nativescript-local-notifications

                onPushTokenReceivedCallback: (token: string) => {
                    AppFirebaseToken.instance.publishFirebaseToken(token);
                },

                onMessageReceivedCallback: (message: Message) => {

                    try {
                        AppFirebaseMessage.instance.publishFirebaseMessage(message);
                    } catch (e) {
                        console.log(`firebase.addOnMessageReceivedCallback error: ${e}`);
                    }

                }

            }).then(
                // tslint:disable-next-line:no-empty
                () => {
                },
                (error) => {
                    console.log(`firebase.init error: ${error}`);
                }
            );
        } catch (err) {
            console.log('Firebase init error: ' + err);
        }

    }
)();
