import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { BusinessService } from '~/app/services/business.service';
import { UtilityService } from '~/app/services/utility.service';
import { screen } from 'tns-core-modules/platform';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'ns-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  moduleId: module.id
})
export class UserComponent implements OnInit {

    constructor(public businessService: BusinessService,
                public utilityService: UtilityService,
                public router: RouterExtensions,
                private page: Page) {
    }

    ngOnInit() {
        this.page.actionBarHidden = false;
    }
}
