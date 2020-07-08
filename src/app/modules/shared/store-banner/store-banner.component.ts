import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreBannerService } from '~/app/services/store-banner.service';
import { View } from 'tns-core-modules/ui/core/view';

@Component({
    selector: 'ns-store-banner',
    templateUrl: './store-banner.component.html',
    styleUrls: ['./store-banner.component.scss'],
    moduleId: module.id
})
export class StoreBannerComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('view', {static: false}) set controlElRef(view: ElementRef) {
        if (view) {
            this.view = view.nativeElement as View;
        } else {
            this.view = undefined;
        }
    }

    private animationDuration = 300;

    private storeBannerUpdateSubscription: Subscription = null;

    constructor(public storeBannerService: StoreBannerService,
                public changeDetectorRef: ChangeDetectorRef) {

    }
    @Input() height: number;

    view: View;

    ngOnInit(): void {

        this.storeBannerUpdateSubscription = this.storeBannerService.storeBannerUpdate$
            .subscribe(
                (data) => {
                    this.changeDetectorRef.detectChanges();
                }
            );

    }

    ngOnDestroy(): void {
        if (this.storeBannerUpdateSubscription !== null) {
            this.storeBannerUpdateSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        if (this.view) {

            this.view.animate({scale: {x: .9, y: .9}, duration: this.animationDuration })
                .then(
                    () => {
                        if (this.view) {
                            this.view.animate({
                                scale: {x: 1, y: 1},
                                duration: this.animationDuration
                            });
                        }
                    });
        }

    }

}
