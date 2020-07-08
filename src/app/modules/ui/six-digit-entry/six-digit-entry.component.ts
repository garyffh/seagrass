import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'ns-six-digit-entry',
    templateUrl: './six-digit-entry.component.html',
    styleUrls: ['./six-digit-entry.component.scss'],
    moduleId: module.id
})
export class SixDigitEntryComponent implements OnInit, AfterViewInit {

    get isValid(): boolean {
        return this.fIsValid;
    }

    set isValid(value: boolean) {
        if (value !== this.fIsValid) {
            this.fIsValid = value;
            this.isValidStatus.emit(value);
        }
    }

    private fIsValid = false;

    constructor(private formBuilder: FormBuilder) {
    }

    @ViewChild('digit1', { static: false }) digit1: ElementRef;
    @ViewChild('digit2', { static: false }) digit2: ElementRef;
    @ViewChild('digit3', { static: false }) digit3: ElementRef;
    @ViewChild('digit4', { static: false }) digit4: ElementRef;
    @ViewChild('digit5', { static: false }) digit5: ElementRef;
    @ViewChild('digit6', { static: false }) digit6: ElementRef;

    @Input() form: FormGroup;

    @Output() isValidStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit(): void {

        this.form.addControl('digit1', new FormControl('',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]));

        this.form.addControl('digit2', new FormControl('',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]));
        this.form.addControl('digit3', new FormControl('',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]));
        this.form.addControl('digit4', new FormControl('',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]));
        this.form.addControl('digit5', new FormControl('',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]));
        this.form.addControl('digit6', new FormControl('',
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]));

        this.form.get('digit1').valueChanges.subscribe((value) => {
            if (!this.form.get('digit1').invalid) {
                this.digit2.nativeElement.focus();
            }
        });

        this.form.get('digit2').valueChanges.subscribe((value) => {
            if (!this.form.get('digit2').invalid) {
                this.digit3.nativeElement.focus();
            }
        });

        this.form.get('digit3').valueChanges.subscribe((value) => {
            if (!this.form.get('digit3').invalid) {
                this.digit4.nativeElement.focus();
            }
        });

        this.form.get('digit4').valueChanges.subscribe((value) => {
            if (!this.form.get('digit4').invalid) {
                this.digit5.nativeElement.focus();
            }
        });

        this.form.get('digit5').valueChanges.subscribe((value) => {
            if (!this.form.get('digit5').invalid) {
                this.digit6.nativeElement.focus();
            }
        });

        this.form.get('digit6').valueChanges.subscribe((value) => {
            if (!this.form.get('digit6').invalid) {
                    this.completed.emit(true);
            }
        });

        this.form.statusChanges.subscribe((status) => {
                this.isValid = status === 'VALID';
            }
        );

    }

    ngAfterViewInit(): void {
        // this.digit1.nativeElement.focus();
    }

    setFocus() {
        this.digit1.nativeElement.focus();
    }
}
