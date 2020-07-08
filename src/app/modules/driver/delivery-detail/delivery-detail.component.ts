import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { Directions } from 'nativescript-directions';

import { ObservableProcess } from '../../shared/infrastructure/observable-process';
import { ErrorService } from '../../../services/error.service';
import { ViewBase } from '~/app/modules/shared/infrastructure/view-base';

import { UtilityService } from '~/app/services/utility.service';
import { ViewService } from '~/app/services/view.service';

import { DriverService } from '~/app/modules/driver/services/driver.service';
import { DeliveryMethodType } from '~/app/services/app.models';
import { TrnDeliveriesItem, TrnDelivery } from '~/app/modules/driver/services/driver.models';
import { AddressModel } from '~/app/modules/shared/address-update/address-update.component';
import { TrnOrderStoreStatus, TrnOrderUpdateModel } from '~/app/modules/user/services/user.models';
import { BusinessService } from '~/app/services/business.service';
import { AppGlobals } from '~/app/modules/shared/infrastructure/app-initialise';

@Component({
  selector: 'ns-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.scss'],
  moduleId: module.id
})
export class DeliveryDetailComponent extends ViewBase implements OnInit, OnDestroy {

    get getEntityProcess(): ObservableProcess {

        if (this.fGetEntityProcess == null) {
            this.fGetEntityProcess = new ObservableProcess(this, 'error getting delivery',
                this.driverService.driverDeliveryFind(this.id),
                (view: DeliveryDetailComponent, data: TrnDelivery) => {
                    view.assignModel(view, data);
                },
                null
            );
        }

        return this.fGetEntityProcess;

    }

    get pickupActionVisible(): boolean {

        if (this.model === undefined || this.model === null) {
            return false;
        } else {
            return (this.model.storeStatus === TrnOrderStoreStatus.waitingForDelivery);
        }

    }

    get deliverActionVisible(): boolean {

        if (this.model === undefined || this.model === null) {
            return false;
        } else {
            return (this.model.storeStatus === TrnOrderStoreStatus.delivering);
        }

    }

    get showAddress(): boolean {

        if (this.model === undefined || this.model === null) {
            return false;
        } else {
            return this.model.storeStatus === TrnOrderStoreStatus.delivering;
        }

    }

    private driverStateSubscription: Subscription = null;

    private routeIdKey = 'id';
    private fGetEntityProcess: ObservableProcess = null;

    private mapAvailable(view: DeliveryDetailComponent): Promise<any> {
        return this.directions.available().then(
            (availiable) => {

                view.mapsAvailable = availiable as boolean;

            });
    }

    constructor(public driverService: DriverService,
                public utilityService: UtilityService,
                public businessService: BusinessService,
                public ngZone: NgZone,
                public changeDectorRef: ChangeDetectorRef,
                viewService: ViewService,
                errorService: ErrorService,
                router: RouterExtensions,
                route: ActivatedRoute) {

        super(viewService, errorService, router, route);

        this.mapAvailable(this);

        this.driverStateSubscription = AppGlobals.instance.driverStateEvent
            .subscribe((message: TrnOrderUpdateModel) => {

                if (this.model.trnOrderId === message.trnOrderId) {
                    this.model.storeStatus = message.storeStatus;
                    this.changeDectorRef.detectChanges();
                }

            });

  }

    mapsAvailable = false;
    directions: Directions = new Directions();

    DeliveryMethodType = DeliveryMethodType;

    id: string;
    model: TrnDelivery = null;

    address: AddressModel = new AddressModel();

    listItems: ObservableArray<TrnDeliveriesItem> = null;

    ngOnInit() {

        this.route.params.subscribe((params) => {
            this.id = params[this.routeIdKey];
            this.getEntityProcess.do();

        });
    }

    ngOnDestroy(): void {

        this.driverStateSubscription.unsubscribe();

    }

    assignModel(view: DeliveryDetailComponent, data: TrnDelivery) {

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
            view.listItems = new ObservableArray<TrnDeliveriesItem>(view.model.items);
        } else {
            view.listItems = new ObservableArray<TrnDeliveriesItem>([]);
        }

    }

    onActionConfirm(): void {

        if (this.model === undefined || this.model === null) {
            return;
        }

        if (this.model.storeStatus === TrnOrderStoreStatus.waitingForDelivery) {

            this.router.navigate(['/driver/drive-confirm', this.model.trnOrderId]);

        } else if (this.model.storeStatus === TrnOrderStoreStatus.delivering) {

            this.router.navigate(['/driver/deliver-confirm', this.model.trnOrderId]);

        }

    }

    onNavigation(): void {

        if (this.model === undefined || this.model === null) {
            return;
        }

        this.directions.navigate({
            // from: { // optional, default 'current location'
            //     lat: this.businessService.business.latitude,
            //     lng: this.businessService.business.longitude
            // },
            to: {
                lat: this.model.lat,
                lng: this.model.lng
            },
            type: 'driving', // optional, can be: driving, transit, bicycling or walking
            ios: {
                // tslint:disable-next-line:max-line-length
                preferGoogleMaps: true, // If the Google Maps app is installed, use that one instead of Apple Maps, because it supports waypoints. Default true.
                // tslint:disable-next-line:max-line-length
                allowGoogleMapsWeb: true // If waypoints are passed in and Google Maps is not installed, you can either open Apple Maps and the first waypoint is used as the to-address (the rest is ignored), or you can open Google Maps on web so all waypoints are shown (set this property to true). Default false.
            }
        }).then(() => {
            // console.error('Maps app launched.');
        }, (error) => {
            // console.log(error);
        });

    }

}
