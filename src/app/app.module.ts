import { NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { registerElement } from 'nativescript-angular';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { ModalDialogService } from 'nativescript-angular/modal-dialog';

import { CardView } from '@nstudio/nativescript-cardview';
registerElement('CardView', () => CardView as any);
registerElement('CreditCardView', () => require('nativescript-stripe').CreditCardView);

import { AppSettings, initializeAppSettings } from './services/app.settings';

import { SharedModule } from '~/app/modules/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageService } from '~/app/services/message.service';

require ('@proplugins/nativescript-themes');
require ('@proplugins/nativescript-zxing');

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        SharedModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppSettings,
        {provide: APP_INITIALIZER, useFactory: initializeAppSettings, deps: [AppSettings], multi: true},
        ModalDialogService,
        MessageService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
}
