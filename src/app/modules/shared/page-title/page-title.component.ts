import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ns-page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.scss'],
    moduleId: module.id
})
export class PageTitleComponent {

    @Input() title: string;

}
