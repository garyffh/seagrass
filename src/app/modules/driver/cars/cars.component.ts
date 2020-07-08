import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { UtilityService } from '~/app/services/utility.service';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { UserCar } from '../services/driver.models';

@Component({
    selector: 'ns-cars',
    templateUrl: './cars.component.html',
    styleUrls: ['./cars.component.scss'],
    moduleId: module.id
})
export class CarsComponent extends ViewBase {

    get getCarsProcess(): ObservableProcess {

        if (this.fGetCarsProcess == null) {
            this.fGetCarsProcess = new ObservableProcess(this, 'Error reading cars',
                this.driverService.userCarsRead(),
                (view: CarsComponent, data: Array<UserCar>) => {
                    view.listItems = new ObservableArray<UserCar>(data);
                },
                null
            );
        }

        return this.fGetCarsProcess;
    }

    private fGetCarsProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getCarsProcess.do();
    }

    listItems: ObservableArray<UserCar> = null;

}
