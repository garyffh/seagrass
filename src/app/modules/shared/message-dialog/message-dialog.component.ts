import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular';

@Component({
    selector: 'ns-message-dialog',
    templateUrl: './message-dialog.component.html',
    styleUrls: ['./message-dialog.component.scss'],
    moduleId: module.id
})
export class MessageDialogComponent {

    constructor(private params: ModalDialogParams) {

        this.title = params.context.title;
        this.detail = params.context.detail;

    }

    title: string;
    detail: string;

    onClose(event: string) {
        this.params.closeCallback(event);
    }

}
