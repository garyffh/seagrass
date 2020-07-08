import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';

import { DriverService } from '~/app/modules/driver/services/driver.service';
import { UserCar } from '~/app/modules/driver/services/driver.models';

export enum ComponentCarDeleteView {
    default,
    done,
    fail
}

@Component({
    selector: 'ns-car-delete',
    templateUrl: './car-delete.component.html',
    styleUrls: ['./car-delete.component.scss'],
    moduleId: module.id
})
export class CarDeleteComponent extends ViewBase implements OnInit {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting car',
                this.driverService.userCarFind(this.id),
                (view: CarDeleteComponent, data: UserCar) => {
                    view.model = data;
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get updateProcess(): ObservableProcessLateBind {

        if (this.fUpdateProcess === null) {
            this.fUpdateProcess = new ObservableProcessLateBind(this, 'Removing car failed');
        }

        return this.fUpdateProcess;

    }

    private routeKey = 'id';
    private fUpdateProcess: ObservableProcessLateBind = null;
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public driverService: DriverService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    ComponentCarDeleteView = ComponentCarDeleteView;
    componentView: ComponentCarDeleteView = ComponentCarDeleteView.default;

    failMessage: string;

    id: string;
    model: UserCar = null;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.id = params[this.routeKey];
            this.getEntityProcess.do();

        });
    }

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentCarDeleteView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentCarDeleteView.fail;

                break;
            }

            default: {
                super.handleError(error, title);
                break;
            }

        }

    }

    onContinue() {

        switch (this.componentView) {

            case ComponentCarDeleteView.done: {
                this.router.navigate(['/driver/cars'], {replaceUrl: false});
                break;
            }

            default: {
                this.componentView = ComponentCarDeleteView.default;
                break;
            }
        }

    }

    onCancel(): void {
        this.router.back();
    }

    onSubmit(): void {

        this.updateProcess.doLateBind(
            this.driverService.userCarDelete(this.model),
            (view: CarDeleteComponent, data: any) => {
                view.componentView = ComponentCarDeleteView.done;
            }
        );

    }

}
