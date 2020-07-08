import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { SharedModule } from '~/app/modules/shared/shared.module';

import { SignInComponent } from './sign-in/sign-in.component';
import { DefaultComponent } from './default/default.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes = [
    {
        path: '', component: SignInComponent,
        children: [
            {path: '', component: DefaultComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'sign-up', component: SignUpComponent}
        ]
    }
];

@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
        ForgotPasswordComponent,
        DefaultComponent
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SignInModule {
}
