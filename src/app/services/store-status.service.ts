import { Injectable } from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';

import { HttpService } from './http.service';
import { StoreStatus, StoreStatusFind } from './app.models';

@Injectable({
    providedIn: 'root'
})
export class StoreStatusService {

    get storeStatus(): StoreStatus {
        return this.fStoreStatus;
    }

    private timeZone: string;
    private fStoreStatus: StoreStatus;

    private timer = timer(5000, 300000);
    private timerSubscriber: Subscription;

    constructor(public httpService: HttpService) {

    }

    storeStatusUpdateSource = new Subject<StoreStatus>();
    storeStatusUpdate$ = this.storeStatusUpdateSource.asObservable();

    load(value: StoreStatus, timeZone: string) {

        this.fStoreStatus = new StoreStatus(value);
        this.timeZone = timeZone;

        this.timerSubscriber = this.timer.subscribe(
            (val) => {
                const apiModel: StoreStatusFind = new StoreStatusFind();
                apiModel.timeZone = this.timeZone;

                this.httpService.httpPutWithModel<StoreStatus>('store-status', apiModel)
                    .subscribe(
                        (data) => {
                            this.fStoreStatus = new StoreStatus(data);
                            this.storeStatusUpdateSource.next(this.fStoreStatus);
                        }
                    );
            }
        );

    }

    refresh() {

        const refreshApiModel: StoreStatusFind = new StoreStatusFind();
        refreshApiModel.timeZone = this.timeZone;

        this.httpService.httpPutWithModel<StoreStatus>('store-status', refreshApiModel)
            .subscribe(
                (data) => {
                    this.fStoreStatus = new StoreStatus(data);
                    this.storeStatusUpdateSource.next(this.fStoreStatus);
                }
            );

        // the periodic refresh might fire soon after so resetting the timer
        if (this.timerSubscriber) {
            this.timerSubscriber.unsubscribe();
        }

        this.timer = timer(300000, 300000);

        this.timerSubscriber = this.timer.subscribe(
            (val) => {
                const apiModel: StoreStatusFind = new StoreStatusFind();
                apiModel.timeZone = this.timeZone;

                this.httpService.httpPutWithModel<StoreStatus>('store-status', apiModel)
                    .subscribe(
                        (data) => {
                            this.fStoreStatus = new StoreStatus(data);
                            this.storeStatusUpdateSource.next(this.fStoreStatus);
                        }
                    );
            }
        );

    }

}
