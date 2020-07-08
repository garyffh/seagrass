import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { SharedModule } from '~/app/modules/shared/shared.module';

import { CartComponent } from './cart.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CustomiseComponent } from './customise/customise.component';

const routes = [

    {
        path: '', component: CartComponent,
        children: [
            {path: '', component: CartListComponent},
            {path: 'customise', component: CustomiseComponent}
        ]
    }

];

@NgModule({
    declarations: [
        CustomiseComponent,
        CartListComponent,
        CartComponent
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CartModule {
}
