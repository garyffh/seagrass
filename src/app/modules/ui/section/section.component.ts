import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ns-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss'],
    moduleId: module.id
})
export class SectionComponent {

    @Input() label: string;
    @Input() icon: string = '';
    @Input() centerHeading = false;
    @Output() iconTap: EventEmitter<void> = new EventEmitter<void>();

    onIconTap(): void {
        this.iconTap.emit();
    }

}
