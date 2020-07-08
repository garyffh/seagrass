import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TrnCondimentTable } from '~/app/services/app.models';

@Component({
    selector: 'ns-product-condiment-table',
    templateUrl: './product-condiment-table.component.html',
    styleUrls: ['./product-condiment-table.component.scss'],
    moduleId: module.id
})
export class ProductCondimentTableComponent {
    @Input() icon: string;
    @Input() trnCondimentTable: TrnCondimentTable;
    @Input() open: boolean = false;
    @Output() stateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    onTap() {
        this.open = !this.open;
        this.stateChange.emit(this.open);
    }
}
