import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ns-special-accordion',
    moduleId: module.id,
    templateUrl: './special-accordion.component.html',
    styleUrls: ['./special-accordion.component.scss']
})
export class SpecialAccordionComponent {
    @Input() open: boolean;
    @Output() stateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    onTap() {
        this.open = !this.open;
        this.stateChange.emit(this.open);
    }
}
