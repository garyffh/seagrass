import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { SharedModule } from '~/app/modules/shared/shared.module';

import { LoadDataComponent } from './load-data/load-data.component';
import { ServerDownComponent } from './server-down/server-down.component';
import { InitialComponent } from './initial/initial.component';

export const routes = [
    {   path: '', component: InitialComponent,
        children: [
            {   path: '', component: LoadDataComponent},
            {   path: 'server-down', component: ServerDownComponent}
        ]
    }

];

@NgModule({
  declarations: [
      LoadDataComponent,
      ServerDownComponent,
      InitialComponent],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild(routes),
    SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class InitialModule { }
