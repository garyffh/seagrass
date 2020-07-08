import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TrnCondimentTable, TrnCondimentTablesItem } from '~/app/services/app.models';

@Component({
    selector: 'ns-product-condiment-select',
    templateUrl: './product-condiment-select.component.html',
    styleUrls: ['./product-condiment-select.component.scss'],
    moduleId: module.id
})
export class ProductCondimentSelectComponent implements OnInit {

    constructor(public ref: ChangeDetectorRef) {
    }

    @Output() cartUpdate = new EventEmitter();
    @Input() trnCondimentTable: TrnCondimentTable;

    loaded = false;

    ngOnInit() {
        this.loaded = true;

    }

    onChangeSelection(item: TrnCondimentTablesItem) {

        if (this.trnCondimentTable.isSingleSelection) {
         if (!item.selected) {
             this.trnCondimentTable.unSelectAll();
             item.selected = true;
             this.cartUpdate.emit();
         }

        } else {
            item.selected = !item.selected;
            this.cartUpdate.emit();
        }
    }

}
