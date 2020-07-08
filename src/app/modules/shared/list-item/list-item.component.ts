import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ns-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss'],
    moduleId: module.id
})
export class ListItemComponent {

    @Input() heading: string;
    @Input() detail: string;

}
