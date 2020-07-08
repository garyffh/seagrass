import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { SharedModule } from '~/app/modules/shared/shared.module';
import { FfhPaymentCardModule } from './ffh-payment-card/ffh-payment-card.module';

import { CreditReasonPipe } from './pipes/credit-reason.pipe';
import { UserDocumentTypePipe } from './pipes/user-document-type.pipe';
import { PaymentMethodTypePipe } from './pipes/payment-method-type.pipe';
import { DeliveryMethodTypePipe } from './pipes/delivery-method-type.pipe';
import { OrderStoreStatusPipe } from './pipes/order-store-status.pipe';
import { OrderDeliveryMethodStatusPipe } from './pipes/order-delivery-method-status.pipe';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { FfhStripeCardComponent } from '~/app/modules/user/ffh-stripe-card/ffh-stripe-card.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserCardComponent } from './user-card/user-card.component';
import { PasswordComponent } from './password/password.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { PhoneComponent } from './phone/phone.component';
import { AddressesComponent } from './addresses/addresses.component';
import { PaymentMethodAddComponent } from './payment-methods/payment-method-add/payment-method-add.component';
import { PaymentMethodDefaultComponent } from './payment-methods/payment-method-default/payment-method-default.component';
import { PaymentMethodDeleteComponent } from './payment-methods/payment-method-delete/payment-method-delete.component';
import { CheckoutSelectComponent } from './checkout/checkout-select/checkout-select.component';
import { AddressSelectComponent } from './checkout/address-select/address-select.component';
import { DeliveryMethodSelectComponent } from './checkout/delivery-method-select/delivery-method-select.component';
import { MobileSelectComponent } from './checkout/mobile-select/mobile-select.component';
import { PaymentMethodSelectComponent } from './checkout/payment-method-select/payment-method-select.component';
import { PhoneUpdateComponent } from './phone-update/phone-update.component';
import { CustomiseComponent } from './checkout/customise/customise.component';
import { CreditDetailComponent } from './transactions/credit-detail/credit-detail.component';
import { InvoiceDetailComponent } from './transactions/invoice-detail/invoice-detail.component';
import { PaymentDetailComponent } from './transactions/payment-detail/payment-detail.component';
import { UserComponent } from './user/user.component';

const routes = [

    {
        path: '', component: UserComponent,
        children: [
            {path: '', component: DashboardComponent},
            {path: 'user-card', component: UserCardComponent},
            {path: 'checkout', component: CheckoutComponent},
            {path: 'checkout/customise', component: CustomiseComponent},
            {path: 'payment-methods', component: PaymentMethodsComponent},
            {path: 'payment-method-add', component: PaymentMethodAddComponent},
            {
                path: 'payment-method-default/:id',
                component: PaymentMethodDefaultComponent
            },
            {
                path: 'payment-method-delete/:id',
                component: PaymentMethodDeleteComponent
            },
            {path: 'addresses', component: AddressesComponent},
            {path: 'password', component: PasswordComponent},
            {path: 'phone', component: PhoneComponent},
            {path: 'transactions', component: TransactionsComponent},
            {path: 'invoice-detail/:id', component: InvoiceDetailComponent},
            {path: 'credit-detail/:id', component: CreditDetailComponent},
            {path: 'payment-detail/:id', component: PaymentDetailComponent},
            {path: 'orders', component: OrdersComponent},
            {path: 'order-detail/:id', component: OrderDetailComponent}
        ]
    }
];

@NgModule({
    declarations: [
        CreditReasonPipe,
        DeliveryMethodTypePipe,
        UserDocumentTypePipe,
        OrderDeliveryMethodStatusPipe,
        OrderStoreStatusPipe,
        PaymentMethodTypePipe,
        DashboardComponent,
        CheckoutComponent,
        PaymentMethodsComponent,
        PaymentMethodAddComponent,
        PaymentMethodDefaultComponent,
        PaymentMethodDeleteComponent,
        FfhStripeCardComponent,
        TransactionsComponent,
        UserCardComponent,
        PasswordComponent,
        OrderDetailComponent,
        OrdersComponent,
        PhoneComponent,
        AddressesComponent,
        CheckoutSelectComponent,
        AddressSelectComponent,
        DeliveryMethodSelectComponent,
        MobileSelectComponent,
        PaymentMethodSelectComponent,
        PhoneUpdateComponent,
        CustomiseComponent,
        CreditDetailComponent,
        InvoiceDetailComponent,
        PaymentDetailComponent,
        UserComponent
    ],
    imports: [
        CommonModule, // stops currency pipe error in editor - not required check periodically if editor bug fixed
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule,
        FfhPaymentCardModule
    ],
    entryComponents: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class UserModule {
}
