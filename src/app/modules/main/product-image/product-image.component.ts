import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from 'nativescript-angular';

import { ViewService } from '~/app/services/view.service';
import { ErrorService } from '~/app/services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { ObservableProcess } from '~/app/modules/shared/infrastructure/observable-process';
import { OpenStatus, Sitem, TrnClientCustomersItem } from '~/app/services/app.models';
import { AppService } from '~/app/services/app.service';
import { ObservableProcessLateBind } from '~/app/modules/shared/infrastructure/observable-process-late-bind';
import { SwipeDirection, SwipeGestureEventData } from 'tns-core-modules/ui/gestures';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';
import { StoreStatusService } from '~/app/services/store-status.service';
import { BusinessService } from '~/app/services/business.service';
import { Page, View } from 'tns-core-modules/ui/page';
import { UtilityService } from '~/app/services/utility.service';

@Component({
    selector: 'ns-product-image',
    templateUrl: './product-image.component.html',
    styleUrls: ['./product-image.component.scss'],
    moduleId: module.id
})
export class ProductImageComponent extends ViewBase implements OnInit {

    @ViewChild('view', {static: false}) set controlElRef(view: ElementRef) {
        if (view) {
            this.view = view.nativeElement as View;
        } else {
            this.view = undefined;
        }
    }

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess === null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'Error getting image',
                this.appService.sitemFind(this.id),
                (view: ProductImageComponent, data: Sitem) => {
                    view.appService.pagePosition = data.pagePosition;
                    view.model = data;
                }
            );
        }

        return this.fGetEntityProcess;
    }

    get previousProcess(): ObservableProcessLateBind {

        if (this.fPreviousProcess === null) {
            this.fPreviousProcess = new ObservableProcessLateBind(this, 'error getting product');
        }

        return this.fPreviousProcess;

    }

    get nextProcess(): ObservableProcessLateBind {

        if (this.fNextProcess === null) {
            this.fNextProcess = new ObservableProcessLateBind(this, 'error getting product');
        }

        return this.fNextProcess;

    }

    private animationDuration = 300;
    private routeIdKey = 'id';
    private fGetEntityProcess: ObservableProcess = null;
    private fPreviousProcess: ObservableProcessLateBind = null;
    private fNextProcess: ObservableProcessLateBind = null;

    constructor(public appService: AppService,
                public storeStatusService: StoreStatusService,
                public businessService: BusinessService,
                public utilityService: UtilityService,
                public viewContainerRef: ViewContainerRef,
                public modalService: ModalDialogService,
                private page: Page,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {
        super(viewService, errorService, router, route);

    }

    view: View;

    id: string;
    model: Sitem = null;

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.id = params[this.routeIdKey];

            if (this.appService.pagePosition <= 0) {
                this.getEntityProcess.do();
            } else {
                if (this.appService.pagePosition !== 1) {
                    this.appService.pagePosition--;
                    this.onNext();
                } else {
                    this.onPrevious();
                }
            }

        });

    }

    onPrevious(): void {

        if (this.view) {

            this.view.animate({opacity: .5, duration: 200})
                .then(
                    () => this.view.animate({
                    scale: {x: .95, y: .95},
                    duration: this.animationDuration
                }))
                .then(() => {

                    this.previousProcess.doLateBind(
                        this.appService.sitemPrevious(this.appService.pagePosition),
                        (view: ProductImageComponent, data: Sitem) => {
                            view.appService.pagePosition = data.pagePosition;
                            view.model = data;
                        });

                })
                .then(
                    () => {
                        if (this.view) {
                            this.view.animate({
                                scale: {x: 1, y: 1},
                                duration: this.animationDuration
                            });
                        }
                    })
                .then(() => {
                    if (this.view) {
                        this.view.animate(
                            {opacity: 1, duration: 0});
                    }
                });

        } else {

            this.previousProcess.doLateBind(
                this.appService.sitemPrevious(this.appService.pagePosition),
                (view: ProductImageComponent, data: Sitem) => {
                    view.appService.pagePosition = data.pagePosition;
                    view.model = data;
                });

        }
    }

    onNext(): void {

        if (this.view) {

            this.view.animate({opacity: .5, duration: 200})
                .then(
                    () => this.view.animate({
                        scale: {x: .95, y: .95},
                        duration: this.animationDuration
                }))
                .then(() => {

                    this.nextProcess.doLateBind(
                        this.appService.sitemNext(this.appService.pagePosition),
                        (view: ProductImageComponent, data: Sitem) => {
                            view.appService.pagePosition = data.pagePosition;
                            view.model = data;
                        });

                })
                .then(
                        () => {
                        if (this.view) {
                            this.view.animate({
                                scale: {x: 1, y: 1},
                                duration: this.animationDuration
                            });
                        }
                })
                .then(() => {
                    if (this.view) {
                        this.view.animate(
                            {opacity: 1, duration: 0});
                    }
                });

        } else {

            this.nextProcess.doLateBind(
                this.appService.sitemNext(this.appService.pagePosition),
                (view: ProductImageComponent, data: Sitem) => {
                    view.appService.pagePosition = data.pagePosition;
                    view.model = data;
                });

        }

    }

    onSwipe(event: SwipeGestureEventData): void {

        if (event.direction === SwipeDirection.left) {
            this.onNext();
        }

        if (event.direction === SwipeDirection.right) {

            this.onPrevious();

        }

    }

    customise() {

        if (this.storeStatusService.storeStatus.openStatus === OpenStatus.open) {

            const item: TrnClientCustomersItem = this.appService.data.cartTransaction.addToCart(this.model);

            if (!item) {
                return;
            }

            this.appService.trialData = item;
            this.router.navigate(['main', 'customise']);

        } else {

            const options: ModalDialogOptions = {
                context: this.businessService.getOpenStatusMessage(this.storeStatusService.storeStatus.openStatus),
                fullscreen: false,
                viewContainerRef: this.viewContainerRef
            };

            this.modalService.showModal(MessageDialogComponent, options);

        }
    }

}
