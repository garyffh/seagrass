import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { IconPipe } from './pipes/icon.pipe';

import { AccordionComponent } from './accordion/accordion.component';
import { FloatLabelComponent } from './float-label/float-label.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { DialogComponent } from './dialog/dialog.component';
import { SectionComponent } from './section/section.component';
import { SixDigitEntryComponent } from '~/app/modules/ui/six-digit-entry/six-digit-entry.component';

@NgModule({
    declarations: [
        IconPipe,
        AccordionComponent,
        FloatLabelComponent,
        SpinnerComponent,
        DialogComponent,
        SectionComponent,
        SixDigitEntryComponent
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        ReactiveFormsModule

    ],
    exports: [
        IconPipe,
        AccordionComponent,
        FloatLabelComponent,
        SpinnerComponent,
        DialogComponent,
        SectionComponent,
        SixDigitEntryComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class UiModule {
}
