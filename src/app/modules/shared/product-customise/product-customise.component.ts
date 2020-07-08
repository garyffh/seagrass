import { ChangeDetectorRef, Component, Input, OnInit, AfterViewInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from 'nativescript-angular';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { ListViewEventData } from 'nativescript-ui-listview';

import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { ErrorService } from '~/app/services/error.service';
import { ViewService } from '~/app/services/view.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';

import {
    DialogMessage,
    TranClientCustomerQtyChange,
    TrnCartDisplayItem,
    TrnClientCustomersItem,
    TrnCondimentTable,
    TrnCondimentTables
} from '~/app/services/app.models';
import { AppService } from '~/app/services/app.service';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';
import { RemoveProductDialogComponent } from '~/app/modules/shared/product-customise/remove-product-dialog/remove-product-dialog.component';
import { UtilityService } from '~/app/services/utility.service';

declare var UIView;
declare var NSMutableArray;
declare var NSIndexPath;

@Component({
    selector: 'ns-product-customise',
    templateUrl: './product-customise.component.html',
    styleUrls: ['./product-customise.component.scss'],
    moduleId: module.id
})
export class ProductCustomiseComponent extends ViewBase implements OnInit {

    get listItems(): Array<TrnCondimentTable> {

        if (this.fListItems === null) {
            if (this.trnClientCustomersItem.condimentTables) {
                this.fListItems = this.trnClientCustomersItem.condimentTables.condimentTables;
            } else {
                this.fListItems = [];
            }
        }

        return this.fListItems;
    }

    get getEntityProcess(): ObservableProcessLateBind {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcessLateBind(this, 'Error getting condiments');
        }

        return this.fGetEntityProcess;
    }

    private fGetEntityProcess: ObservableProcessLateBind = null;
    private fListItem1s: ObservableArray<TrnCondimentTable> = null;
    private fListItems: Array<TrnCondimentTable> = null;
    private lastExpandedItem: TrnCondimentTable = null;

    constructor(public appService: AppService,
                public ref: ChangeDetectorRef,
                public modalService: ModalDialogService,
                public viewContainerRef: ViewContainerRef,
                public utilityService: UtilityService,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

    }

    @Input() trnClientCustomersItem: TrnClientCustomersItem;
    @Input() allowZeroQuantity = true;

    loaded = false;

    ngOnInit() {

        if (this.trnClientCustomersItem.condimentTablesAllocated) {
            this.loaded = true;
            this.ref.detectChanges();

        } else {

            if (this.trnClientCustomersItem.isCondimentChain) {
                if (this.trnClientCustomersItem.sysCondimentChainId) {
                    this.getEntityProcess.doLateBind(
                        this.appService.transactionCondimentChainFind(this.trnClientCustomersItem.sysCondimentChainId),
                        (view: ProductCustomiseComponent, data: TrnCondimentTables) => {
                            view.trnClientCustomersItem.condimentTables = data;
                            view.trnClientCustomersItem.condimentTablesAllocated = true;

                            view.loaded = true;
                            view.ref.detectChanges();
                        });
                } else {
                    this.trnClientCustomersItem.condimentTablesAllocated = true;
                    this.loaded = true;
                    this.ref.detectChanges();
                }
            } else {
                if (this.trnClientCustomersItem.sysCondimentTableId) {

                    this.getEntityProcess.doLateBind(
                        this.appService.transactionCondimentTableFind(this.trnClientCustomersItem.sysCondimentTableId),
                        (view: ProductCustomiseComponent, data: TrnCondimentTables) => {
                            view.trnClientCustomersItem.condimentTables = data;
                            view.trnClientCustomersItem.condimentTablesAllocated = true;

                            view.loaded = true;
                            view.ref.detectChanges();
                        });

                } else {
                    this.trnClientCustomersItem.condimentTablesAllocated = true;
                    this.loaded = true;
                    this.ref.detectChanges();
                }
            }
        }

    }

    templateSelector(item: any, index: number, items: any): string {
        return item.expanded ? 'expanded' : 'default';
    }

    onOpenTable(index: number) {

        // this.appService.productsOpenedIndex = index;
        this.ref.detectChanges();

    }

    onItemTap1(event: ListViewEventData) {
        const listView = event.object;
        const rowIndex = event.index;
        const dataItem = event.view.bindingContext;

        if (!dataItem.expanded) {
            if (this.lastExpandedItem !== null) {
                this.lastExpandedItem.expanded = false;
            }
        } else {
            this.lastExpandedItem = null;
        }

        dataItem.expanded = !dataItem.expanded;

        if (isIOS) {
            const indexPaths = NSMutableArray.new();
            indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
            listView.ios.reloadItemsAtIndexPaths(indexPaths);

        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }

        if (this.lastExpandedItem !== null) {
            const lastSelectedRowIndex = this.listItems.indexOf(this.lastExpandedItem);

            if (isIOS) {
                const indexPaths = NSMutableArray.new();
                indexPaths.addObject(NSIndexPath.indexPathForRowInSection(lastSelectedRowIndex, event.groupIndex));
                listView.ios.reloadItemsAtIndexPaths(indexPaths);

            }
            if (isAndroid) {
                listView.androidListView.getAdapter().notifyItemChanged(lastSelectedRowIndex);
            }

        }

        if (dataItem.expanded) {
           this.lastExpandedItem = dataItem;
        } else {
            this.lastExpandedItem = null;
        }

    }

    increment(): void {

        const change: TranClientCustomerQtyChange =
            new TranClientCustomerQtyChange(this.trnClientCustomersItem.itemNumber,
                this.trnClientCustomersItem.description, 1);

        this.appService.data.cartTransaction.qtyTranChange(change);
    }

    decrement(): void {

        if (this.trnClientCustomersItem.qty <= 1) {

            const options: ModalDialogOptions = {
                context: this.trnClientCustomersItem,
                fullscreen: false,
                viewContainerRef: this.viewContainerRef
            };
            this.modalService.showModal(RemoveProductDialogComponent, options)
                .then((data) => {
                        if (data === 'confirm') {

                            const change: TranClientCustomerQtyChange =
                                new TranClientCustomerQtyChange(this.trnClientCustomersItem.itemNumber,
                                    this.trnClientCustomersItem.description, -2);
                            this.appService.data.cartTransaction.qtyTranChange(change);
                            this.router.back();
                        }
                });

        } else {

            const change: TranClientCustomerQtyChange =
                new TranClientCustomerQtyChange(this.trnClientCustomersItem.itemNumber,
                    this.trnClientCustomersItem.description, -1);

            this.appService.data.cartTransaction.qtyTranChange(change);
        }

    }

    onCartUpdate() {

        this.appService.data.cartTransaction.customiseUpdate();

        // this.appService.data.cartTransaction.afterCustomiseUpdate();
    }

    onDone() {
        this.router.back();
    }

}
