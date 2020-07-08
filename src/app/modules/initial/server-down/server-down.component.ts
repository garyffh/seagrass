import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-server-down',
  templateUrl: './server-down.component.html',
  styleUrls: ['./server-down.component.scss'],
  moduleId: module.id
})
export class ServerDownComponent {

  constructor(private page: Page) {

  }

}
