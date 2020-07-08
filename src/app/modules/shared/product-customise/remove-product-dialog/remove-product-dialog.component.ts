import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular';
import { TrnClientCustomersItem } from '~/app/services/app.models';

@Component({
  selector: 'ns-remove-product-dialog',
  templateUrl: './remove-product-dialog.component.html',
  styleUrls: ['./remove-product-dialog.component.scss'],
  moduleId: module.id
})
export class RemoveProductDialogComponent {

  constructor(private params: ModalDialogParams) {

  }

  onClose(event): void {
      this.params.closeCallback(event);
  }

  get model(): TrnClientCustomersItem {
        return this.params.context as TrnClientCustomersItem;
    }

}
