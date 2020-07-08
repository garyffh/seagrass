import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';

import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AppService } from '~/app/services/app.service';
import {
    DeliveryTime,
    DeliveryTimeRead,
    StoreTime,
    StoreTimeRead,
    StoreTradingExceptionRead
} from '~/app/services/app.models';
import { BusinessService } from '~/app/services/business.service';

export class OpenInterval {

    constructor(
        // tslint:disable-next-line:variable-name
        public number: number,
        public fromTime: Moment,
        public toTime: Moment) {

    }
}

export class DisplayDay {

    get closed(): boolean {
        return this.intervals.length === 0;
    }

    constructor(public value: number,
                public day: string) {

    }

    intervals: Array<OpenInterval> = [];
}

@Component({
    selector: 'ns-trading-hours',
    templateUrl: './trading-hours.component.html',
    styleUrls: ['./trading-hours.component.scss'],
    moduleId: module.id
})
export class TradingHoursComponent extends ViewBase {

    get getStoreTimesProcess(): ObservableProcess {
        if (this.fGetStoreTimesProcess == null) {
            this.fGetStoreTimesProcess = new ObservableProcess(this, 'Error getting trading hours',
                this.appService.allStoreTimes(),
                (view: TradingHoursComponent, data: Array<StoreTimeRead>) => {

                    view.storeDays = [];
                    for (const day of view.appService.getDays()) {
                        const componentDay = new DisplayDay(day.value, day.day);

                        data.filter((x) => x.sysStoreTimeId === componentDay.value)
                            .forEach((i) => {
                                componentDay.intervals
                                    .push(new OpenInterval(i.number, moment('1970-01-01 ' + i.fromTime), moment('1970-01-01 ' + i.toTime)));
                            });

                        view.storeDays.push(componentDay);
                    }

                }
            );
        }

        return this.fGetStoreTimesProcess;
    }

    get getDeliveryTimesProcess(): ObservableProcess {
        if (this.fGetDeliveryTimesProcess == null) {
            this.fGetDeliveryTimesProcess = new ObservableProcess(this, 'Error getting delivery times',
                this.appService.allDeliveryTimes(),
                (view: TradingHoursComponent, data: Array<DeliveryTimeRead>) => {

                    view.hasDelivery = data.length > 0;
                    view.deliveryDays = [];
                    for (const day of view.appService.getDays()) {
                        const componentDay = new DisplayDay(day.value, day.day);

                        data.filter((x) => x.sysDeliveryTimeId === componentDay.value)
                            .forEach((i) => {
                                componentDay.intervals
                                    .push(new OpenInterval(i.number, moment('1970-01-01 ' + i.fromTime), moment('1970-01-01 ' + i.toTime)));
                            });

                        view.deliveryDays.push(componentDay);

                    }

                }
            );
        }

        return this.fGetDeliveryTimesProcess;
    }

    get getTradingExceptionsProcess(): ObservableProcess {
        if (this.fGetTradingExceptionsProcess == null) {
            this.fGetTradingExceptionsProcess = new ObservableProcess(this, 'Error getting trading times',
                this.appService.allStoreTradingExceptions(),
                (view: TradingHoursComponent, data: Array<StoreTradingExceptionRead>) => {
                    view.hasTradingExceptions = data.length > 0;
                    view.tradingExceptions = [];

                    for (const tradingException of data) {

                        view.tradingExceptions.push(new StoreTradingExceptionRead(tradingException));

                    }
                }
            );
        }

        return this.fGetTradingExceptionsProcess;
    }

    private fGetStoreTimesProcess: ObservableProcess = null;
    private fGetDeliveryTimesProcess: ObservableProcess = null;
    private fGetTradingExceptionsProcess: ObservableProcess = null;

    constructor(public appService: AppService,
                public businessService: BusinessService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getStoreTimesProcess.do();
        this.getDeliveryTimesProcess.do();
        this.getTradingExceptionsProcess.do();

    }

    currentStoreTimesModel: StoreTime = null;
    storeDays: Array<DisplayDay>;

    currentDeliveryTimesModel: DeliveryTime = null;
    deliveryDays: Array<DisplayDay>;
    hasDelivery = false;

    tradingExceptions: Array<StoreTradingExceptionRead> = [];
    hasTradingExceptions = false;

    onDeliveryTap(): void {
        this.router.navigate(['/delivery-areas']);
    }
}
