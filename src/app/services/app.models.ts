import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { BusinessService } from './business.service';

export class DialogMessage {

    constructor(public title: string,
                public detail: string) {

    }

}

export class StoreTimesInterval {
    number: number;
    fromTime: string;
    toTime: string;
    interval: string;
}

export class StoreTime {

    sysStoreTimeId: number = null;
    day: string;

    intervals: Array<StoreTimesInterval>;

}

export class StoreTimeRead {

    sysStoreTimeId: number;
    day: string;
    number: number;
    fromTime: string;
    toTime: string;
}

export class DeliveryTimesInterval {
    number: number;
    fromTime: string;
    toTime: string;
    interval: string;
}

export class DeliveryTime {

    sysDeliveryTimeId: number = null;
    day: string;

    intervals: Array<DeliveryTimesInterval>;

}

export class DeliveryTimeRead {

    sysDeliveryTimeId: number;
    day: string;
    number: number;
    fromTime: string;
    toTime: string;
}

export class StoreTradingExceptionRead {

    constructor(value: StoreTradingExceptionRead) {
        this.sysStoreTradingExceptionId = value.sysStoreTradingExceptionId;
        this.name = value.name;
        this.startTime = moment(value.startTime);
        this.endTime = moment(value.endTime);
        this.store = value.store;
        this.delivery = value.delivery;
        this.closed = value.closed;
    }

    sysStoreTradingExceptionId: string;
    name: string;
    startTime: Moment;
    endTime: Moment;
    store: boolean;
    delivery: boolean;
    closed: boolean;
}

export class StoreBanner {

    constructor(value: StoreBanner | null) {

        if (value !== null) {

            this.id = value.id;
            this.imageType = value.imageType;
            this.imageData = value.imageData;
            this.imageHash = value.imageHash;

            switch (this.imageType) {

                default: {
                    this.imgSource = 'data:image/jpeg;base64,' + this.imageData;
                    break;
                }

            }
        }

    }

    id: number;
    imageType: number;
    imageData: any;
    imageHash: any;

    imgSource: string;

}

export enum OpenStatus { open, offline, closed, openingSoon }

export enum DeliveryMethodType { store = 0, delivery = 1, table = 2 }

export enum DeliveryMethodOpenStatus { closed, open, schedule }

export class DeliveryMethodInterval {

    constructor(value: DeliveryMethodInterval) {

        this.typeId = value.typeId;
        this.dayId = value.dayId;
        this.fromTime = moment(value.fromTime);
        this.toTime = moment(value.toTime);
        this.store = value.store;
        this.delivery = value.delivery;
        this.closed = value.closed;

    }

    typeId: number;
    dayId: number;
    fromTime: Moment;
    toTime: Moment;
    store: boolean;
    delivery: boolean;
    closed: boolean;

}

export class DeliveryMethodTimes {

    get displayTimes(): string {
        switch (this.openStatus) {
            case DeliveryMethodOpenStatus.schedule: {

                if (this.times.length === 0) {
                    return 'closed';
                } else if (this.times.length === 1) {
                    return `from ${this.times[0].fromTime.format('h:mma')} - ${this.times[0].toTime.format('h:mma')}`;
                } else {
                    /* tslint:disable-next-line */
                    return `from ${this.times[0].fromTime.format('h:mma')} - ${this.times[0].toTime.format('h:mma')} and ${this.times[1].fromTime.format('h:mma')} - ${this.times[1].toTime.format('h:mma')}`;
                }
                break;
            }

            case DeliveryMethodOpenStatus.open: {

                if (this.times.length === 0) {
                    return 'closed';
                } else if (this.times.length === 1) {
                    return `until ${this.times[0].toTime.format('h:mma')}`;
                } else {
                    /* tslint:disable-next-line */
                    return `until ${this.times[0].toTime.format('h:mma')} and ${this.times[1].fromTime.format('h:mma')} - ${this.times[1].toTime.format('h:mma')}`;
                }
                break;
            }

            default: {
                return 'closed';
                break;
            }
        }

    }

    constructor(value: DeliveryMethodTimes) {

        this.type = value.type;
        this.openStatus = value.openStatus;

        this.times = [];
        for (const i of value.times) {
            this.times.push(new DeliveryMethodInterval(i));
        }

    }

    type: DeliveryMethodType;
    times: Array<DeliveryMethodInterval>;
    openStatus: DeliveryMethodOpenStatus;
}

export class StoreState {

    storeAvailable: boolean;
    deliveryAvailable: boolean;
    manualStoreOnline: boolean;
    manualDeliveryOnline: boolean;
    storeOnline: boolean;
    driverAvailable: boolean;
    storePrepTime: number;
    storeLiveTime: number;
    driverDeliveryTime: number;
    driverLiveTime: number;
    messageTitle: string;
    message: string;

}

export class StoreStatusFind {

    timeZone: string;
}

export class StoreStatus {

    constructor(value: StoreStatus) {

        this.statusTime = moment(value.statusTime);
        this.storeState = value.storeState;
        this.storeTimes = new DeliveryMethodTimes(value.storeTimes);
        this.deliveryTimes = new DeliveryMethodTimes(value.deliveryTimes);
        this.openStatus = value.openStatus;

    }

    statusTime: Moment;
    storeState: StoreState;
    storeTimes: DeliveryMethodTimes;
    deliveryTimes: DeliveryMethodTimes;

    openStatus: OpenStatus;
}

export class TrnCartDeliveryMethodInterval {

    constructor(public intervalTime: Moment | string) {

    }

    get display(): string {
        if ((<Moment>this.intervalTime).format === undefined) {
            return <string>this.intervalTime;
        } else {
            return (<Moment>this.intervalTime).format('ddd h:mma');
        }
    }
}

export class TrnCheckoutDeliveryMethod {

    private updateTimes(businessService: BusinessService, storeStatus: StoreStatus) {

        this.storeStatusTime = moment(storeStatus.statusTime);
        this.storeStatus = storeStatus.storeTimes.openStatus;

        this.storeTimes = [];
        if (storeStatus.storeTimes.times.length > 0) {

            if (storeStatus.storeTimes.openStatus === DeliveryMethodOpenStatus.open) {
                this.storeTimes.push(new TrnCartDeliveryMethodInterval('ASAP'));
            }

            const storeStartTime = moment(storeStatus.statusTime.format('YYYY-MM-DD:THH:mm:ss'), 'YYYY-MM-DD:THH:mm:ss')
                .add(storeStatus.storeState.storePrepTime, 'minutes');

            for (const i of storeStatus.storeTimes.times) {
                let intervalTime: Moment = moment(i.fromTime.format('YYYY-MM-DD:THH:mm:ss'), 'YYYY-MM-DD:THH:mm:ss');
                while (intervalTime < i.toTime) {

                    if (intervalTime > storeStartTime) {
                        this.storeTimes.push(new TrnCartDeliveryMethodInterval(intervalTime));
                    }
                    intervalTime = moment(intervalTime.add(businessService.business.deliveryMethodInterval, 'minutes')
                        .format('YYYY-MM-DD:THH:mm:ss'), 'YYYY-MM-DD:THH:mm:ss');

                }
            }

        }

        this.deliveryTimes = [];

        if (storeStatus.deliveryTimes.times.length > 0) {

            if (storeStatus.deliveryTimes.openStatus === DeliveryMethodOpenStatus.open) {
                this.deliveryTimes.push(new TrnCartDeliveryMethodInterval('ASAP'));
            }

            const deliveryStartTime = moment(storeStatus.statusTime.format('YYYY-MM-DD:THH:mm:ss'), 'YYYY-MM-DD:THH:mm:ss')
                .add(storeStatus.storeState.storePrepTime + storeStatus.storeState.driverDeliveryTime, 'minutes');

            for (const i of storeStatus.deliveryTimes.times) {

                let intervalTime: Moment = moment(i.fromTime.format('YYYY-MM-DD:THH:mm:ss'), 'YYYY-MM-DD:THH:mm:ss');
                while (intervalTime < i.toTime) {

                    if (intervalTime > deliveryStartTime) {
                        this.deliveryTimes.push(new TrnCartDeliveryMethodInterval(intervalTime));
                    }
                    intervalTime = moment(intervalTime.add(businessService.business.deliveryMethodInterval, 'minutes')
                        .format('YYYY-MM-DD:THH:mm:ss'), 'YYYY-MM-DD:THH:mm:ss');

                }

            }

        }

    }

    constructor(businessService: BusinessService,
                storeStatus: StoreStatus) {

        this.updateTimes(businessService, storeStatus);

    }

    storeStatusTime: Moment;
    storeStatus: DeliveryMethodOpenStatus;

    storeTimes: Array<TrnCartDeliveryMethodInterval> = [];
    deliveryTimes: Array<TrnCartDeliveryMethodInterval> = [];

    update(businessService: BusinessService, storeStatus: StoreStatus) {

        // could check for selected time.
        this.updateTimes(businessService, storeStatus);

    }

}

export class StoreCategoryRead {
    sysStoreCategoryId: string;
    number: number;
    name: string;
    hasSubCategory = false;
    parentId = 0;
}

export class SitemSearch {
    sysStoreCategoryId: string;
    searchString: string;
}

export class SitemBase {

    get available(): boolean {
        if (this.inStockCount === null) {
            return true;
        } else {
            return this.inStockCount > 0;
        }
    }

    get availableDisplay(): string {
        if (this.inStockCount === null) {
            return 'Available';
        } else {
            if (this.inStockCount > 0) {
                return `${this.inStockCount} in stock`;
            } else {
                return 'Unavailable';
            }
        }
    }

    get isOnSpecial(): boolean {
        return this.specialPrice1 !== null;
    }

    get price(): number {

        if (this.isOnSpecial) {

            switch (this.businessService.business.priceLevel) {

                case  2: {
                    return this.specialPrice2;
                }

                case  3: {
                    return this.specialPrice3;
                }
                case  4: {
                    return this.specialPrice4;
                }
                case  5: {
                    return this.specialPrice5;
                }

                default: {
                    return this.specialPrice1;
                }

            }
        } else {

            switch (this.businessService.business.priceLevel) {

                case  2: {
                    return this.price2;
                }

                case  3: {
                    return this.price3;
                }
                case  4: {
                    return this.price4;
                }
                case  5: {
                    return this.price5;
                }

                default: {
                    return this.price1;
                }

            }
        }
    }

    get regularPrice(): number {

        switch (this.businessService.business.priceLevel) {

            case  2: {
                return this.price2;
            }

            case  3: {
                return this.price3;
            }
            case  4: {
                return this.price4;
            }
            case  5: {
                return this.price5;
            }

            default: {
                return this.price1;
            }

        }

    }

    protected deserialize(instanceData: any) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    constructor(private businessService: BusinessService,
                private authenticationService: AuthenticationService,
                instanceData: any) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    updateId: Uint8Array = null;
    sysSitemId: string = null;
    name: string = null;
    shortDescription: string = null;
    description: string = null;
    tax: number = null;
    price1: number = null;
    price2: number = null;
    price3: number = null;
    price4: number = null;
    price5: number = null;
    specialPrice1: number = null;
    specialPrice2: number = null;
    specialPrice3: number = null;
    specialPrice4: number = null;
    specialPrice5: number = null;
    enabled: boolean = null;
    scale: boolean = null;
    isCondimentChain: boolean = null;
    condimentEntry: boolean = null;
    hasImage: boolean = null;
    sysStoreCategoryId: string = null;
    sysCondimentTableId: string = null;
    sysCondimentChainId: string = null;

    ratingsCount: number = null;
    ratingsValue: number = null;
    inStockCount: number = null;
    discount: number = null;
    weight: number = null;

    images: Array<any> = [];
    colours: Array<string> = [];
    size: Array<string> = [];

}

export class SitemRead extends SitemBase {

    static getList(businessService: BusinessService, authenticationService: AuthenticationService, data: Array<any>) {

        const rtn = [];

        for (const item of data) {
            rtn.push(new SitemRead(businessService, authenticationService, item));
        }

        return rtn;
    }

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: SitemRead) {

        super(businessService, authenticationService, instanceData);

    }

}

export class SitemImage {

    constructor(value: SitemImage | null) {

        if (value !== null) {
            this.sysSitemImageId = value.sysSitemImageId;
            this.sysSitemId = value.sysSitemId;
            this.id = value.id;
            this.imageType = value.imageType;
            this.imageData = value.imageData;
            this.imageHash = value.imageHash;

            switch (this.imageType) {

                default: {
                    this.imgSource = 'data:image/jpeg;base64,' + this.imageData;
                    break;
                }

            }
        }

    }

    sysSitemImageId: string;
    sysSitemId: string = null;
    id: number;
    imageType: number;
    imageData: any;
    imageHash: any;

    imgSource: string;

}

export class Sitem extends SitemBase {

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: Sitem) {

        super(businessService, authenticationService, instanceData);

        this.sysStoreCategory = instanceData.sysStoreCategory;
        this.sysCondimentTable = instanceData.sysCondimentTable;
        this.sysCondimentChain = instanceData.sysCondimentChain;

        this.pagePosition = instanceData.pagePosition;
        this.sysSitemImageId = instanceData.sysSitemImageId;
        this.imageId = instanceData.imageId;
        this.imageType = instanceData.imageType;
        this.imageData = instanceData.imageData;
        this.imageHash = instanceData.imageHash;

        if (instanceData.sysSitemImageId) {

            switch (this.imageType) {

                default: {
                    this.imgSource = 'data:image/jpeg;base64,' + this.imageData;
                    break;
                }

            }
        }

    }

    sysStoreCategory: string;
    sysCondimentTable: string;
    sysCondimentChain: string;

    pagePosition: number;
    sysSitemImageId: string;
    imageId: number;
    imageType: number;
    imageData: any;
    imageHash: any;
    imgSource: string;

}

export class SitemQtyChange {

    constructor(public sysSitemId: string,
                public name: string,
                public changeAmount: number) {

    }
}

export class CondimentTablesItem extends SitemBase {

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: CondimentTablesItem) {

        super(businessService, authenticationService, instanceData);

    }

    number: number = null;

}

export class CondimentTableBase {

    protected deserialize(instanceData: any) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    constructor(instanceData: CondimentTable) {

        if (instanceData) {

            this.deserialize(instanceData);

        }

    }

    updateId: Uint8Array = null;
    sysCondimentTableId: string = null;
    number: number = null;
    name: string = null;
    multiple: boolean = null;
    tQty: number = null;
    defaultItem: boolean = null;
    cP1Enabled: boolean = null;
    cP1ZeroPrice: boolean = null;
    cP1ButtonDescription: string = null;
    cP1PrintDescription: string = null;
    cP2Enabled: boolean = null;
    cP2ZeroPrice: boolean = null;
    cP2ButtonDescription: string = null;
    cP2PrintDescription: string = null;
    cP3Enabled: boolean = null;
    cP3ZeroPrice: boolean = null;
    cP3ButtonDescription: string = null;
    cP3PrintDescription: string = null;
    cP4Enabled: boolean = null;
    cP4ZeroPrice: boolean = null;
    cP4ButtonDescription: string = null;
    cP4PrintDescription: string = null;

}

export class CondimentTable extends CondimentTableBase {

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: CondimentTable) {

        super(instanceData);

        if (instanceData) {

            this.deserialize(instanceData);

            this.items = [];
            for (const i of instanceData.items) {
                this.items.push(new CondimentTablesItem(businessService, authenticationService, i));
            }

        }

    }

    items: Array<CondimentTablesItem>;

}

export class CondimentChain {

    updateId: Uint8Array = null;
    sysCondimentChainId: string = null;
    number: number = null;
    name: string = null;

    items: Array<CondimentChainsItem>;

}

export class CondimentChainsItem {

    sysCondimentTableId: string = null;
    number: number = null;
    name: string = null;

}

export class CondimentChainDetail {

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: CondimentChainDetail) {

        this.updateId = instanceData.updateId;
        this.sysCondimentChainId = instanceData.sysCondimentChainId;
        this.number = instanceData.number;
        this.name = instanceData.name;

        this.condimentTables = [];
        for (const condimentTable of instanceData.condimentTables) {
            this.condimentTables.push(new CondimentTable(businessService, authenticationService, condimentTable));

        }

    }

    updateId: Uint8Array = null;
    sysCondimentChainId: string = null;
    number: number = null;
    name: string = null;

    condimentTables: Array<CondimentTable>;

}

export class SitemBaseSave {

    protected deserialize(instanceData: any) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    updateId: Uint8Array = null;
    sysSitemId: string = null;
    name: string = null;
    shortDescription: string = null;
    description: string = null;
    tax: number = null;
    price1: number = null;
    price2: number = null;
    price3: number = null;
    price4: number = null;
    price5: number = null;
    specialPrice1: number = null;
    specialPrice2: number = null;
    specialPrice3: number = null;
    specialPrice4: number = null;
    specialPrice5: number = null;
    enabled: boolean = null;
    scale: boolean = null;
    isCondimentChain: boolean = null;
    condimentEntry: boolean = null;
    hasImage: boolean = null;
    sysStoreCategoryId: string = null;
    sysCondimentTableId: string = null;
    sysCondimentChainId: string = null;

    ratingsCount: number = null;
    ratingsValue: number = null;
    inStockCount: number = null;
    discount: number = null;
    weight: number = null;

    images: Array<any> = [];
    colours: Array<string> = [];
    size: Array<string> = [];

}

export class TranClientCustomerQtyChange {

    constructor(public itemNumber: number,
                public name: string,
                public changeAmount: number) {

    }
}

export class TrnCondimentTablesItem extends SitemBase {

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: CondimentTablesItem | TrnCondimentTablesItem | any) {

        super(businessService, authenticationService, instanceData);

        if (instanceData.selected) {

            const param = instanceData as TrnCondimentTablesItem;

            this.selected = param.selected;
            this.isScaleItem = param.isScaleItem;
            this.description = param.description;
            this.exTaxTotal = param.exTaxTotal;
            this.total = param.total;
            this.productPoints = param.productPoints;
            this.spendPoints = param.spendPoints;
            this.currencyCode = param.currencyCode;
            this.productId = param.productId;
            this.plu = param.plu;

        } else {

            this.selected = false;
            this.isScaleItem = this.scale;
            this.description = this.name;
            this.exTaxTotal = this.exTaxTotal;
            this.total = this.total;
            this.productPoints = this.productPoints;
            this.spendPoints = this.spendPoints;
            this.currencyCode = 'AUD';
            this.productId = null;
            this.plu = null;

        }
    }

    number: number = null;
    selected: boolean;
    isScaleItem: boolean;
    description: string;
    exTaxTotal: number;
    total: number;
    productPoints: number;
    spendPoints: number;
    currencyCode: string;
    productId: string;
    plu: string;

}

export class TrnCondimentTable extends CondimentTableBase {

    get condensedTextSelected(): string {
        return this.items.filter((x) => x.selected)
            .map((i) => i.description)
            .join(', ');
    }

    get selectText(): string {
        switch (this.tQty) {
            case 0: {
                return 'Select Any';
                break;
            }

            default: {
                return 'Select ' + this.tQty;
                break;
            }

        }
    }

    get isSingleSelection(): boolean {
        return this.tQty === 1;
    }

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: CondimentTable) {

        super(instanceData);

        if (instanceData) {

            this.deserialize(instanceData);

            this.items = [];
            for (const i of instanceData.items) {
                this.items.push(new TrnCondimentTablesItem(businessService, authenticationService, i));
            }

        }

    }

    items: Array<TrnCondimentTablesItem>;
    expanded = false;

    unSelectAll(): void {
        for (const i of this.items) {
            i.selected = false;
        }

    }
}

export class TrnCondimentTables {

    constructor(businessService: BusinessService, authenticationService: AuthenticationService,
                instanceData: CondimentChainDetail | CondimentTable | TrnCondimentTablesSave | any) {

        if (instanceData.sysCondimentChainId !== undefined) {

            const param: CondimentChainDetail = instanceData as CondimentChainDetail;

            this.type = 0;
            this.updateId = param.updateId;
            this.id = param.sysCondimentChainId;
            this.number = param.number;
            this.name = param.name;

            this.condimentTables = [];
            for (const condimentTable of param.condimentTables) {
                this.condimentTables.push(
                    new TrnCondimentTable(businessService, authenticationService, condimentTable));
            }

        } else if (instanceData.sysCondimentTableId) {

            const param: CondimentTable = instanceData as CondimentTable;

            this.type = 1;
            this.updateId = param.updateId;
            this.id = param.sysCondimentTableId;
            this.number = param.number;
            this.name = param.name;

            this.condimentTables = [];
            this.condimentTables.push(new TrnCondimentTable(businessService, authenticationService, param));

        } else if (instanceData.id) {

            const param: TrnCondimentTablesSave = instanceData as TrnCondimentTablesSave;

            this.type = 1;
            this.updateId = param.updateId;
            this.id = param.id;
            this.number = param.number;
            this.name = param.name;

            if (param.condimentTables) {

                this.condimentTables = [];
                for (const condimentTable of param.condimentTables) {
                    this.condimentTables.push(
                        new TrnCondimentTable(businessService, authenticationService, condimentTable as any));
                }
            }

        } else {
            throw Error('TrnCondimentTables error');
        }

    }

    type: number;
    updateId: Uint8Array;
    id: string;
    number: number;
    name: string;

    condimentTables: Array<TrnCondimentTable>;

}

export class TrnCondimentTablesItemSave extends SitemBaseSave {

    constructor(instanceData: TrnCondimentTablesItem) {

        super();

        this.deserialize(instanceData);

    }

    number: number = null;
    selected: boolean = null;
    isScaleItem: boolean = null;
    description: string = null;
    exTaxTotal: number = null;
    total: number = null;
    productPoints: number = null;
    spendPoints: number = null;
    currencyCode: string = null;
    productId: string = null;
    plu: string = null;

}

export class TrnCondimentTableSave {

    protected deserialize(instanceData: any) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    constructor(instanceData: TrnCondimentTable) {

        this.deserialize(instanceData);

        this.items = [];
        for (const i of instanceData.items) {
            this.items.push(new TrnCondimentTablesItemSave(i));
        }

    }

    updateId: Uint8Array = null;
    sysCondimentTableId: string = null;
    number: number = null;
    name: string = null;
    multiple: boolean = null;
    tQty: number = null;
    defaultItem: boolean = null;
    cP1Enabled: boolean = null;
    cP1ZeroPrice: boolean = null;
    cP1ButtonDescription: string = null;
    cP1PrintDescription: string = null;
    cP2Enabled: boolean = null;
    cP2ZeroPrice: boolean = null;
    cP2ButtonDescription: string = null;
    cP2PrintDescription: string = null;
    cP3Enabled: boolean = null;
    cP3ZeroPrice: boolean = null;
    cP3ButtonDescription: string = null;
    cP3PrintDescription: string = null;
    cP4Enabled: boolean = null;
    cP4ZeroPrice: boolean = null;
    cP4ButtonDescription: string = null;
    cP4PrintDescription: string = null;

    items: Array<TrnCondimentTablesItemSave>;

}

export class TrnCondimentTablesSave {

    protected deserialize(instanceData: any) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    constructor(instanceData: TrnCondimentTables) {

        this.deserialize(instanceData);

        this.condimentTables = [];
        for (const condimentTable of instanceData.condimentTables) {
            this.condimentTables.push(new TrnCondimentTableSave(condimentTable));
        }

    }

    type: number = null;
    updateId: Uint8Array = null;
    id: string = null;
    number: number = null;
    name: string = null;

    condimentTables: Array<TrnCondimentTableSave>;

}

export class TrnCartDisplayItem {

    constructor(public transactionItem: TrnClientCustomersItem) {

    }

    itemNumber: number;
    qty: number;
    isCondiment: boolean;
    isInstructions: boolean;
    isScaleItem: boolean;
    description: string;
    tax: number;
    price: number;
    exTaxTotal: number;
    total: number;
    productPoints: number;
    spendPoints: number;
    currencyCode: string;
    productId: string;
    plu: string;
    image: any;
}

export class TrnClientCustomersItemSave extends SitemBaseSave {

    constructor(instanceData: TrnClientCustomersItem) {

        super();

        this.deserialize(instanceData);

        if (instanceData.condimentTables) {

            this.condimentTables = new TrnCondimentTablesSave(instanceData.condimentTables);

        } else {

            this.condimentTables = null;

        }
    }

    itemNumber: number = null;
    isScaleItem: boolean = null;
    description: string = null;
    exTaxTotal: number = null;
    total: number = null;
    productPoints: number = null;
    spendPoints: number = null;
    currencyCode: string = null;
    qty: number = null;
    productId: string = null;
    plu: string = null;
    image: any = null;
    condimentTablesAllocated = null;
    instructions: string = null;

    condimentTables: TrnCondimentTablesSave;

}

export class TrnClientCustomersItem extends SitemBase {

    constructor(businessService: BusinessService,
                authenticationService: AuthenticationService,
                instanceData: SitemBase) {

        super(businessService, authenticationService, instanceData);

        this.isScaleItem = this.scale;
        this.description = this.name;
        this.exTaxTotal = this.price;
        this.total = this.price;
        this.productPoints = 0;
        this.spendPoints = 0;
        this.currencyCode = 'AUD';
        this.qty = 1;
        this.productId = '';
        this.plu = '';

        if (!this.images) {
            this.image = null;
        } else if (this.images.length === 0) {
            this.image = null;
        } else {
            this.image = this.images[0];
        }

        this.condimentTables = null;
        this.instructions = null;

    }

    itemNumber: number;
    isScaleItem: boolean;
    description: string;
    exTaxTotal: number;
    total: number;
    productPoints: number = null;
    spendPoints: number = null;
    currencyCode: string;
    qty: number;
    productId: string;
    plu: string;
    image: any;
    condimentTablesAllocated = false;

    condimentTables: TrnCondimentTables;

    instructions: string;

}

export class TrnClientCustomerAddSave {

    protected deserialize(instanceData: any) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    constructor(instanceData: TrnClientCustomerAdd) {
        this.deserialize(instanceData);

        this.items = [];
        for (const item of instanceData.items) {
            this.items.push(new TrnClientCustomersItemSave(item));
        }
    }

    savedDateTime: Date = new Date();
    version: number = null;
    trnCustomerId: string = null;
    sysContactId: string = null;
    applicationUser: string = null;
    cardNumber: string = null;
    typeId: number = null;
    reference: string = null;
    localTime: Date = null;
    transactionTime: Date = null;
    exTaxTotal: number = null;
    total: number = null;
    paid: number = null;
    currencyCode: string = null;

    items: Array<TrnClientCustomersItemSave>;
}

export class TrnClientCustomerAdd {

    get deliveryFee(): boolean {
        return this.deliveryFeeAmount !== 0;
    }

    set deliveryFee(value: boolean) {

        this.fDeliveryFeeApplied = value;

        if (value) {
            if (this.businessService.business.deliveryPromoEnabled && this.fDeliveryPromo) {
                this.deliveryFeeAmount = 0;
                this.calculateTotals();
            } else {
                this.deliveryFeeAmount = this.businessService.business.deliveryFee;
                this.calculateTotals();
            }
        } else {
            this.deliveryFeeAmount = 0;
            this.calculateTotals();
        }

    }

    get deliveryPromo(): boolean {
        return this.fDeliveryPromo;
    }

    set deliveryPromo(value: boolean) {

        if (value !== this.fDeliveryPromo) {
            this.fDeliveryPromo = value;
            this.calculateTotals();
        }

    }

    get deliveryPromoActive(): boolean {

        if (this.businessService.business.deliveryPromoEnabled) {
            if (this.businessService.business.deliveryFee > 0.01) {
                if (this.fDeliveryPromo && this.fDeliveryFeeApplied) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    get promotion(): boolean {
        return this.promotionAmount !== 0;
    }

    set promotion(value: boolean) {

        if (value) {
            this.promotionRate = this.businessService.business.promoRate;
            this.calculateTotals();
        } else {
            this.promotionRate = 0;
            this.calculateTotals();
        }

    }

    get taxAmount(): number {

        return this.total - this.exTaxTotal;

    }

    static loadFromStorage(businessService: BusinessService,
                           authenticationService: AuthenticationService,
                           storageService: StorageService): TrnClientCustomerAdd {

        const rtn = new TrnClientCustomerAdd(businessService, authenticationService, storageService);

        const savedCart: TrnClientCustomerAddSave = storageService.getObject(`cart`);

        if (savedCart) {
            if (rtn.version === savedCart.version) {

                // if less than an hour load
                if ((new Date().getTime() - new Date(savedCart.savedDateTime).getTime()) < 3600000) {
                    rtn.load(businessService, authenticationService, savedCart);
                } else {
                    rtn.save();
                }
            } else {
                rtn.save();
            }
        }

        return rtn;

    }

    private fDeliveryPromo = false;
    private fDeliveryFeeApplied = false;

    private calculateExTaxAmount(taxInclusiveAmount: number): number {
        return Math.round(((taxInclusiveAmount / (1 + (this.businessService.business.taxRate / 100))) * 100)) / 100;
    }

    private calculateTotals() {

        this.cartDisplayItems = [];
        this.totalWithoutDelivery = 0;
        this.exTaxTotal = 0;
        this.total = 0;
        let itemNumber = 1;
        let cartDisplayItemNumber = 1;

        if (this.deliveryFeeAmount !== 0) {

            this.total += this.deliveryFeeAmount;
            this.exTaxTotal += this.calculateExTaxAmount(this.deliveryFeeAmount);

        }

        this.items.forEach((item) => {

            item.itemNumber = itemNumber++;
            item.total = item.qty * item.price;

            if (item.total !== 0) {
                if (item.tax === 0) {
                    item.exTaxTotal = item.total;
                } else {
                    item.exTaxTotal = this.calculateExTaxAmount(item.total);
                }
            } else {
                item.exTaxTotal = 0;
            }

            this.totalWithoutDelivery += item.total;
            this.total += item.total;
            this.exTaxTotal += item.exTaxTotal;

            const cartDisplayItem = new TrnCartDisplayItem(item);
            cartDisplayItem.itemNumber = cartDisplayItemNumber++;
            cartDisplayItem.qty = item.qty;
            cartDisplayItem.price = item.price;
            cartDisplayItem.isInstructions = false;
            cartDisplayItem.isCondiment = false;
            cartDisplayItem.isScaleItem = item.isScaleItem;
            cartDisplayItem.description = item.description;
            cartDisplayItem.tax = item.tax;
            cartDisplayItem.exTaxTotal = item.exTaxTotal;
            cartDisplayItem.total = item.total;
            cartDisplayItem.currencyCode = item.currencyCode;
            cartDisplayItem.productId = item.sysSitemId;
            cartDisplayItem.plu = item.plu;
            cartDisplayItem.image = item.image;

            this.cartDisplayItems.push(cartDisplayItem);

            if (item.condimentTables) {
                let selectedCondimentNumber = 0;

                item.condimentTables.condimentTables.forEach((condimentTable) => {

                    condimentTable.items.forEach((condiment) => {

                        if (condiment.selected) {
                            selectedCondimentNumber++;
                            condiment.total = item.qty * condiment.price;

                            if (condiment.total !== 0) {
                                if (condiment.tax === 0) {
                                    condiment.exTaxTotal = condiment.total;
                                } else {
                                    condiment.exTaxTotal = this.calculateExTaxAmount(condiment.total);
                                }
                            } else {
                                condiment.exTaxTotal = 0;
                            }

                            this.totalWithoutDelivery += condiment.total;
                            this.total += condiment.total;
                            this.exTaxTotal += condiment.exTaxTotal;

                            const cartCondimentDisplayItem = new TrnCartDisplayItem(item);
                            cartCondimentDisplayItem.itemNumber = cartDisplayItemNumber++;
                            cartCondimentDisplayItem.qty = item.qty;
                            cartCondimentDisplayItem.price = condiment.price;
                            cartCondimentDisplayItem.isInstructions = false;
                            cartCondimentDisplayItem.isCondiment = true;
                            cartCondimentDisplayItem.isScaleItem = condiment.isScaleItem;
                            cartCondimentDisplayItem.description = condiment.description;
                            cartCondimentDisplayItem.tax = condiment.tax;
                            cartCondimentDisplayItem.exTaxTotal = condiment.exTaxTotal;
                            cartCondimentDisplayItem.total = condiment.total;
                            cartCondimentDisplayItem.currencyCode = condiment.currencyCode;
                            cartCondimentDisplayItem.productId = condiment.sysSitemId;
                            cartCondimentDisplayItem.plu = condiment.plu;
                            cartCondimentDisplayItem.image = null;

                            this.cartDisplayItems.push(cartCondimentDisplayItem);

                        }
                    });

                });
            }

            if (item.instructions) {

                const cartInstructionItem = new TrnCartDisplayItem(item);
                cartInstructionItem.itemNumber = cartDisplayItemNumber++;
                cartInstructionItem.qty = null;
                cartInstructionItem.price = null;
                cartInstructionItem.isInstructions = true;
                cartInstructionItem.isCondiment = false;
                cartInstructionItem.isScaleItem = false;
                cartInstructionItem.description = item.instructions;
                cartInstructionItem.tax = null;
                cartInstructionItem.exTaxTotal = null;
                cartInstructionItem.total = null;
                cartInstructionItem.currencyCode = null;
                cartInstructionItem.productId = null;
                cartInstructionItem.plu = null;
                cartInstructionItem.image = null;

                this.cartDisplayItems.push(cartInstructionItem);

            }
        });

        if (this.promotionRate !== 0) {

            if (this.totalWithoutDelivery !== 0) {

                this.promotionAmount = -(Math.round((this.total * (this.promotionRate / 100)) * 100) / 100);
                this.total = this.total + this.promotionAmount;
                if (this.exTaxTotal !== 0) {
                    this.exTaxTotal += -(Math.round((this.exTaxTotal * (this.promotionRate / 100)) * 100) / 100);
                }

            } else {

                this.promotionAmount = 0;

            }

        } else {

            this.promotionAmount = 0;

        }

    }

    private load(businessService: BusinessService,
                 authenticationService: AuthenticationService,
                 value: TrnClientCustomerAddSave) {

        this.trnCustomerId = value.trnCustomerId;
        this.sysContactId = value.sysContactId;
        this.applicationUser = value.applicationUser;
        this.cardNumber = value.cardNumber;
        this.typeId = value.typeId;
        this.reference = value.reference;
        this.localTime = value.localTime;
        this.transactionTime = value.transactionTime;
        this.exTaxTotal = value.exTaxTotal;
        this.total = value.total;
        this.paid = value.paid;
        this.currencyCode = value.currencyCode;

        this.items.length = 0;

        for (const item of value.items) {

            const loadItem = new TrnClientCustomersItem(this.businessService, this.authenticationService, item as any);

            if (item.condimentTables) {
                loadItem.condimentTables =
                    new TrnCondimentTables(this.businessService, this.authenticationService, item.condimentTables);

            }

            loadItem.isScaleItem = item.isScaleItem;
            loadItem.description = item.description;
            loadItem.exTaxTotal = item.exTaxTotal;
            loadItem.total = item.total;
            loadItem.currencyCode = item.currencyCode;
            loadItem.qty = item.qty;
            loadItem.productId = item.productId;
            loadItem.plu = item.plu;
            loadItem.image = item.image;
            loadItem.condimentTablesAllocated = item.condimentTablesAllocated;
            loadItem.instructions = item.instructions;

            this.items.push(loadItem);

        }

        this.calculateTotals();

    }

    constructor(public businessService: BusinessService,
                public authenticationService: AuthenticationService,
                public storageService: StorageService) {

        this.items = [];
        this.cartDisplayItems = [];

    }

    version = 1;
    trnCustomerId: string;
    sysContactId: string;
    applicationUser: string;
    cardNumber: string;
    typeId: number;
    reference: string;
    localTime: Date;
    transactionTime: Date;
    deliveryFeeAmount = 0;
    promotionRate = 0;
    promotionAmount = 0;
    totalWithoutDelivery: number;
    exTaxTotal: number;
    total: number;
    paid: number;
    currencyCode: string;

    items: Array<TrnClientCustomersItem>;

    cartDisplayItems: Array<TrnCartDisplayItem>;

    save() {

        // tslint:disable-next-line:max-line-length
        this.storageService.setObject(`cart`, new TrnClientCustomerAddSave(this));

    }

    addToCart(product: SitemRead): TrnClientCustomersItem {

        // tslint:disable-next-line:max-line-length
        const idx: number = this.items.push(new TrnClientCustomersItem(this.businessService, this.authenticationService, product));

        this.calculateTotals();

        this.save();

        const message = 'The product ' + product.name + ' has been added to cart.';
        const status = 'success';

        // this.snackBar.open(message, '×', {panelClass: [status], verticalPosition: 'top', duration: 3000});

        return this.items[idx - 1];
    }

    removeFromCart(item: TrnClientCustomersItem) {

        let message;
        let status;

        const idx = this.items.findIndex((x) => x === item);

        if (idx < 0) {

            message = 'The product ' + item.description + ' was not found in the cart.';
            status = 'error';

        } else {

            this.items.splice(idx, 1);

            this.calculateTotals();

            this.save();

            message = 'The product ' + item.description + ' has been removed from the cart.';
            status = 'success';

        }

        // this.snackBar.open(message, '×', {panelClass: [status], verticalPosition: 'top', duration: 3000});

    }

    qtyTranChange(change: TranClientCustomerQtyChange) {

        let message: string;
        let status: string;

        const idx = this.items.findIndex((x) => x.itemNumber === change.itemNumber);

        if (idx < 0) {

            message = 'The product was not found in the cart.';
            status = 'error';

        } else if ((this.items[idx].qty + change.changeAmount) < 0) {

            this.items.splice(idx, 1);

            this.calculateTotals();

            this.save();

            message = 'The product was removed.';
            status = 'success';

        } else {

            this.items[idx].qty = this.items[idx].qty + change.changeAmount;

            this.calculateTotals();

            this.save();

            message = 'The product quantity updated.';
            status = 'success';

        }

    }

    qtySitemChange(change: SitemQtyChange) {

        let message: string;
        let status: string;

        const idx = this.items.findIndex((x) => x.sysSitemId === change.sysSitemId);

        if (idx < 0) {

            message = 'The product was not found in the cart.';
            status = 'error';

        } else if ((this.items[idx].qty + change.changeAmount) < 0) {

            this.items.splice(idx, 1);

            this.calculateTotals();

            this.save();

            message = 'The product was removed.';
            status = 'success';

        } else {

            this.items[idx].qty = this.items[idx].qty + change.changeAmount;

            this.calculateTotals();

            this.save();

            message = 'The product quantity updated.';
            status = 'success';

        }

    }

    clearCart(showSnackBar?: boolean) {

        // if (showSnackBar === undefined) {
        //     showSnackBar = true;
        // }
        this.deliveryFee = false;
        this.items.length = 0;

        this.calculateTotals();

        this.save();

        // if (showSnackBar) {
        //     const message = 'Cart has been cleared.';
        //     status = 'success';
        //
        //     // this.snackBar.open(message, '×', {panelClass: [status], verticalPosition: 'top', duration: 3000});
        // }

    }

    customiseUpdate() {

        this.calculateTotals();

        // this.save();

    }

    afterCustomiseUpdate() {

        this.calculateTotals();

        this.save();

    }

    updateDeliveryFee(value: number) {

        this.fDeliveryFeeApplied = true;

        if (this.businessService.business.deliveryPromoEnabled && this.fDeliveryPromo) {
            this.deliveryFeeAmount = 0;
            this.calculateTotals();
        } else {
            this.deliveryFeeAmount = value;
            this.calculateTotals();
        }
    }

}
