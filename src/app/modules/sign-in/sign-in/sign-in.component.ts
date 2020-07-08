import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

import { BusinessService } from '~/app/services/business.service';

@Component({
    selector: 'ns-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    moduleId: module.id
})
export class SignInComponent implements OnInit {

    constructor(public businessService: BusinessService,
                private page: Page) { }

    ngOnInit() {
        this.page.actionBarHidden = false;
    }
}
