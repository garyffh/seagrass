import { Component, Input, OnInit } from '@angular/core';
import { AddressModel } from '../address-update/address-update.component';
import { UtilityService } from '~/app/services/utility.service';

@Component({
    selector: 'ns-address-view',
    templateUrl: './address-view.component.html',
    styleUrls: ['./address-view.component.scss'],
    moduleId: module.id
})
export class AddressViewComponent {

    get emptyModel(): boolean {
        if (this.address) {
            return this.isEmpty(this.address.street);
        } else {
            return true;
        }
    }

    private isEmpty(value): boolean {
        return !value;
    }

    constructor(public utilityService: UtilityService) {
    }

    @Input() showCompany = true;
    @Input() backgroundAccent = true;
    @Input() displayFormat = 0;
    @Input() address: AddressModel = new AddressModel();

    get hasCompany(): boolean {

        if (this.address.company) {
            if (this.address.company === '') {
               return false;
            } else {
                return  true;
            }
        } else {
            return false;
        }
    }

    get hasAddressNote(): boolean {
        if (this.address.addressNote) {
            if (this.address.addressNote === '') {
                return false;
            } else {
                return  true;
            }
        } else {
            return false;
        }

    }

}
