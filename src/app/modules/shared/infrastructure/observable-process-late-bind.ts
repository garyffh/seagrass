import { ObservableProcess, IObserverableProcessView } from './observable-process';

export class ObservableProcessLateBind extends ObservableProcess {

    constructor(view: IObserverableProcessView,  errorTitle: string) {
        super(view, errorTitle);

    }

    do() {
        this.view.onSpinnerButtonClick();
    }

}
