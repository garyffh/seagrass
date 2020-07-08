import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'ns-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    moduleId: module.id
})
export class DialogComponent {
    @Input () title: string;
    @Input () showButtons = false;
    @Input () confirmLabel = 'CONFIRM';
    @Output() close: EventEmitter<string> = new EventEmitter<string>();

    onClose() {
        this.close.emit('close');
    }

    onCancel() {
        this.close.emit('cancel');
    }

    onConfirm() {
        this.close.emit('confirm');
    }
}
