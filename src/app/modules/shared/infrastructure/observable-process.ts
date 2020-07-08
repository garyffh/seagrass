import { Observable } from 'rxjs';
import { ViewService } from '~/app/services/view.service';

// tslint:disable-next-line:interface-name
export interface IObserverableProcessView {
    viewService: ViewService;
    handleError(error: any, title?: string);
    onSpinnerButtonClick();
}

export class ObservableProcess {

    private doProcess(latebind: boolean) {
        try {
            this.view.viewService.addWorkingProcess();
            this.isProcessing = true;
            this.observable
                .subscribe(
                    (data) => {
                        this.isProcessing = false;
                        this.view.viewService.removeWorkingProcess();
                        if (this.onNext != null) {
                            this.onNext(this.view, data);
                        }

                    },
                    (error) => {
                        this.handleError(error);
                        if (latebind) {
                            this.observable = null;
                            this.onNext = null;
                            this.complete = null;
                        }
                    },
                    () => {
                        if (this.complete != null) {
                            this.complete(this.view);
                            if (latebind) {
                                this.observable = null;
                                this.onNext = null;
                                this.complete = null;
                            }
                        }
                    }
                );

        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error) {
        this.view.viewService.removeWorkingProcess();
        this.isProcessing = false;
        this.isError = true;

        this.view.handleError(error, this.errorTitle);
    }

    constructor(public view: IObserverableProcessView, public errorTitle: string, public observable?: Observable<any>,
                public onNext?: (view: IObserverableProcessView, data: any) => void,
                public complete?: (view: IObserverableProcessView) => void) {

    }

    isProcessing = false;
    isError = false;

    // tslint:disable-next-line:max-line-length
    doLateBind(observable: Observable<any>,  onNext?: (view: IObserverableProcessView, data: any) => void, complete?: (view: IObserverableProcessView) => void) {

        this.observable = observable;
        this.onNext = onNext;
        this.complete = complete;

        this.doProcess(true);

    }

    do() {

        this.doProcess(false);

    }

}
