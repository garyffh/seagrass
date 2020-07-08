import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ErrorService } from '~/app/services/error.service';
import { ViewService } from '~/app/services/view.service';

import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AppService } from '~/app/services/app.service';
import { SitemRead } from '~/app/services/app.models';

@Component({
    selector: 'ns-special-list',
    templateUrl: './special-list.component.html',
    styleUrls: ['./special-list.component.scss'],
    moduleId: module.id
})
export class SpecialListComponent extends ViewBase {

    get getSpecialsProcess(): ObservableProcess {

        if (this.fGetSpecialsProcess == null) {
            this.fGetSpecialsProcess = new ObservableProcess(this, 'Error getting specials',
                this.appService.specialsRead(),
                (view: SpecialListComponent, data: Array<SitemRead>) => {
                    view.specials = data;
                    view.hasSpecials = data.length > 0;
                },
                null
            );
        }

        return this.fGetSpecialsProcess;
    }

    private fGetSpecialsProcess: ObservableProcess = null;

    constructor(public appService: AppService,
                public ref: ChangeDetectorRef,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getSpecialsProcess.do();
    }

    hasSpecials = false;
    specials: Array<SitemRead> = [];

    onStateChange(event: boolean) {
        this.appService.specialsOpen = event;

    }

}
