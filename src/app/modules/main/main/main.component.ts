import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

import { BusinessService } from '~/app/services/business.service';
import { UtilityService } from '~/app/services/utility.service';
import { ModalDialogService, RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'ns-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  moduleId: module.id
})
export class MainComponent implements OnInit {

    constructor(public businessService: BusinessService,
                public utilityService: UtilityService,
                public routerExtensions: RouterExtensions,
                public modalService: ModalDialogService,
                public viewContainerRef: ViewContainerRef,
                private page: Page) {

    }

    ngOnInit() {
        this.page.actionBarHidden = false;
    }

}
