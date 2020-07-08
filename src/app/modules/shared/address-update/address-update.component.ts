import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

import {AppService} from '../../../services/app.service';
import {AddressService, MapCoordinate, SuggestAddress, ValidatedAddress} from '../../../services/address.service';
import {ObservableArray} from 'tns-core-modules/data/observable-array';
import {AutoCompleteEventData, RadAutoCompleteTextView, TokenModel} from 'nativescript-ui-autocomplete';
import {dismissSoftKeyboard} from '~/app/modules/shared/infrastructure/utilities';

export class AddressModel {
    isBilling: boolean;
    isPostal: boolean;
    isDelivery: boolean;
    ffhLocalityId: number;
    company: string;
    companyNumber: string;
    addressNote: string;
    street: string;
    extended: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    distance: number;
}

export enum AddressUpdateView {
    address,
    addtionalFields
}

class CustomTokenModel extends TokenModel {
    constructor(text, public displayText, public id, image) {
        super(text, image);
    }
}

@Component({
    selector: 'ns-address-update',
    templateUrl: './address-update.component.html',
    styleUrls: ['./address-update.component.scss'],
    moduleId: module.id
})
export class AddressUpdateComponent implements OnInit, AfterViewInit {

    // get autoCompleteItems(): ObservableArray<TokenModel> {
    //     return this.fAutoCompleteItems;
    // }

    get isValid(): boolean {
        return this.fIsValid;
    }

    set isValid(value: boolean) {
        if (value !== this.fIsValid) {
            this.fIsValid = value;
            this.isValidStatus.emit(value);
        }
    }

    private fIsValid: boolean;
    // private fAutoCompleteItems: ObservableArray<TokenModel> = new ObservableArray([]);
    private didAutoCompleteEventFired = false;

    private validSearchValue(value: any): boolean {

        let rtn = true;
        if (value) {

            if (typeof value === 'string') {
                if (value.trim().length < 5) {
                    rtn = false;
                }
            } else {
                rtn = false;
            }
        } else {
            rtn = false;
        }

        return rtn;
    }

    constructor(private addressService: AddressService,
                public appService: AppService,
                private changeDetectorRef: ChangeDetectorRef,
                private formBuilder: FormBuilder) {

        this.formErrors = {
            company: {},
            companyNumber: {},
            addressNote: {},
            street: {},
            extended: {},
            locality: {},
            region: {},
            postalCode: {},
            country: {}
        };

    }

    @ViewChild('addressAutocomplete', {static: false}) addressAutocomplete: ElementRef;
    @Input() showCompany = true;
    @Input() showMap = true;
    @Input() displayFormat = 0;
    @Input() form: FormGroup;
    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() selectValidAddress: EventEmitter<AddressModel> = new EventEmitter<AddressModel>();

    @Input() viewData: AddressModel = null;
    @Input() cardForm = false;
    @Input() skipButtonText = 'Skip';

    AddressUpdateView = AddressUpdateView;
    componentView: AddressUpdateView = AddressUpdateView.address;

    // suggestedAddresses: Array<SuggestAddress> = [];
    mapCoordinate: MapCoordinate = null;

    mapVisible = false;
    formLoaded = false;
    formErrors: any;

    updateMap() {
        if (this.form.get('lat').value && this.form.get('lng').value && this.showMap) {
            this.mapCoordinate = new MapCoordinate(this.form.get('lat').value, this.form.get('lng').value);
            this.mapCoordinate.label = this.form.get('street').value;
        } else {
            this.mapCoordinate = null;
        }
    }

    ngOnInit() {

        this.form.addControl('suggestedAddress', new FormControl(''));
        this.form.addControl('additionalFieldsHandled', new FormControl(undefined, [Validators.required]));
        this.form.addControl('addressSelected', new FormControl(false, [Validators.required]));
        this.form.addControl('company', new FormControl('', [Validators.maxLength(80)]));
        this.form.addControl('companyNumber', new FormControl(''));
        this.form.addControl('addressNote', new FormControl('', [Validators.maxLength(80)]));
        this.form.addControl('street', new FormControl('', [Validators.required, Validators.maxLength(80)]));
        this.form.addControl('extended', new FormControl('', [Validators.maxLength(80)]));
        this.form.addControl('locality', new FormControl('', [Validators.required, Validators.maxLength(80)]));
        this.form.addControl('region', new FormControl('', [Validators.required, Validators.maxLength(80)]));
        this.form.addControl('postalCode', new FormControl('', [Validators.required, Validators.maxLength(20)]));
        this.form.addControl('country', new FormControl('Australia', [Validators.required]));
        this.form.addControl('lat', new FormControl());
        this.form.addControl('lng', new FormControl());
        this.form.addControl('distance', new FormControl());

        this.form.statusChanges.subscribe(() => {
                this.isValid = !this.form.invalid;
                this.onFormStatusChange();
            }
        );

        if (this.viewData) {
            this.form.patchValue(this.viewData);
            this.updateMap();

        } else {
            this.viewData = new AddressModel();
        }

        // this.form.controls.suggestedAddress.valueChanges
        //     .pipe(
        //         debounceTime(400),
        //         distinctUntilChanged(),
        //         switchMap(
        //             (value) => !this.validSearchValue(value) ? of([]) : this.addressService.getSuggestedAddresses(value)
        //         )
        //     )
        //     .subscribe((data: Array<SuggestAddress>) => {
        //             if (data && data.length) {
        //
        //                 const items: Array<TokenModel> = new Array();
        //                 for (const suggestAddress of data) {
        //                     items.push(new TokenModel(suggestAddress.address, null));
        //                 }
        //
        //                 // this.suggestedAddresses = data;
        //                 // this.fAutoCompleteItems = new ObservableArray(items);
        //
        //             } else {
        //
        //                 // this.suggestedAddresses = [];
        //                 // this.fAutoCompleteItems = new ObservableArray([]);
        //
        //             }
        //
        //         }
        //     );

        this.formLoaded = true;

    }

    ngAfterViewInit() {

        const radAutoCompleteTextView: RadAutoCompleteTextView = this.addressAutocomplete.nativeElement;

        radAutoCompleteTextView.loadSuggestionsAsync = (text) => {
            const promise = new Promise((resolve, reject)   => {

                this.addressService.getSuggestedAddresses(text)
                    .subscribe((data: Array<SuggestAddress>) => {
                        if (data && data.length) {

                            const suggestions: Array<CustomTokenModel> = [];

                            for (const suggestAddress of data) {
                                suggestions.push(new CustomTokenModel(text, suggestAddress.address, suggestAddress.id,
                                    null));
                            }

                            return resolve(suggestions);

                        } else {

                            return resolve([]);

                        }

                    }, (error) => {
                        return reject(error);
                    });

            });

            return promise;
        };

    }

    get additionalFieldsButtonText(): string {
        if (this.showCompany) {
            const company = this.form.get('company').value;
            const addressNote = this.form.get('addressNote').value;
            if (addressNote || company) {
                return 'Continue';
            } else {
                return this.skipButtonText;
            }
        } else {
            const addressNote = this.form.get('addressNote').value;
            if (addressNote) {
                return 'Continue';
            } else {
                return this.skipButtonText;
            }
        }

    }

    displaySuggestAddress(value: SuggestAddress) {
        if (value) {
            return value.address;
        }
    }

    onFormStatusChange() {

        for (const field of Object.keys(this.formErrors)) {

            this.formErrors[field] = {};

            const control = this.form.get(field);

            if (control && control.dirty && !control.valid && control.errors) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    // onTextChanged(event: AutoCompleteEventData) {
    //
    //     if (this.didAutoCompleteEventFired) {
    //         this.didAutoCompleteEventFired = false;
    //     } else if (event.text) {
    //         this.form.controls.suggestedAddress.setValue(event.text);
    //     }
    //
    // }

    onDidAutoComplete(event: AutoCompleteEventData) {

        this.didAutoCompleteEventFired = true;

        const token = event.token as CustomTokenModel;

        if (token) {

            dismissSoftKeyboard();

            this.addressService.validateAddress(token.id)
                .subscribe(
                    (data: ValidatedAddress) => {

                        if (data.validated) {

                            (event.object as RadAutoCompleteTextView).text = '';

                            this.form.reset();
                            // this.suggestedAddresses = [];

                            this.form.get('lat').setValue(data.lat);
                            this.form.get('lng').setValue(data.lng);
                            this.form.get('distance').setValue(data.distance);
                            this.form.get('street').setValue(data.street);
                            this.form.get('extended').setValue(data.extended);
                            this.form.get('locality').setValue(data.locality);
                            this.form.get('region').setValue(data.region);
                            this.form.get('postalCode').setValue(data.postalCode);
                            this.form.get('country').setValue(data.country);
                            this.form.get('addressSelected').setValue(true);

                            const updatedView: AddressModel = new AddressModel();

                            updatedView.lat = data.lat;
                            updatedView.lng = data.lng;
                            updatedView.distance = data.distance;
                            updatedView.street = data.street;
                            updatedView.extended = data.extended;
                            updatedView.locality = data.locality;
                            updatedView.region = data.region;
                            updatedView.postalCode = data.postalCode;
                            updatedView.country = data.country;

                            this.viewData = updatedView;

                            this.componentView = AddressUpdateView.addtionalFields;

                        } else {
                            // could clear suggestedAddress
                        }

                    }, (error) => {
                        // console.error(error);
                    }
                );

        }

    }

    onAdditionalFieldsButtonClick() {

        this.form.get('additionalFieldsHandled').setValue(true);
        this.viewData.lat = this.form.get('lat').value;
        this.viewData.lng = this.form.get('lng').value;
        this.viewData.distance = this.form.get('distance').value;
        this.viewData.street = this.form.get('street').value;
        this.viewData.extended = this.form.get('extended').value;
        this.viewData.locality = this.form.get('locality').value;
        this.viewData.region = this.form.get('region').value;
        this.viewData.postalCode = this.form.get('postalCode').value;
        this.viewData.country = this.form.get('country').value;

        this.viewData.company = this.form.get('company').value;
        this.viewData.companyNumber = this.form.get('companyNumber').value;
        this.viewData.addressNote = this.form.get('addressNote').value;

        this.updateMap();

        this.componentView = AddressUpdateView.address;

        this.selectValidAddress.emit(this.viewData);

    }

}
