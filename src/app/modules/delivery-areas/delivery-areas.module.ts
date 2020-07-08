import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { SharedModule } from '~/app/modules/shared/shared.module';
import { DeliveryAreasComponent } from './delivery-areas.component';

const routes = [
    {path: '', component: DeliveryAreasComponent}
];

@NgModule({
  declarations: [
      DeliveryAreasComponent
  ],
  imports: [
      NativeScriptCommonModule,
      NativeScriptRouterModule,
      NativeScriptRouterModule.forChild(routes),
      SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DeliveryAreasModule { }
