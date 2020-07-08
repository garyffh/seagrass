import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular';

import { ErrorsState, ErrorService, ErrorItem } from '../../../services/error.service';
import { DialogMessage } from '~/app/services/app.models';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';

@Component({
    selector: 'ns-error-panel',
    templateUrl: './error-panel.component.html',
    styleUrls: ['./error-panel.component.scss'],
    moduleId: module.id
})
export class ErrorPanelComponent implements OnInit, OnDestroy {

    get showPanel(): boolean {
        return this.model !== null && this.model !== undefined;
    }

    constructor(public errorService: ErrorService,
                public modalService: ModalDialogService,
                public viewContainerRef: ViewContainerRef) {

        this.errorServiceSubscription = this.errorService
            .errorChangeEvent.subscribe((error) => {
                this.model = error;
            });

    }

    @Input() debug = false;

    errorServiceSubscription: Subscription = null;
    model: ErrorsState = null;

    ngOnInit() {
        if (this.debug) {
            this.model = new ErrorsState(new ErrorItem(1, 'error title', 'error message', {}), 1);
        }

    }

    ngOnDestroy() {
        if (this.errorServiceSubscription !== null) {
            this.errorServiceSubscription.unsubscribe();
        }
    }

    onDismiss(): void {
        this.errorService.dismissError(this.model.lastError.id);
        this.model = null;
    }

    onShowError(): void {

        const options: ModalDialogOptions = {
            context: new DialogMessage(this.model.lastError.title, this.model.lastError.message),
            fullscreen: false,
            viewContainerRef: this.viewContainerRef
        };
        this.modalService.showModal(MessageDialogComponent, options);

    }

}
