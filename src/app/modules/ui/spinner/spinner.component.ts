import { Component, Input, OnInit } from '@angular/core';
import { ViewService } from '~/app/services/view.service';

@Component({
  selector: 'ns-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  moduleId: module.id
})
export class SpinnerComponent {

  constructor(public viewService: ViewService) {
  }

  @Input() debug = false;

}
