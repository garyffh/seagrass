import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
  moduleId: module.id
})
export class InitialComponent implements OnInit {

    constructor(private page: Page) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

}
