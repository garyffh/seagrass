import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ns-accordion',
    moduleId: module.id,
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
    @Input() icon: string;
    @Input() label: string;
    @Input() open: boolean;
    @Output() stateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    onTap() {
        this.open = !this.open;
        this.stateChange.emit(this.open);
    }
}
