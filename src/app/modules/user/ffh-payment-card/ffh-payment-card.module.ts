import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { FfhPaymentCardComponent } from './ffh-payment-card.component';
import { PaymentCardNumberPipe } from './pipes/payment-card-number.pipe';
import { ValidThruPipe } from './pipes/valid-thru.pipe';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptFormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        FfhPaymentCardComponent,
        PaymentCardNumberPipe,
        ValidThruPipe
    ],
    exports: [
        FfhPaymentCardComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]

})
export class FfhPaymentCardModule {}
