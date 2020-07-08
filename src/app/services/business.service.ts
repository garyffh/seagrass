import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap, map} from 'rxjs/operators';

import {HttpService} from './http.service';
import {DialogMessage, OpenStatus, StoreCategoryRead, StoreStatus} from './app.models';

export class StoreDeliveryZone {
    storeDeliveryZoneId: string;
    name: string;
    number: number;
    deliveryDistance: number;
    deliveryFee: number;
    deliveryCost: number;
    walk: boolean;
    bicycle: boolean;
    drive: boolean;
}

export class ServerBusinessSettings {

    businessName: string;
    companyNumber: string;
    taxRate: number;
    phone: string;
    email: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    timeZone: string;
    deliveryDistance: number;
    topMenuCategories: number;
    priceLevel: number;
    pointRedemptionRatio: number;
    cardReadTypeId: number;
    minOrder: number;
    deliveryFee: number;
    minimumEftpos: number;
    tableService: boolean;
    paymentKey: string;
    googleApiKey: string;
    theme: string;
    newAccounts: boolean;
    promoRate: number;
    deliveryPromoEnabled: boolean;

    storeStatus: StoreStatus;
    storeDeliveryZones: Array<StoreDeliveryZone>;
    storeCategories: Array<StoreCategoryRead>;

}

export class BusinessSettings {

    constructor(value: ServerBusinessSettings) {

        this.businessName = value.businessName;
        this.companyNumber = value.companyNumber;
        this.taxRate = value.taxRate;
        this.phone = value.phone;
        this.email = value.email;
        this.street = value.street;
        this.extended = value.extended;
        this.locality = value.locality;
        this.region = value.region;
        this.postalCode = value.postalCode;
        this.country = value.country;
        this.latitude = value.latitude;
        this.longitude = value.longitude;
        this.timeZone = value.timeZone;
        this.deliveryDistance = value.deliveryDistance;
        this.topMenuCategories = value.topMenuCategories;
        this.priceLevel = value.priceLevel;
        this.pointRedemptionRatio = value.pointRedemptionRatio;
        this.cardReadTypeId = value.cardReadTypeId;
        this.minOrder = value.minOrder;
        this.deliveryFee = value.deliveryFee;
        if (value.minimumEftpos < .5) {
            this.minimumEftpos = .5; // stripe min
        } else {
            this.minimumEftpos = value.minimumEftpos;
        }
        this.tableService = value.tableService;
        this.paymentKey = value.paymentKey;
        this.googleApiKey = value.googleApiKey;
        this.theme = value.theme;
        this.newAccounts = value.newAccounts;
        this.promoRate = value.promoRate;
        this.deliveryPromoEnabled = value.deliveryPromoEnabled;

        this.storeDeliveryZones = value.storeDeliveryZones;
        this.storeCategories = value.storeCategories;
    }

    get usesDeliveryZones(): boolean {
        return this.storeDeliveryZones.length > 0;
    }

    get maxDeliveryDistance(): number {
        if (this.storeDeliveryZones.length > 0) {
            return this.storeDeliveryZones[this.storeDeliveryZones.length - 1].deliveryDistance;
        } else {
            return this.deliveryDistance;
        }
    }

    openingSoonMessage = 'We are preparing our online store, opening soon.';
    offlineMessage = 'We are offline and not taking online orders, sorry for the inconvenience, we will back soon.';
    driverNotAvailableMessage = 'All of our drivers are busy, our delivery service will resume shortly';
    deliveryOfflineMessage = 'Deliveries are offline, our delivery service will resume soon';
    storeOfflineMessage = 'Ordering ahead is offline, our order ahead service will resume shortly';

    cartOfflineMessage = 'We are offline and not taking online orders, sorry for the inconvenience, we will back soon.';
    cartClosedMessage = 'We are closed, please see our trading hours.';
    cartOpeningSoonMessage = 'We are preparing our online store, opening soon.';

    deliveryMethodInterval = 5;

    businessName: string;
    companyNumber: string;
    taxRate: number;
    phone: string;
    email: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    timeZone: string;
    deliveryDistance: number;
    topMenuCategories: number;
    priceLevel: number;
    pointRedemptionRatio: number;
    cardReadTypeId: number;
    minOrder: number;
    deliveryFee: number;
    minimumEftpos: number;
    tableService: boolean;
    paymentKey: string;
    googleApiKey: string;
    theme: string;
    newAccounts: boolean;
    promoRate: number;
    deliveryPromoEnabled: boolean;

    storeDeliveryZones: Array<StoreDeliveryZone>;
    storeCategories: Array<StoreCategoryRead>;

    getDeliveryZone(distance: number): StoreDeliveryZone {

        if (distance < 0) {
            return null;
        }

        if (this.storeDeliveryZones.length < 1) {
            return null;
        }

        if (distance > this.maxDeliveryDistance) {
            return null;
        }

        let rtn: StoreDeliveryZone = null;

        for (const zone of this.storeDeliveryZones) {
            if (distance <= zone.deliveryDistance) {
                rtn = {...zone};
                break;
            }
        }

        return rtn;

    }

}

@Injectable({
    providedIn: 'root'
})
export class BusinessService {

    get loaded(): boolean {
        return this.business !== null;
    }

    constructor(public httpService: HttpService) {

    }

    business: BusinessSettings = null;

    businessSettings(): Observable<ServerBusinessSettings> {

        return this.httpService.httpGetWithModel<ServerBusinessSettings>('business-settings')
            .pipe(
                tap((result) => {
                    this.business = new BusinessSettings(result);
                })
            );

    }

    getOpenStatusMessage(value: OpenStatus): DialogMessage {
        switch (value) {

            case OpenStatus.offline:
                return new DialogMessage('Offline', this.business.deliveryOfflineMessage);

            case OpenStatus.openingSoon:
                return new DialogMessage('Closed', this.business.openingSoonMessage);

            case OpenStatus.closed:
                return new DialogMessage('Closed', this.business.cartClosedMessage);

            default:
                return new DialogMessage('Error', 'error');

        }
    }

}
