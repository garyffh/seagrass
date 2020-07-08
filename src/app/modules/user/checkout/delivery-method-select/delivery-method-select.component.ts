import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import {
    Component,
    EventEmitter,
    OnInit,
    OnDestroy,
    Output,
    Input,
    ChangeDetectorRef,
    ViewContainerRef, NgZone
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AppService } from '../../../../services/app.service';
import {
    DeliveryMethodOpenStatus,
    DeliveryMethodType,
    DialogMessage,
    TrnCartDeliveryMethodInterval,
    TrnCheckoutDeliveryMethod
} from '../../../../services/app.models';
import { StoreStatusService } from '../../../../services/store-status.service';

import { StripeErrorMessage, TrnCustomerBillingDeliveryMethod } from '../../services/user.models';
import { BusinessService } from '../../../../services/business.service';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular';
import { MessageDialogComponent } from '~/app/modules/shared/message-dialog/message-dialog.component';
import { ListPicker } from 'tns-core-modules/ui/list-picker';
import { UtilityService } from '~/app/services/utility.service';

@Component({
    selector: 'ns-delivery-method-select',
    templateUrl: './delivery-method-select.component.html',
    styleUrls: ['./delivery-method-select.component.scss'],
    moduleId: module.id
})
export class DeliveryMethodSelectComponent implements OnInit, OnDestroy {

    get isValid(): boolean {
        return this.fIsValid;
    }

    get notOpenStatusMessage(): DialogMessage {
        return this.businessService.getOpenStatusMessage(this.storeStatusService.storeStatus.openStatus);
    }

    @Input()
    set checkoutError(value: Error) {
        if (value !== this.fCheckoutError) {

            this.fCheckoutError = value;

            if (value) {
                if (value.message === 'Order is too old, refresh the checkout page.') {
                    this.updateSessionNumber = 1; // show refresh dialog
                    this.storeStatusService.refresh();
                }
            }
        }
    }

    private storeTimeFieldName = 'storeTime';
    private deliveryTimeFieldName = 'deliveryTime';
    private selectedTypeFieldName = 'selectedType';
    private tableNumberFieldName = 'tableNumber';

    private fIsValid: boolean;
    private dialogOpen = false;
    private updateSessionNumber = 0;

    private fCheckoutError: Error = null;

    private refreshStatus() {
        this.ngZone.run(() => {

            this.dialogOpen = true;

            this.updateCheckoutDeliveryMethod();

            const options: ModalDialogOptions = {
                context: new DialogMessage('Delivery / Pickup Time Refresh',
                    'The delivery and pickup times have been updated. Reselect your time'),
                fullscreen: false,
                viewContainerRef: this.viewContainerRef
            };
            this.modalService.showModal(MessageDialogComponent, options)
                .then((data) => {
                    this.dialogOpen = false;
                });

        });

    }

    private deliveryTimeSelected(): ValidatorFn {

        return (control: AbstractControl): ValidationErrors | null => {

            if (!this.form) {
                return {error: true};
            }

            if (!(this.form.get('selectedType') && this.form.get('storeTime') && this.form.get('deliveryTime'))) {
                return {error: true};
            }

            if (this.form.get('selectedType').value === null) {
                return {error: true};
            }

            if (this.form.get('selectedType').value === DeliveryMethodType.store) {
                return this.form.get('storeTime').value === null ? {error: true} : null;
            } else if (this.form.get('selectedType').value === DeliveryMethodType.delivery) {
                return this.form.get('deliveryTime').value === null ? {error: true} : null;
            } else if (this.form.get('selectedType').value === DeliveryMethodType.table) {
                return this.form.get('tableNumber').value ?  null : {error: true};
            } else {
                return {error: true};
            }

        };

    }

    private minOrderError(): ValidatorFn {

        return (control: AbstractControl): ValidationErrors | null => {

            if (this.businessService.business.minOrder === 0) {
                return null;
            } else {
                if (this.form.get('selectedType')) {
                    if (this.form.get('selectedType').value === DeliveryMethodType.delivery) {
                        if (this.appService.data.cartTransaction.totalWithoutDelivery
                            < this.businessService.business.minOrder) {
                            return {minOrderError: true};
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        };

    }

    constructor(private changeDetectorRef: ChangeDetectorRef,
                public ngZone: NgZone,
                public modalService: ModalDialogService,
                public viewContainerRef: ViewContainerRef,
                public utilitiesService: UtilityService,
                public storeStatusService: StoreStatusService,
                public businessService: BusinessService,
                public appService: AppService) {

        this.form = new FormGroup({
                selectedType: new FormControl(null, [Validators.required]),
                storeTime: new FormControl(null),
                deliveryTime: new FormControl(null),
                tableNumber: new FormControl(null)
            }, [this.deliveryTimeSelected(), this.minOrderError()]
        );

        this.form.statusChanges.subscribe((status) => {

            this.fIsValid = status === 'VALID';
            this.isValidStatus.emit(this.fIsValid);

        });

        this.form.valueChanges.subscribe((value) => {

            if (value) {
                const eventModel: TrnCustomerBillingDeliveryMethod = new TrnCustomerBillingDeliveryMethod();

                eventModel.storeStatusTime = moment(this.checkoutDeliveryMethod.storeStatusTime);
                eventModel.selectedType = value[this.selectedTypeFieldName];

                if (eventModel.selectedType === DeliveryMethodType.store) {

                    if (!value[this.storeTimeFieldName]) {
                        eventModel.asap = false;
                        eventModel.selectedTime = null;
                    } else if ((value[this.storeTimeFieldName] as Moment).format === undefined) {
                        eventModel.asap = true;
                        eventModel.selectedTime = null;
                    } else {
                        eventModel.asap = false;
                        eventModel.selectedTime = (value[this.storeTimeFieldName] as Moment);
                    }

                } else if (eventModel.selectedType === DeliveryMethodType.delivery) {

                    if (!value[this.deliveryTimeFieldName]) {
                        eventModel.asap = false;
                        eventModel.selectedTime = null;
                    } else if ((value[this.deliveryTimeFieldName] as Moment).format === undefined) {
                        eventModel.asap = true;
                        eventModel.selectedTime = null;
                    } else {
                        eventModel.asap = false;
                        eventModel.selectedTime = (value[this.deliveryTimeFieldName] as Moment);
                    }

                } else if (eventModel.selectedType === DeliveryMethodType.table) {

                    eventModel.asap = true;
                    eventModel.selectedTime = null;
                    eventModel.tableNumber = value[this.tableNumberFieldName];
                }

                this.updateBillingDeliveryMethod.emit(eventModel);
            }

        });

        this.storeStatusUpdateSubscription = this.storeStatusService.storeStatusUpdate$
            .subscribe((storeStatus) => {

                    this.updateSessionNumber++;

                    if (!this.checkoutProcessing) {

                        if (this.form.get('selectedType').value !== null && !this.dialogOpen) {

                            if (this.form.get('selectedType').value !== null) {

                                if (this.updateSessionNumber > 1) {

                                    this.refreshStatus();

                                }

                            } else {

                                this.updateCheckoutDeliveryMethod();

                            }

                        } else {
                            this.updateCheckoutDeliveryMethod();
                        }
                    }

                }
            );

    }

    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() updateBillingDeliveryMethod: EventEmitter<TrnCustomerBillingDeliveryMethod>
        = new EventEmitter<TrnCustomerBillingDeliveryMethod>();

    @Input() checkoutProcessing: boolean;

    form: FormGroup = new FormGroup({});
    DeliveryMethodType = DeliveryMethodType;
    DeliveryMethodOpenStatus = DeliveryMethodOpenStatus;

    tableNumberRequired = true;

    checkoutDeliveryMethod: TrnCheckoutDeliveryMethod;

    storeStatusUpdateSubscription: Subscription;

    storeTimes: Array<string> = [];
    deliveryTimes: Array<string> = [];

    updateCheckoutDeliveryMethod() {

        this.updateSessionNumber = 0;

        if (this.checkoutDeliveryMethod) {
            this.checkoutDeliveryMethod.update(this.businessService, this.storeStatusService.storeStatus);

            this.storeTimes = [];
            for (const trnCartDeliveryMethodInterval of this.checkoutDeliveryMethod.storeTimes) {
                this.storeTimes.push(trnCartDeliveryMethodInterval.display);
            }

            this.deliveryTimes = [];
            for (const trnCartDeliveryMethodInterval of this.checkoutDeliveryMethod.deliveryTimes) {
                this.deliveryTimes.push(trnCartDeliveryMethodInterval.display);
            }

        } else {

            this.checkoutDeliveryMethod =
                new TrnCheckoutDeliveryMethod(this.businessService, this.storeStatusService.storeStatus);

            this.storeTimes = [];
            for (const trnCartDeliveryMethodInterval of this.checkoutDeliveryMethod.storeTimes) {
                this.storeTimes.push(trnCartDeliveryMethodInterval.display);
            }

            this.deliveryTimes = [];
            for (const trnCartDeliveryMethodInterval of this.checkoutDeliveryMethod.deliveryTimes) {
                this.deliveryTimes.push(trnCartDeliveryMethodInterval.display);
            }

        }

        if (this.checkoutDeliveryMethod.deliveryTimes.length > 0 && this.checkoutDeliveryMethod.storeTimes.length > 0) {
            this.form.get('selectedType').setValue(null);
        } else if (this.checkoutDeliveryMethod.storeTimes.length > 0) {
            this.form.get('selectedType').setValue(DeliveryMethodType.store);
        } else if (this.checkoutDeliveryMethod.deliveryTimes.length > 0) {
            this.form.get('selectedType').setValue(DeliveryMethodType.delivery);
        } else {
            this.form.get('selectedType').setValue(null);
        }

        if (this.storeStatusService.storeStatus.storeTimes.openStatus === DeliveryMethodOpenStatus.open) {
            this.form.get('storeTime').setValue('ASAP');
        } else {
            if (this.checkoutDeliveryMethod.storeTimes.length > 0) {
                this.form.get('storeTime').setValue(this.checkoutDeliveryMethod.storeTimes[0].intervalTime);
            } else {
                this.form.get('storeTime').setValue(null);
            }
        }

        if (this.storeStatusService.storeStatus.deliveryTimes.openStatus === DeliveryMethodOpenStatus.open) {
            this.form.get('deliveryTime').setValue('ASAP');
        } else {
            if (this.checkoutDeliveryMethod.deliveryTimes.length > 0) {
                this.form.get('deliveryTime').setValue(this.checkoutDeliveryMethod.deliveryTimes[0].intervalTime);
            } else {
                this.form.get('deliveryTime').setValue(null);
            }
        }

    }

    ngOnInit() {

        this.updateCheckoutDeliveryMethod();

        this.isValidStatus.emit(this.fIsValid);

    }

    ngOnDestroy() {

        this.storeStatusUpdateSubscription.unsubscribe();

    }

    onDeliverySelect(): void {
        this.form.get('selectedType').setValue(DeliveryMethodType.delivery);
    }

    onPickupSelect(): void {
        this.form.get('selectedType').setValue(DeliveryMethodType.store);
    }

    onAtTableSelect(): void {
        this.form.get('selectedType').setValue(DeliveryMethodType.table);
    }

    deliveryIndexChanged(event): void {

       const picker = event.object as ListPicker;
        // tslint:disable-next-line:max-line-length
       this.form.get('deliveryTime').setValue(this.checkoutDeliveryMethod.deliveryTimes[picker.selectedIndex].intervalTime);

    }

    storeIndexChanged(event): void {

        const picker = event.object as ListPicker;
        this.form.get('storeTime').setValue(this.checkoutDeliveryMethod.storeTimes[picker.selectedIndex].intervalTime);

    }

}
