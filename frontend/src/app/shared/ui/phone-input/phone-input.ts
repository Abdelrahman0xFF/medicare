import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    HostListener,
    ViewChild,
    signal,
    computed,
    OnInit,
    OnChanges,
    SimpleChanges,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Country, COUNTRIES, DEFAULT_COUNTRY, validatePhoneNumber } from './countries';

@Component({
    selector: 'app-phone-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="relative w-full" #containerRef>
            <!-- Clean Input Bar -->
            <div
                [class]="
                    'flex items-center rounded-lg border bg-white transition-all ' +
                    (hasError
                        ? 'border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'
                        : 'border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100')
                "
            >
                <!-- Country Trigger Button -->
                <button
                    type="button"
                    (click)="toggleDropdown($event)"
                    class="flex items-center gap-2 pl-3 pr-2.5 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer select-none shrink-0 outline-none rounded-l-lg text-slate-700"
                    [attr.aria-expanded]="isOpen()"
                    [title]="selectedCountry().name"
                >
                    <img
                        [src]="getFlagUrl(selectedCountry().code)"
                        [alt]="selectedCountry().name + ' flag'"
                        class="w-5 h-3.5 object-cover rounded-xs border border-slate-200/90 shadow-2xs shrink-0"
                    />
                    <span class="font-mono text-xs font-semibold text-slate-600">+{{ selectedCountry().dialCode }}</span>
                    <svg
                        class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                        [class.rotate-180]="isOpen()"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Subtle Divider -->
                <span class="h-4 w-px bg-slate-200 shrink-0"></span>

                <!-- Phone Input -->
                <input
                    [id]="id"
                    #phoneInputRef
                    type="tel"
                    inputmode="numeric"
                    [value]="nationalNumber()"
                    (input)="onPhoneInput($any($event.target).value)"
                    [placeholder]="selectedCountry().placeholder"
                    maxlength="15"
                    class="w-full px-3 py-2.5 bg-transparent text-sm text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans outline-none"
                />
            </div>

            <!-- Clean Dropdown Menu -->
            @if (isOpen()) {
                <div
                    class="absolute z-50 left-0 top-full mt-1.5 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-in fade-in duration-100"
                >
                    <!-- Search Input -->
                    <div class="p-2 border-b border-slate-100">
                        <input
                            #searchInputRef
                            type="text"
                            [value]="searchQuery()"
                            (input)="searchQuery.set($any($event.target).value)"
                            placeholder="Search country or code..."
                            class="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition-all"
                        />
                    </div>

                    <!-- Countries List -->
                    <div class="max-h-60 overflow-y-auto py-1">
                        @if (filteredCountries().length === 0) {
                            <div class="px-3 py-4 text-center text-xs text-slate-400">
                                No countries found
                            </div>
                        }

                        @for (country of filteredCountries(); track country.code + country.dialCode) {
                            <button
                                type="button"
                                (click)="selectCountry(country)"
                                [class]="
                                    'w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ' +
                                    (country.code === selectedCountry().code
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-slate-700 hover:bg-slate-50')
                                "
                            >
                                <div class="flex items-center gap-2.5 truncate">
                                    <img
                                        [src]="getFlagUrl(country.code)"
                                        [alt]="country.name + ' flag'"
                                        class="w-5 h-3.5 object-cover rounded-xs border border-slate-200/90 shadow-2xs shrink-0"
                                        loading="lazy"
                                    />
                                    <span class="truncate">{{ country.name }}</span>
                                </div>
                                <span
                                    class="font-mono text-xs shrink-0 ml-2"
                                    [class]="country.code === selectedCountry().code ? 'text-blue-600 font-semibold' : 'text-slate-400'"
                                >
                                    +{{ country.dialCode }}
                                </span>
                            </button>
                        }
                    </div>
                </div>
            }
        </div>
    `,
})
export class UiPhoneInput implements OnInit, OnChanges {
    private elementRef = inject(ElementRef);

    @Input() phone = '';
    @Input() hasError = false;
    @Input() id = 'phone-input';
    @Input() defaultCountryCode = 'EG';

    @Output() phoneChange = new EventEmitter<string>();
    @Output() validChange = new EventEmitter<boolean>();
    @Output() countryChange = new EventEmitter<Country>();

    @ViewChild('phoneInputRef') phoneInputRef?: ElementRef<HTMLInputElement>;
    @ViewChild('searchInputRef') searchInputRef?: ElementRef<HTMLInputElement>;

    selectedCountry = signal<Country>(DEFAULT_COUNTRY);
    nationalNumber = signal<string>('');
    isOpen = signal<boolean>(false);
    searchQuery = signal<string>('');

    filteredCountries = computed(() => {
        const query = this.searchQuery().trim().toLowerCase();
        if (!query) {
            return COUNTRIES;
        }
        return COUNTRIES.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.dialCode.includes(query) ||
                c.code.toLowerCase().includes(query),
        );
    });

    get isValid(): boolean {
        return validatePhoneNumber(this.selectedCountry().dialCode, this.nationalNumber());
    }

    getFlagUrl(code: string): string {
        return `https://flagcdn.com/${code.toLowerCase()}.svg`;
    }

    ngOnInit() {
        const defaultMatch = COUNTRIES.find((c) => c.code === this.defaultCountryCode);
        if (defaultMatch) {
            this.selectedCountry.set(defaultMatch);
        }
        this.parseIncomingPhone(this.phone);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['phone'] && !changes['phone'].firstChange) {
            const currentFull = this.getFullPhone();
            if (this.phone !== currentFull) {
                this.parseIncomingPhone(this.phone);
            }
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
            this.searchQuery.set('');
        }
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        this.isOpen.set(false);
        this.searchQuery.set('');
    }

    toggleDropdown(event: MouseEvent) {
        event.stopPropagation();
        const willOpen = !this.isOpen();
        this.isOpen.set(willOpen);
        if (willOpen) {
            this.searchQuery.set('');
            setTimeout(() => {
                this.searchInputRef?.nativeElement?.focus();
            }, 50);
        }
    }

    selectCountry(country: Country) {
        this.selectedCountry.set(country);
        this.isOpen.set(false);
        this.searchQuery.set('');
        this.countryChange.emit(country);
        this.emitChanges();
        setTimeout(() => {
            this.phoneInputRef?.nativeElement?.focus();
        }, 50);
    }

    onPhoneInput(value: string) {
        let raw = value.trim();

        if (raw.startsWith('+') || raw.startsWith('00')) {
            const clean = raw.replace(/^00/, '+');
            const detected = this.detectCountryFromFullNumber(clean);
            if (detected) {
                this.selectedCountry.set(detected.country);
                raw = detected.nationalNumber;
            }
        }

        let digits = raw.replace(/\D/g, '');

        if (this.selectedCountry().dialCode === '20') {
            if (digits.startsWith('0')) {
                digits = digits.substring(1);
            }
            if (digits.startsWith('20') && digits.length > 10) {
                digits = digits.substring(2);
            }
        } else if (digits.startsWith('0')) {
            digits = digits.substring(1);
        }

        this.nationalNumber.set(digits);
        this.emitChanges();
    }

    private emitChanges() {
        const fullPhone = this.getFullPhone();
        this.phoneChange.emit(fullPhone);
        this.validChange.emit(this.isValid);
    }

    private getFullPhone(): string {
        const num = this.nationalNumber();
        if (!num) return '';
        return `+${this.selectedCountry().dialCode}${num}`;
    }

    private parseIncomingPhone(incoming: string) {
        if (!incoming) {
            this.nationalNumber.set('');
            return;
        }

        const detected = this.detectCountryFromFullNumber(incoming);
        if (detected) {
            this.selectedCountry.set(detected.country);
            this.nationalNumber.set(detected.nationalNumber);
        } else {
            let digits = incoming.replace(/\D/g, '');
            if (digits.startsWith('20') && digits.length >= 11) {
                digits = digits.substring(2);
            } else if (digits.startsWith('01') && digits.length === 11) {
                digits = digits.substring(1);
            }
            this.nationalNumber.set(digits);
        }
    }

    private detectCountryFromFullNumber(
        full: string,
    ): { country: Country; nationalNumber: string } | null {
        let clean = full.trim();
        if (clean.startsWith('00')) {
            clean = '+' + clean.substring(2);
        }
        if (clean.startsWith(' ')) {
            clean = '+' + clean.trim();
        }

        const digits = clean.replace(/\D/g, '');
        if (!digits) return null;

        const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

        if (clean.startsWith('+')) {
            for (const c of sorted) {
                if (digits.startsWith(c.dialCode)) {
                    return {
                        country: c,
                        nationalNumber: digits.substring(c.dialCode.length),
                    };
                }
            }
        }

        for (const c of sorted) {
            if (digits.startsWith(c.dialCode) && digits.length > c.dialCode.length + 3) {
                return {
                    country: c,
                    nationalNumber: digits.substring(c.dialCode.length),
                };
            }
        }

        if (digits.startsWith('01') && digits.length === 11) {
            const eg = COUNTRIES.find((c) => c.code === 'EG') || DEFAULT_COUNTRY;
            return {
                country: eg,
                nationalNumber: digits.substring(1),
            };
        }

        return null;
    }
}
