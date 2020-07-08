import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { ObservableProcess } from '../../shared/infrastructure/observable-process';
import { ErrorService } from '../../../services/error.service';

import { UtilityService } from '~/app/services/utility.service';
import { AuthenticationService } from '~/app/services/authentication.service';
import { AppService } from '~/app/services/app.service';
import { ViewService } from '~/app/services/view.service';

import { DeliveryMethodType, DialogMessage } from '../../../services/app.models';
import { AddressModel } from '../../shared/address-update/address-update.component';
import { UserService } from '../services/user.service';
import {
    TrnOrder, TrnOrderRead,
    TrnOrdersDriverModel,
    TrnOrdersItem, TrnOrderUpdateModel,
    TrnOrderUserAllocateDriverModel
} from '../services/user.models';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';
import { AppGlobals } from '~/app/modules/shared/infrastructure/app-initialise';

@Component({
    selector: 'ns-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    moduleId: module.id
})
export class OrderDetailComponent extends ViewBase implements OnInit, OnDestroy {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting order',
                this.userService.userOrderFind(this.id),
                (view: OrderDetailComponent, data: TrnOrder) => {

                    view.model = data;

                    view.address.addressNote = view.model.addressNote;
                    view.address.company = view.model.company;
                    view.address.companyNumber = view.model.companyNumber;
                    view.address.street = view.model.street;
                    view.address.extended = view.model.extended;
                    view.address.locality = view.model.locality;
                    view.address.region = view.model.region;
                    view.address.postalCode = view.model.postalCode;
                    view.address.country = view.model.country;
                    view.address.lat = view.model.lat;
                    view.address.lng = view.model.lng;
                    view.address.distance = view.model.distance;

                    if (view.model) {
                        view.listItems = new ObservableArray<TrnOrdersItem>(view.model.items);
                    } else {
                        view.listItems = new ObservableArray<TrnOrdersItem>([]);
                    }

                    // console.error('deliveryMethodStatus', view.model.deliveryMethodStatus);
                    // console.error('deliveryMethodType', view.model.deliveryMethodType);
                    // console.error('storeStatus', view.model.storeStatus);
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    private userStateSubscription: Subscription = null;
    private userAllocateDriverSubscription: Subscription = null;

    private routeIdKey = 'id';
    private fGetEntityProcess: ObservableProcess = null;

    constructor(public userService: UserService,
                public authenticationService: AuthenticationService,
                public appService: AppService,
                public utilityService: UtilityService,
                public changeDectorRef: ChangeDetectorRef,
                public modalService: ModalDialogService,
                public viewContainerRef: ViewContainerRef,
                public ngZone: NgZone,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.userStateSubscription = AppGlobals.instance.userStateEvent
            .subscribe((message: TrnOrderUpdateModel) => {

                if (this.model.trnOrderId === message.trnOrderId) {
                    this.model.deliveryMethodStatus = message.deliveryMethodStatus;
                    this.changeDectorRef.detectChanges();
                }

            });

        this.userAllocateDriverSubscription = AppGlobals.instance.userAllocateDriverEvent
            .subscribe((message: TrnOrderUserAllocateDriverModel) => {

                if (this.model.trnOrderId === message.trnOrderId) {

                    const driver = new TrnOrdersDriverModel();
                    driver.plate = message.plate;
                    driver.make = message.make;
                    driver.model = message.model;
                    driver.colour = message.colour;

                    this.model.deliveryMethodStatus = message.deliveryMethodStatus;
                    this.model.driver = driver;

                    this.changeDectorRef.detectChanges();
                }

            });

    }

    DeliveryMethodType = DeliveryMethodType;

    id: string;
    model: TrnOrder = null;

    address: AddressModel = new AddressModel();

    listItems: ObservableArray<TrnOrdersItem> = null;

    ngOnInit() {

        this.route.params.subscribe((params) => {
            this.id = params[this.routeIdKey];
            this.getEntityProcess.do();

        });

    }

    ngOnDestroy(): void {

        if (this.userStateSubscription !== null) {
            this.userStateSubscription.unsubscribe();
        }

        if (this.userAllocateDriverSubscription !== null) {
            this.userAllocateDriverSubscription.unsubscribe();
        }

    }

    handleError(error: any, title?: string): void {

        let errorHandled = false;
        if (error.error) {
            if (error.error.Message) {
                if (error.error.Message === 'Not Found') {
                    errorHandled = true;

                    const options: ModalDialogOptions = {
                        context: new DialogMessage('Not Found', 'The order was not found'),
                        fullscreen: false,
                        viewContainerRef: this.viewContainerRef
                    };
                    this.modalService.showModal(MessageDialogComponent, options)
                        .then((result) => {
                            this.router.back();
                        });

                }
            }
        }

        if (!errorHandled) {
            super.handleError(error, title);
        }

    }
}
