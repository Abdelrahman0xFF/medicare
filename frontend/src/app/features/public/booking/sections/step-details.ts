import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UiButton } from '../../../../shared/ui/button';
import { UiPhoneInput } from '../../../../shared/ui/phone-input/phone-input';
import { Country, DEFAULT_COUNTRY, validatePhoneNumber } from '../../../../shared/ui/phone-input/countries';

@Component({
    selector: 'app-booking-step-details',
    imports: [UiButton, UiPhoneInput],
    template: `
        <div class="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Your Details</h2>

            <div class="space-y-4 mb-6">
                <div>
                    <label
                        for="booking-name"
                        class="block text-sm font-semibold text-slate-900 mb-2"
                        >Full Name *</label
                    >
                    <input
                        id="booking-name"
                        type="text"
                        [value]="fullName"
                        (input)="fullNameChange.emit($any($event.target).value); showErrors = false"
                        placeholder="Ahmed Hassan"
                        maxlength="100"
                        [class]="'w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 outline-none transition-all ' + ((showErrors && (!fullName || fullName.length < 3)) ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100')"
                    />
                    @if (showErrors && !fullName) {
                        <p class="text-xs text-red-500 mt-1.5">Full name is required</p>
                    } @else if (showErrors && fullName.length < 3) {
                        <p class="text-xs text-red-500 mt-1.5">Full name must be at least 3 characters</p>
                    }
                </div>
                <div>
                    <label
                        for="booking-phone"
                        class="block text-sm font-semibold text-slate-900 mb-2"
                        >Phone Number *</label
                    >
                    <app-phone-input
                        id="booking-phone"
                        [phone]="phone"
                        [hasError]="showErrors && (!phone || !isValidPhone)"
                        (phoneChange)="onPhoneChange($event)"
                        (validChange)="isPhoneValid = $event"
                        (countryChange)="currentCountry = $event"
                    />
                    @if (showErrors && !phone) {
                        <p class="text-xs text-red-500 mt-1.5">Phone number is required</p>
                    } @else if (showErrors && !isValidPhone) {
                        <p class="text-xs text-red-500 mt-1.5">{{ phoneErrorMessage }}</p>
                    }
                </div>
                <div>
                    <label
                        for="booking-reason"
                        class="block text-sm font-semibold text-slate-900 mb-2"
                        >Reason for Visit (Optional)</label
                    >
                    <textarea
                        id="booking-reason"
                        [value]="reason"
                        (input)="reasonChange.emit($any($event.target).value)"
                        placeholder="Describe your symptoms or reason for consultation..."
                        rows="4"
                        maxlength="500"
                        class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                    ></textarea>
                    <p class="text-xs text-slate-400 mt-1 text-right">{{ reason.length }}/500</p>
                </div>
            </div>

            <div class="flex gap-3">
                <app-button variant="outline" (click)="back.emit()" class="w-full">Back</app-button>
                <app-button (click)="onNext()" class="w-full">Next</app-button>
            </div>
        </div>
    `,
})
export class BookingStepDetails implements OnInit {
    @Input() fullName = '';
    @Input() phone = '';
    @Input() reason = '';
    @Output() fullNameChange = new EventEmitter<string>();
    @Output() phoneChange = new EventEmitter<string>();
    @Output() reasonChange = new EventEmitter<string>();
    @Output() next = new EventEmitter<void>();
    @Output() back = new EventEmitter<void>();

    showErrors = false;
    isPhoneValid = false;
    currentCountry: Country = DEFAULT_COUNTRY;

    ngOnInit() {
        if (this.phone) {
            this.isPhoneValid = /^\+[1-9]\d{6,14}$/.test(this.phone);
        }
    }

    get isValidPhone(): boolean {
        return this.isPhoneValid || /^\+[1-9]\d{6,14}$/.test(this.phone);
    }

    get phoneErrorMessage(): string {
        if (this.currentCountry.code === 'EG') {
            return 'Enter a valid Egyptian mobile number (e.g. 10xxxxxxxx, 11xxxxxxxx, 12xxxxxxxx, 15xxxxxxxx)';
        }
        return `Enter a valid phone number for ${this.currentCountry.name} (e.g. ${this.currentCountry.placeholder})`;
    }

    onPhoneChange(val: string) {
        this.showErrors = false;
        this.phoneChange.emit(val);
    }

    onNext() {
        if (this.fullName && this.fullName.length >= 3 && this.phone && this.isValidPhone) {
            this.next.emit();
        } else {
            this.showErrors = true;
        }
    }
}

