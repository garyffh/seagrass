import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { SharedModule } from '~/app/modules/shared/shared.module';

import { HomeComponent } from './home/home.component';
import { SpecialListComponent } from './special-list/special-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { CustomiseComponent } from './customise/customise.component';
import { MainComponent } from './main/main.component';
import { ProductImageComponent } from './product-image/product-image.component';
import { SpecialAccordionComponent } from '~/app/modules/main/special-list/special-accordion/special-accordion.component';

const routes = [
    {
        path: '', component: MainComponent,
        children: [
            {path: '', component: HomeComponent},
            {path: 'customise', component: CustomiseComponent},
            {path: 'product-image/:id', component: ProductImageComponent}
        ]
    }
];

@NgModule({
    declarations: [
        HomeComponent,
        SpecialListComponent,
        SpecialAccordionComponent,
        ProductListComponent,
        ProductCategoryComponent,
        ProductItemComponent,
        CustomiseComponent,
        MainComponent,
        ProductImageComponent
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MainModule {
}
