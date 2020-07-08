import { Observable, Subject, of } from 'rxjs';
import { tap, map, delay } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

import { AppSettings } from './app.settings';

import {
    TrnClientCustomerAdd,
    TrnClientCustomersItem,
    CondimentChain,
    CondimentChainDetail,
    CondimentTable,
    SitemRead,
    Sitem,
    StoreCategoryRead,
    TranClientCustomerQtyChange,
    SitemQtyChange,
    SitemBase,
    TrnCondimentTables,
    StoreTime, StoreTimeRead,
    StoreTradingExceptionRead,
    SitemSearch, StoreStatus, SitemImage
} from '../services/app.models';

import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { BusinessService } from './business.service';
import { StoreStatusService } from './store-status.service';

export class Data {

    constructor(public cartTransaction: TrnClientCustomerAdd) {
    }
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    get specialsOpen(): boolean {
        return this.fSpecialsOpen;
    }

    set specialsOpen(value: boolean) {
        if (value !== this.fSpecialsOpen) {
            if (value && this.productsOpenedIndex !== -1) {
                this.fProductsOpenedIndex = -1;
            }
            this.fSpecialsOpen = value;

        }
    }

    get productsOpenedIndex(): number {
        return this.fProductsOpenedIndex;
    }

    set productsOpenedIndex(value: number) {
        if (value !== this.fProductsOpenedIndex) {
            if (value !==  -1) {
                this.fSpecialsOpen = false;
            }

            this.fProductsOpenedIndex = value;
        }
    }

    get countries(): Array<any> {
        if (this.fCountries === null) {
            this.fCountries = this.getCountries();
        }

        return this.fCountries;
    }

    private fCountries: Array<any> = null;

    constructor(public authenticationService: AuthenticationService,
                public appSettings: AppSettings,
                public businessService: BusinessService,
                public storeStatusService: StoreStatusService,
                public httpService: HttpService,
                public storageService: StorageService,
                public http: HttpClient) {

    }

    debugUrl = 'assets/data/';

    appTitle;
    data: Data = null;

    fSpecialsOpen = false;
    fProductsOpenedIndex = -1;

    actionBarMenuOpen = false;
    appDataLoaded = false;
    trialData: TrnClientCustomersItem = null;
    pagePosition = 1;
    userTabSelectedIndex = 2;
    driverTabSelectedIndex = 2;

    loadCart() {
        if (!this.data) {
            this.data = new Data(
           TrnClientCustomerAdd.loadFromStorage(this.businessService, this.authenticationService, this.storageService));

        }
    }

    saveCart() {
        this.data.cartTransaction.save();
    }

    storeCategoriesRead(): Observable<Array<StoreCategoryRead>> {
        return this.httpService.httpGetWithModel<Array<StoreCategoryRead>>(`store-category`);

    }

    sitemsReadFirstCategory(): Observable<Array<SitemRead>> {

        return this.httpService.httpGetWithModel(`sitem/first-store-category`)
            .pipe(
                map((data: Array<SitemRead>) => SitemRead.getList(this.businessService,
                    this.authenticationService, data))
            );

    }

    sitemsRead(sysStoreCategoryId: string): Observable<Array<SitemRead>> {

        return this.httpService.httpGetWithModel(`sitem/by-store-category/${sysStoreCategoryId}`)
            .pipe(
//          delay( 3000 ),
                map((data: Array<SitemRead>) => SitemRead.getList(this.businessService,
                    this.authenticationService, data))
            );

    }

    sitemsSearchRead(sysStoreCategoryId: string, searchString: string): Observable<Array<SitemRead>> {

        const apiModel: SitemSearch = new SitemSearch();
        apiModel.sysStoreCategoryId = sysStoreCategoryId;
        apiModel.searchString = searchString;

        return this.httpService.httpPutWithModel(`sitem/search`, apiModel)
            .pipe(
                map((data: Array<SitemRead>) =>
                    SitemRead.getList(this.businessService, this.authenticationService, data))
            );

    }

    specialsRead(): Observable<Array<SitemRead>> {
        return this.httpService.httpGet(`sitem/specials`)
            .pipe(
                map((data: Array<SitemRead>) =>
                    SitemRead.getList(this.businessService, this.authenticationService, data))
            );
    }

    sitemFind(sysSitemId: string): Observable<Sitem> {
        return this.httpService.httpGet(`sitem/${sysSitemId}`)
            .pipe(
                map((data: Sitem) => new Sitem(this.businessService, this.authenticationService, data))
            );

    }

    sitemPrevious(pagePosition: number): Observable<Sitem> {
        return this.httpService.httpGet(`sitem/previous/${pagePosition}`)
            .pipe(
                map((data: Sitem) => new Sitem(this.businessService, this.authenticationService, data))
            );

    }

    sitemNext(pagePosition: number): Observable<Sitem> {
        return this.httpService.httpGet(`sitem/next/${pagePosition}`)
            .pipe(
                map((data: Sitem) => new Sitem(this.businessService, this.authenticationService, data))
            );

    }

    sitemImageFind(sysSitemId: string): Observable<SitemImage> {

        return this.httpService.httpGet(`sitem/image/${sysSitemId}`)
            .pipe(
                map((data: SitemImage) => new SitemImage(data))
            );

    }

    condimentTableFind(sysCondimentTableId: string): Observable<CondimentTable> {

        return this.httpService.httpGet(`condiment-table/${sysCondimentTableId}`)
            .pipe(
                map((data: CondimentTable) => new CondimentTable(this.businessService,
                    this.authenticationService, data))
            );

    }

    transactionCondimentTableFind(sysCondimentTableId: string): Observable<TrnCondimentTables> {

        return this.httpService.httpGet(`condiment-table/${sysCondimentTableId}`)
            .pipe(
                // delay( 3000 ),
                map((data: CondimentTable) => new TrnCondimentTables(this.businessService,
                    this.authenticationService, data))
            );

    }

    condimentChainFind(sysCondimentChainId: string): Observable<CondimentChain> {

        return this.httpService.httpGetWithModel<CondimentChain>(`condiment-chain/${sysCondimentChainId}`);

    }

    condimentChainDetailFind(sysCondimentChainId: string): Observable<CondimentChainDetail> {

        return this.httpService.httpGet(`condiment-chain/detail/${sysCondimentChainId}`)
            .pipe(
                map((data: CondimentChainDetail) =>
                    new CondimentChainDetail(this.businessService, this.authenticationService, data))
            );

    }

    transactionCondimentChainFind(sysCondimentChainId: string): Observable<TrnCondimentTables> {

        return this.httpService.httpGet(`condiment-chain/detail/${sysCondimentChainId}`)
            .pipe(
                // delay( 3000 ),
                map((data: CondimentChainDetail) =>
                    new TrnCondimentTables(this.businessService, this.authenticationService, data))
            );

    }

    allStoreTimes(): Observable<Array<StoreTimeRead>> {

        return this.httpService.httpGetWithModel<Array<StoreTimeRead>>('store-time');

    }

    allDeliveryTimes(): Observable<Array<StoreTimeRead>> {

        return this.httpService.httpGetWithModel<Array<StoreTimeRead>>('delivery-time');

    }

    allStoreTradingExceptions(): Observable<Array<StoreTradingExceptionRead>> {

        return this.httpService.httpGetWithModel<Array<StoreTradingExceptionRead>>('store-trading-exception');

    }

    getCountries() {
        return [
            {name: 'Australia', code: 'AU'}
        ];
    }

    getDays() {
        return [
            {value: 0, day: 'Sunday'},
            {value: 1, day: 'Monday'},
            {value: 2, day: 'Tuesday'},
            {value: 3, day: 'Wednesday'},
            {value: 4, day: 'Thursday'},
            {value: 5, day: 'Friday'},
            {value: 6, day: 'Saturday'}
        ];
    }

}
