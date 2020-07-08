import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';

import { UiModule } from '~/app/modules/ui/ui.module';

import { DateFormatPipe } from './pipes/date-format.pipe';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { DayMonthPipe } from './pipes/day-month-format.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { BoolIconPipe } from './pipes/bool-icon.pipe';
import { TimeExceptionPipe } from './pipes/time-exception.pipe';
import { TimeExceptionHeadingPipe } from './pipes/time-exception-heading.pipe';

import { ErrorPanelComponent } from './error-panel/error-panel.component';
import { ShoppingCartWidgetComponent } from './shopping-cart-widget/shopping-cart-widget.component';
import { DeliveryMethodComponent } from './delivery-method/delivery-method.component';
import { StoreStatusComponent } from './store-status/store-status.component';
import { ProductCustomiseDialogComponent } from './product-customise-dialog/product-customise-dialog.component';
import { ProductCustomiseComponent } from './product-customise/product-customise.component';
import { ProductCondimentSelectComponent } from './product-condiment-select/product-condiment-select.component';
import { ProductInstructionsComponent } from './product-instructions/product-instructions.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { CardComponent } from './card/card.component';
import { AddressViewComponent } from './address-view/address-view.component';
import { AddressUpdateComponent } from './address-update/address-update.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ShoppingCartEmptyComponent } from './shopping-cart-empty/shopping-cart-empty.component';
import { DayMonthTimePipe } from '~/app/modules/shared/pipes/day-month-time.pipe';
import { ListItemComponent } from './list-item/list-item.component';
import { UserTabComponent } from './user-tab/user-tab.component';
import { DeliveryAreaTapComponent } from './delivery-area-tap/delivery-area-tap.component';
// tslint:disable-next-line:max-line-length
import { RemoveProductDialogComponent } from './product-customise/remove-product-dialog/remove-product-dialog.component';
import { StoreBannerComponent } from '~/app/modules/shared/store-banner/store-banner.component';
import { ProductCondimentTableComponent } from '~/app/modules/shared/product-customise/product-condiment-table/product-condiment-table.component';
import { CreditCardViewModule } from 'nativescript-stripe/angular';

@NgModule({
    declarations: [
        BoolIconPipe,
        DateFormatPipe,
        DateTimeFormatPipe,
        DayMonthTimePipe,
        DayMonthPipe,
        TimeFormatPipe,
        TimeExceptionPipe,
        TimeExceptionHeadingPipe,
        ErrorPanelComponent,
        ShoppingCartWidgetComponent,
        DeliveryMethodComponent,
        StoreStatusComponent,
        ProductCustomiseDialogComponent,
        ProductCustomiseComponent,
        ProductCondimentSelectComponent,
        ProductInstructionsComponent,
        ActionBarComponent,
        ShoppingCartComponent,
        PageTitleComponent,
        CardComponent,
        AddressViewComponent,
        AddressUpdateComponent,
        MessageDialogComponent,
        ShoppingCartEmptyComponent,
        ListItemComponent,
        UserTabComponent,
        DeliveryAreaTapComponent,
        RemoveProductDialogComponent,
        StoreBannerComponent,
        ProductCondimentTableComponent
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        NativeScriptUIListViewModule,
        NativeScriptUIAutoCompleteTextViewModule,
        CreditCardViewModule,
        UiModule
    ],
    exports: [
        BoolIconPipe,
        DateFormatPipe,
        DateTimeFormatPipe,
        DayMonthTimePipe,
        DayMonthPipe,
        TimeFormatPipe,
        TimeExceptionPipe,
        TimeExceptionHeadingPipe,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        NativeScriptUIListViewModule,
        NativeScriptUIAutoCompleteTextViewModule,
        UiModule,
        ErrorPanelComponent,
        ShoppingCartWidgetComponent,
        StoreStatusComponent,
        ProductCustomiseDialogComponent,
        ProductCustomiseComponent,
        ActionBarComponent,
        ShoppingCartComponent,
        PageTitleComponent,
        CardComponent,
        AddressViewComponent,
        AddressUpdateComponent,
        MessageDialogComponent,
        ShoppingCartEmptyComponent,
        ListItemComponent,
        UserTabComponent,
        StoreBannerComponent
    ],
    entryComponents: [
        ProductCustomiseDialogComponent,
        RemoveProductDialogComponent,
        MessageDialogComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {
}
