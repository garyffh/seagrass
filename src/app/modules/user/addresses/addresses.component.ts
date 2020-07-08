import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular';

import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { UserService } from '~/app/modules/user/services/user.service';
import { UserAddress } from '~/app/modules/user/services/user.models';

@Component({
    selector: 'ns-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.scss'],
    moduleId: module.id
})
export class AddressesComponent extends ViewBase {

    get getAddressProcess(): ObservableProcess {
        if (this._getAddressProcess == null) {
            this._getAddressProcess = new ObservableProcess(this, 'Error getting address',
                this.userService.userAddressFind(),
                (view: AddressesComponent, data: UserAddress) => {
                    this.dataLoaded = false;
                    view.addressModel = data;
                    view.dataLoaded = true;
                    view.ref.detectChanges();
                },
                null);
        }

        return this._getAddressProcess;
    }

    get submitProcess(): ObservableProcessLateBind {

        if (this._submitProcess === null) {
            this._submitProcess = new ObservableProcessLateBind(this, 'Error updating address');
        }

        return this._submitProcess;

    }

    private _getAddressProcess: ObservableProcess = null;
    private _submitProcess: ObservableProcessLateBind = null;

    constructor(public formBuilder: FormBuilder,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                public userService: UserService,
                public ref: ChangeDetectorRef,
                public ngZone: NgZone,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.getAddressProcess.do();
    }

    addressForm: FormGroup = new FormGroup({});

    addressModel: UserAddress = new UserAddress();

    dataLoaded = false;

    get showSubmitButton(): boolean {
        if (this.addressForm.contains('additionalFieldsHandled')) {
           if (this.addressForm.get('additionalFieldsHandled').valid) {
               return this.addressForm.get('additionalFieldsHandled').value;
           } else {
               return false;
           }

        } else {
            return false;
        }
    }

    get showCancelButton(): boolean {
        if (this.addressForm.contains('addressSelected')) {
            return this.addressForm.get('addressSelected').value === false;
        } else {
            return true;
        }
    }

    onAddressSubmit(): void {

        const content: UserAddress = new UserAddress();
        content.updateId = this.addressModel.updateId;
        content.company = this.addressForm.get('company').value;
        content.companyNumber = this.addressForm.get('companyNumber').value;
        content.addressNote = this.addressForm.get('addressNote').value;
        content.street = this.addressForm.get('street').value;
        content.extended = this.addressForm.get('extended').value;
        content.locality = this.addressForm.get('locality').value;
        content.region = this.addressForm.get('region').value;
        content.postalCode = this.addressForm.get('postalCode').value;
        content.country = this.addressForm.get('country').value;
        content.lat = this.addressForm.get('lat').value;
        content.lng = this.addressForm.get('lng').value;
        content.distance = this.addressForm.get('distance').value;

        this.submitProcess.doLateBind(
            this.userService.userAddressUpdate(content),
            (view: AddressesComponent, data: UserAddress) => {
                view.router.navigate(['/user'], {replaceUrl: false});
            });
    }

    onCancel(): void {

        this.router.navigate(['/user'], {replaceUrl: false});

    }

}
