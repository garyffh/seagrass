import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { SharedModule } from '~/app/modules/shared/shared.module';

import { DriverDocumentTypePipe } from './pipes/driver-document-type.pipe';
import { DriverOrderDeliveryMethodStatusPipe } from './pipes/driver-order-delivery-method-status.pipe';
import { DriverOrderStoreStatusPipe } from './pipes/driver-order-store-status.pipe';

import { DeliveriesComponent } from './deliveries/deliveries.component';
import { CarsComponent } from './cars/cars.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { DisableDeliveriesComponent } from './disable-deliveries/disable-deliveries.component';
import { EnableDeliveriesComponent } from './enable-deliveries/enable-deliveries.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { DriveConfirmComponent } from './drive-confirm/drive-confirm.component';
import { DeliverConfirmComponent } from './deliver-confirm/deliver-confirm.component';
import { CarAddComponent } from './cars/car-add/car-add.component';
import { CarCurrentComponent } from './cars/car-current/car-current.component';
import { CarDeleteComponent } from './cars/car-delete/car-delete.component';
import { InvoiceDetailComponent } from './transactions/invoice-detail/invoice-detail.component';
import { PaymentDetailComponent } from './transactions/payment-detail/payment-detail.component';
import { DriverComponent } from './driver/driver.component';

const routes = [

    {path: '', component: DriverComponent,
     children: [
            {path: '', component: DeliveriesComponent},
            {path: 'delivery-detail/:id', component: DeliveryDetailComponent},
            {path: 'enable-deliveries', component: EnableDeliveriesComponent},
            {path: 'disable-deliveries', component: DisableDeliveriesComponent},
            {path: 'drive-confirm/:id', component: DriveConfirmComponent},
            {path: 'deliver-confirm/:id', component: DeliverConfirmComponent},
            {path: 'cars', component: CarsComponent},
            {path: 'car-add', component: CarAddComponent},
            {path: 'car-current/:id', component: CarCurrentComponent},
            {path: 'car-delete/:id', component: CarDeleteComponent},
            {path: 'transactions', component: TransactionsComponent},
            {path: 'invoice-detail/:id', component: InvoiceDetailComponent},
            {path: 'payment-detail/:id', component: PaymentDetailComponent}

        ]

    }
];

@NgModule({
    declarations: [
        DeliveriesComponent,
        CarsComponent,
        TransactionsComponent,
        DisableDeliveriesComponent,
        EnableDeliveriesComponent,
        DriverOrderDeliveryMethodStatusPipe,
        DriverOrderStoreStatusPipe,
        DriverDocumentTypePipe,
        DeliveryDetailComponent,
        DriveConfirmComponent,
        DeliverConfirmComponent,
        CarAddComponent,
        CarCurrentComponent,
        CarDeleteComponent,
        InvoiceDetailComponent,
        PaymentDetailComponent,
        DriverComponent

    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class DriverModule {
}
