import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '~/app/services/authentication.service';

const zXing = require('@proplugins/nativescript-zxing');

@Component({
    selector: 'ns-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    moduleId: module.id
})
export class UserCardComponent {

    constructor(public authenticationService: AuthenticationService) {
        this.img = new zXing().createBarcode({
            encode: authenticationService.user.cardNumber,
            height: 320,
            width: 320,
            format: zXing.QR_CODE
        });
    }

    img: any;

}
