import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../../../services/error.service';

import { UserService } from '../services/user.service';
import { PhoneVerifyModel, PhoneUpdateModel } from '../services/user.models';
import { RouterExtensions } from 'nativescript-angular';

export enum ComponentPhoneUpdateView {
    default,
    phoneCode,
    fail
}

@Component({
    selector: 'ns-phone-update',
    templateUrl: './phone-update.component.html',
    styleUrls: ['./phone-update.component.scss'],
    moduleId: module.id
})
export class PhoneUpdateComponent {

    set newPhoneNumber(value: string) {
        this.fNewPhoneNumber = value;
    }

    get newPhoneNumber(): string {

        return this.fNewPhoneNumber;

    }

    private fNewPhoneNumber = '';

    constructor(public formBuilder: FormBuilder,
                public router: RouterExtensions,
                private userService: UserService,
                private errorService: ErrorService) {

        this.phoneNumberForm = this.formBuilder.group({
            mobile: ['', Validators.compose([Validators.required])]
        });

        // this.phoneCodeForm = this.formBuilder.group({
        //         code: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
        //     }
        // );

    }

    @Input() hasMobile: boolean;
    @Output() exit: EventEmitter<boolean> = new EventEmitter<boolean>();

    ComponentPhoneUpdateView = ComponentPhoneUpdateView;
    componentView: ComponentPhoneUpdateView = ComponentPhoneUpdateView.default;

    failMessage: string;

    phoneNumberForm: FormGroup;
    mobileCodeForm: FormGroup = new FormGroup({});

    // phoneCodeForm: FormGroup;

    inPhoneVerifyProcess = false;
    inPhoneUpdateProcess = false;

    handleError(error: any, title?: string) {

        switch (this.componentView) {

            case ComponentPhoneUpdateView.phoneCode:
            case ComponentPhoneUpdateView.default: {
                this.newPhoneNumber = '';
                this.mobileCodeForm.reset();
                this.failMessage = this.errorService.getErrorMessage(error);
                this.componentView = ComponentPhoneUpdateView.fail;

                break;
            }

            default: {

                break;
            }

        }

    }

    onContinue() {

        switch (this.componentView) {

            default: {
                this.componentView = ComponentPhoneUpdateView.default;
                break;
            }
        }

    }

    onPhoneVerifySubmit() {

        if (!this.phoneNumberForm.valid) {
            return;
        }

        this.fNewPhoneNumber = '';

        const apiModel = new PhoneVerifyModel();
        apiModel.updateId = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
        apiModel.mobileNumber = this.phoneNumberForm.get('mobile').value;

        this.inPhoneVerifyProcess = true;

        this.userService.phoneVerify(apiModel)
            .subscribe((data: PhoneVerifyModel) => {

                this.newPhoneNumber = data.mobileNumber;
                this.componentView = ComponentPhoneUpdateView.phoneCode;

                this.inPhoneVerifyProcess = false;

            }, (error) => {

                this.handleError(error);

                this.inPhoneVerifyProcess = false;

            });

    }

    onPhoneUpdateSubmit() {

        if (!this.mobileCodeForm.valid) {
            return;
        }

        const apiModel = new PhoneUpdateModel();
        apiModel.updateId = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
        apiModel.mobileCode = this.mobileCodeForm.get('digit1').value + this.mobileCodeForm.get('digit2').value +
            this.mobileCodeForm.get('digit3').value + this.mobileCodeForm.get('digit4').value +
            this.mobileCodeForm.get('digit5').value + this.mobileCodeForm.get('digit6').value;

        apiModel.mobileNumber = this.phoneNumberForm.get('mobile').value;

        this.inPhoneUpdateProcess = true;

        this.userService.phoneUpdate(apiModel)
            .subscribe(null,
                (error) => {

                    this.handleError(error);

                    this.inPhoneUpdateProcess = false;

                }, () => {

                    this.newPhoneNumber = '';
                    this.phoneNumberForm.reset();
                    this.mobileCodeForm.reset();
                    this.inPhoneUpdateProcess = false;
                    this.componentView = ComponentPhoneUpdateView.default;

                    this.exit.emit(true);

                });

    }

}
