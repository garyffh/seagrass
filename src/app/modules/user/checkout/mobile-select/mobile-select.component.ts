import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrnCustomerBillingDeliveryMethod, UserPhone } from '../../services/user.models';
import { BusinessService } from '../../../../services/business.service';
import { DeliveryMethodType } from '../../../../services/app.models';

export enum MobileSelectComponentView {
    view,
    change,
    add
}

@Component({
  selector: 'ns-mobile-select',
  templateUrl: './mobile-select.component.html',
  styleUrls: ['./mobile-select.component.scss'],
  moduleId: module.id
})
export class MobileSelectComponent implements OnInit {

    @Input() set mobileModel(value: UserPhone) {

        if (this.fMobileModel !== value) {
            this.fMobileModel = value;
            this.isValidStatusUpdate();
        }
    }

    get mobileModel(): UserPhone {
        return this.fMobileModel;
    }

    @Input() set billingDeliveryMethod(value: TrnCustomerBillingDeliveryMethod) {
        if (this.fBillingDeliveryMethod !== value) {
            this.fBillingDeliveryMethod = value;
            this.isValidStatusUpdate();
        }
    }

    get billingDeliveryMethod(): TrnCustomerBillingDeliveryMethod {
        return this.fBillingDeliveryMethod;
    }

    get isValid(): boolean {
        return this.fIsValid;
    }

    get hasMobile(): boolean {

        if (this.mobileModel.phoneNumber) {
            return true;
        } else {
            return false;
        }

    }

    get isDelivery(): boolean {

        if (this.billingDeliveryMethod) {
            return this.billingDeliveryMethod.selectedType === DeliveryMethodType.delivery;
        } else {
            return false;
        }

    }

    private fIsValid = false;
    private fMobileModel: UserPhone;
    private fBillingDeliveryMethod: TrnCustomerBillingDeliveryMethod;

    private isValidStatusUpdate() {
        let valid: boolean = this.hasMobile && this.isDelivery;
        if (!this.isDelivery && !this.hasMobile) {
            valid = true;
        }

        if (valid !== this.fIsValid) {
            this.fIsValid = valid;
            this.isValidStatus.emit(valid);
        }
    }

    constructor(private businessService: BusinessService,
                private changeDetectorRef: ChangeDetectorRef) {

    }

    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() updateMobile: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup;
    changeMobileForm: FormGroup;

    MobileSelectComponentView = MobileSelectComponentView;
    componentView: MobileSelectComponentView = MobileSelectComponentView.view;

    ngOnInit() {

        if (this.hasMobile) {
            this.componentView = MobileSelectComponentView.view;
        } else {
            this.changeMobileForm = new FormGroup({});
            this.componentView = MobileSelectComponentView.add;
        }

        this.isValidStatusUpdate();

    }

    onChangeMobile() {
        this.changeMobileForm = new FormGroup({});
        this.componentView = MobileSelectComponentView.change;
    }

    onCancelMobileChange() {
        this.componentView = MobileSelectComponentView.view;
    }

    onMobileValid(event) {
        this.mobileModel = event;
        this.componentView = MobileSelectComponentView.view;

        this.isValidStatusUpdate();

    }

    onPhoneUpdateExit(event: boolean) {

        this.componentView = MobileSelectComponentView.view;
        if (event) {
            this.updateMobile.emit(event);
        }

    }

}
