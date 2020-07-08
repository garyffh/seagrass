import {
    Component,
    OnInit,
    Input,
    ChangeDetectorRef
} from '@angular/core';
import { TrnClientCustomersItem } from '~/app/services/app.models';
import { dismissSoftKeyboard } from '~/app/modules/shared/infrastructure/utilities';

@Component({
    selector: 'ns-product-instructions',
    templateUrl: './product-instructions.component.html',
    styleUrls: ['./product-instructions.component.scss'],
    moduleId: module.id
})
export class ProductInstructionsComponent {

    constructor(public ref: ChangeDetectorRef) {
    }

    @Input() trnClientCustomersItem: TrnClientCustomersItem;

    expanded = false;

    onAccordionTap(event) {
        this.ref.detectChanges();
    }

    onDone() {
        // dismissSoftKeyboard();
    }

}
