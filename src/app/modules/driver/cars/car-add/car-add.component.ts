import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { UtilityService } from '~/app/services/utility.service';
import { DriverService } from '~/app/modules/driver/services/driver.service';
import { UserCar } from '../../services/driver.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export enum ComponentCarAddView {
    default,
    done,
    fail
}

@Component({
    selector: 'ns-car-add',
    templateUrl: './car-add.component.html',
    styleUrls: ['./car-add.component.scss'],
    moduleId: module.id
})
export class CarAddComponent extends ViewBase {

    get carAddProcess(): ObservableProcessLateBind {

        if (this.fCarAddProcess === null) {
            this.fCarAddProcess = new ObservableProcessLateBind(this, 'Adding car failed');
        }

        return this.fCarAddProcess;

    }

    private fCarAddProcess: ObservableProcessLateBind = null;

    constructor(public driverService: DriverService,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    ComponentCarAddView = ComponentCarAddView;
    componentView: ComponentCarAddView = ComponentCarAddView.default;

    failMessage: string;

    form: FormGroup = new FormGroup({
        plate: new FormControl('', [Validators.required]),
        model: new FormControl('', [Validators.required]),
        make: new FormControl('', [Validators.required]),
        colour: new FormControl('', [Validators.required])
    });

    showValidationError(fieldName: string): boolean {
        return (!this.form.get(fieldName).valid) &&  this.form.get(fieldName).touched;
    }

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentCarAddView.default: {
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentCarAddView.fail;

                break;
            }

            default: {
                super.handleError(error, title);
            }

        }

    }

    onContinue() {
        switch (this.componentView) {

            case ComponentCarAddView.fail: {
                this.componentView = ComponentCarAddView.default;

                break;
            }

            default: {

                this.router.navigate(['/driver/cars'], {replaceUrl: false});
                break;
            }

        }
    }

    onCancel() {
        this.router.back();

    }

    onSubmit(): void {

        if (!this.form.valid) {
            return;
        }

        const apiModel = new UserCar();
        apiModel.plate = this.form.get('plate').value;
        apiModel.make = this.form.get('make').value;
        apiModel.model = this.form.get('model').value;
        apiModel.colour = this.form.get('colour').value;

        this.carAddProcess.doLateBind(
            this.driverService.userCarAdd(apiModel),
            (view: CarAddComponent, data: any) => {
                view.componentView = ComponentCarAddView.done;
            }
        );

    }

}
