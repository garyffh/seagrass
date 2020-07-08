import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'ns-delivery-area-tap',
  templateUrl: './delivery-area-tap.component.html',
  styleUrls: ['./delivery-area-tap.component.scss'],
  moduleId: module.id
})
export class DeliveryAreaTapComponent {

  constructor(public router: RouterExtensions) {

  }

  onNavigateToDeliveryArea(): void {
      this.router.navigate(['delivery-areas']);
  }
}
