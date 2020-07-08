import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrnCustomerBillingDeliveryMethod, UserAddress } from '../../services/user.models';
import { BusinessService } from '../../../../services/business.service';
import { DeliveryMethodType } from '../../../../services/app.models';

export enum AddressSelectComponentView {
    view,
    change,
    add
}

@Component({
  selector: 'ns-address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss'],
  moduleId: module.id
})
export class AddressSelectComponent implements OnInit {
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

    get hasAddress(): boolean {

        if (this.addressModel) {
            if (this.addressModel.street) {
                return true;
            } else {
                return false;
            }

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

    get validAddressDistance(): boolean {
        if (this.hasAddress && this.isDelivery) {
            return this.addressModel.distance <= this.businessService.business.maxDeliveryDistance;
        } else if (this.hasAddress && !this.isDelivery) {
            return true;
        } else {
            return false;
        }
    }

    private fIsValid: boolean;
    private fBillingDeliveryMethod: TrnCustomerBillingDeliveryMethod;

    private isValidStatusUpdate() {
        let valid: boolean = this.hasAddress && this.validAddressDistance && this.isDelivery;
        if (!this.isDelivery && this.hasAddress) {
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
    @Output() updateAddress: EventEmitter<UserAddress> = new EventEmitter<UserAddress>();
    @Input() addressModel: UserAddress;
    @Input() changeAddressForm: FormGroup;

    AddressSelectComponentView = AddressSelectComponentView;
    componentView: AddressSelectComponentView = AddressSelectComponentView.view;

    ngOnInit() {
        this.isValidStatusUpdate();

        if (this.hasAddress) {
            this.componentView = AddressSelectComponentView.view;
        } else {
            this.changeAddressForm = new FormGroup({});
            this.componentView = AddressSelectComponentView.add;
        }

    }

    onChangeAddress() {
        this.changeAddressForm = new FormGroup({});
        this.componentView = AddressSelectComponentView.change;
    }

    onCancelAddressChange() {
        this.componentView = AddressSelectComponentView.view;
    }

    onSelectValidAddress(event) {
        this.addressModel = event;
        this.componentView = AddressSelectComponentView.view;

        this.isValidStatusUpdate();

        if (this.isValid) {
            this.updateAddress.emit(event);
        }

    }

}
