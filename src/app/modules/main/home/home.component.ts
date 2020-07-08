import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    moduleId: module.id
})
export class HomeComponent extends ViewBase {

    constructor(viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {
        super(viewService, errorService, router, route);

    }

}
