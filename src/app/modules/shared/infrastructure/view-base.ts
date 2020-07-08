import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ErrorItem, ErrorService } from '../../../services/error.service';
import { IObserverableProcessView } from '../infrastructure/observable-process';
import { ViewService } from '~/app/services/view.service';

export class ViewBase implements IObserverableProcessView {

    constructor(public viewService: ViewService,
                public errorService: ErrorService,
                public router: RouterExtensions,
                public route: ActivatedRoute) {

    }

    onSpinnerButtonClick(): void {
        console.error('override FfhViewBase::onSpinnerButtonClick()');
    }

    handleError(error: any, title?: string): void {

        const errorItem: ErrorItem = this.errorService.reportError(error, title);

        if (errorItem) {
            if (errorItem.message === 'invalid_grant') {
               this.viewService.signOut();
            }
        }

    }

    navigate(route: Array<any>): void {
        this.router.navigate(route, {relativeTo: this.route});
    }

}
