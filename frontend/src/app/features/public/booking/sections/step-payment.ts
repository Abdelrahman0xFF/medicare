import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    fluentAlert,
    fluentCheckmarkCircle,
    fluentCopy,
    fluentCheckmark,
    fluentCloudAdd,
    fluentDismiss,
    fluentOpen,
    fluentPhone,
} from '@ng-icons/fluent-ui';
import { UiButton } from '../../../../shared/ui/button';

@Component({
    selector: 'app-booking-step-payment',
    imports: [NgIcon, UiButton],
    viewProviders: [
        provideIcons({
            fluentAlert,
            fluentCheckmarkCircle,
            fluentCopy,
            fluentCheckmark,
            fluentCloudAdd,
            fluentDismiss,
            fluentOpen,
            fluentPhone,
        }),
    ],
    template: `
        <div class="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Payment Verification</h2>

            <div class="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
                <div class="flex justify-center">
                    <div class="space-y-3 w-full">
                        <div class="space-y-4">
                            <div class="flex items-center gap-3">
                                <ng-icon
                                    name="fluentAlert"
                                    size="20"
                                    class="text-amber-600 shrink-0 mt-0.5"
                                />
                                <p class="font-semibold text-slate-900">
                                    Please transfer the consultation fee:
                                </p>
                            </div>
                            <!-- InstaPay -->
                            @if (instapayLink) {
                                @if (isUrl(instapayLink)) {
                                    <a
                                        [href]="instapayLink"
                                        target="_blank"
                                        class="flex items-center gap-4 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-200 p-4 rounded-xl transition-colors cursor-pointer group shadow-sm"
                                    >
                                        <div
                                            class="size-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0"
                                        >
                                            <span class="font-bold text-sm">IP</span>
                                        </div>
                                        <div class="flex-1">
                                            <p class="font-semibold text-slate-900 text-lg">
                                                InstaPay
                                            </p>
                                            <p class="text-sm text-slate-500">
                                                Tap to open payment app
                                            </p>
                                        </div>
                                        <div
                                            class="size-10 rounded-full bg-slate-50 group-hover:bg-purple-100 text-slate-400 group-hover:text-purple-600 flex items-center justify-center transition-colors shrink-0"
                                        >
                                            <ng-icon name="fluentOpen" size="20" />
                                        </div>
                                    </a>
                                } @else {
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm"
                                    >
                                        <div class="flex items-center gap-4 flex-1">
                                            <div
                                                class="size-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0"
                                            >
                                                <span class="font-bold text-sm">IP</span>
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <p
                                                    class="text-sm font-medium text-slate-500 mb-0.5"
                                                >
                                                    InstaPay
                                                </p>
                                                <p
                                                    class="text-xl font-bold text-slate-900 truncate"
                                                >
                                                    {{ instapayLink }}
                                                </p>
                                            </div>
                                        </div>
                                        <app-button
                                            (click)="copyText(instapayLink, 'instapay')"
                                            variant="outline"
                                            class="w-full sm:w-auto shrink-0"
                                        >
                                            <ng-icon
                                                [name]="
                                                    copiedKey === 'instapay'
                                                        ? 'fluentCheckmark'
                                                        : 'fluentCopy'
                                                "
                                                size="18"
                                            />
                                            {{ copiedKey === 'instapay' ? 'Copied' : 'Copy Name' }}
                                        </app-button>
                                    </div>
                                }
                            }

                            <!-- Wallet -->
                            @if (walletNumber) {
                                <div
                                    class="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm"
                                >
                                    <div class="flex items-center gap-4 flex-1">
                                        <div
                                            class="size-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"
                                        >
                                            <ng-icon name="fluentPhone" size="24" />
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-sm font-medium text-slate-500 mb-0.5">
                                                Mobile Wallet
                                            </p>
                                            <p
                                                class="text-xl font-bold tracking-wider text-slate-900 truncate"
                                            >
                                                {{ walletNumber }}
                                            </p>
                                        </div>
                                    </div>
                                    <app-button
                                        (click)="copyText(walletNumber, 'wallet')"
                                        variant="outline"
                                        class="w-full sm:w-auto shrink-0"
                                    >
                                        <ng-icon
                                            [name]="
                                                copiedKey === 'wallet'
                                                    ? 'fluentCheckmark'
                                                    : 'fluentCopy'
                                            "
                                            size="18"
                                        />
                                        {{ copiedKey === 'wallet' ? 'Copied' : 'Copy Number' }}
                                    </app-button>
                                </div>
                            }
                        </div>
                        <p class="text-sm text-slate-600">
                            <strong>Fee:</strong> {{ consultationFee }} EGP
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <span class="block text-sm font-semibold text-slate-900 mb-3"
                    >Upload Payment Screenshot *</span
                >
                @if (!receiptFileName) {
                    <div
                        tabindex="0"
                        role="button"
                        [class]="
                            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 outline-none focus:ring-2 ' +
                            (isDragging
                                ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
                                : fileError || (showErrors && !receiptFileName)
                                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/20'
                                  : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/50 focus:border-blue-400 focus:ring-blue-100')
                        "
                        (click)="fileInput.click()"
                        (keydown.enter)="fileInput.click()"
                        (keydown.space)="fileInput.click(); $event.preventDefault()"
                        (dragover)="$event.preventDefault(); isDragging = true"
                        (dragleave)="isDragging = false"
                        (drop)="onFileDrop($event)"
                    >
                        @if (fileError) {
                            <p class="text-xs text-red-500 mb-2 font-medium">{{ fileError }}</p>
                        } @else if (showErrors && !receiptFileName) {
                            <p class="text-xs text-red-500 mb-2">Payment screenshot is required</p>
                        }
                        <ng-icon
                            name="fluentCloudAdd"
                            size="36"
                            [class]="isDragging ? 'text-blue-600 scale-110' : 'text-slate-400'"
                            class="mb-3 transition-transform"
                        />
                        <p class="font-medium text-slate-900 mb-1">
                            {{ isDragging ? 'Drop receipt image here' : 'Upload Payment Screenshot' }}
                        </p>
                        <p class="text-sm text-slate-500">
                            Drag & drop or <span class="text-blue-600 font-semibold underline underline-offset-2">browse</span>
                        </p>
                        <p class="text-xs text-slate-400 mt-1">PNG, JPG, or WebP, max 5MB</p>
                        <input
                            #fileInput
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            class="hidden"
                            (change)="onFileSelected($event)"
                        />
                    </div>
                } @else {
                    <div
                        class="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4 shadow-xs"
                    >
                        <div class="flex items-center gap-3.5 min-w-0">
                            @if (previewUrl) {
                                <img
                                    [src]="previewUrl"
                                    alt="Payment receipt preview"
                                    class="size-14 rounded-lg object-cover border border-emerald-300 shadow-xs shrink-0"
                                />
                            } @else {
                                <div
                                    class="size-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0"
                                >
                                    <ng-icon
                                        name="fluentCheckmarkCircle"
                                        size="24"
                                        class="text-emerald-600"
                                    />
                                </div>
                            }
                            <div class="min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                        <ng-icon name="fluentCheckmarkCircle" size="12" />
                                        Receipt Attached
                                    </span>
                                </div>
                                <p class="font-medium text-slate-900 text-sm truncate mt-0.5">
                                    {{ receiptFileName }}
                                </p>
                                <p class="text-xs text-slate-500">{{ receiptFileSizeKB }} KB</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            (click)="handleRemoveReceipt()"
                            title="Remove file"
                            class="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-xs transition cursor-pointer shrink-0"
                        >
                            <ng-icon name="fluentDismiss" size="18" />
                        </button>
                    </div>
                }
            </div>

            <div class="flex gap-3 mt-8">
                <app-button variant="outline" (click)="back.emit()" class="w-full">Back</app-button>
                <app-button (click)="onNext()" class="w-full">Review</app-button>
            </div>
        </div>
    `,
})
export class BookingStepPayment {
    @Input() instapayLink = '';
    @Input() walletNumber = '';
    @Input() consultationFee = 0;
    @Input() receiptFileName: string | null = null;
    @Input() receiptFileSizeKB = 0;
    @Output() fileSelected = new EventEmitter<File>();
    @Output() removeReceipt = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();
    @Output() back = new EventEmitter<void>();

    copiedKey = '';
    showErrors = false;
    fileError = '';
    isDragging = false;
    previewUrl: string | null = null;

    copyText(text: string, key: string) {
        navigator.clipboard.writeText(text);
        this.copiedKey = key;
        setTimeout(() => (this.copiedKey = ''), 2000);
    }

    isUrl(text: string): boolean {
        return (
            text.startsWith('http://') ||
            text.startsWith('https://') ||
            text.startsWith('instapay://')
        );
    }

    getWalletUssdLink(number: string, amount: number): string | null {
        if (!number || number.length < 11) return null;

        const prefix = number.substring(0, 3);
        const encodedHash = '%23';

        // Vodafone Cash
        if (prefix === '010') {
            return `tel:*9*7*${number}*${amount}${encodedHash}`;
        }
        // Etisalat Cash
        if (prefix === '011') {
            return `tel:*777*1*${number}*${amount}${encodedHash}`;
        }
        // Orange Cash
        if (prefix === '012') {
            return `tel:*115*1*2*${number}*${amount}${encodedHash}`;
        }

        return null;
    }

    onNext() {
        if (this.receiptFileName) {
            this.next.emit();
        } else {
            this.showErrors = true;
        }
    }

    processFile(file: File) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
            this.fileError = 'File must be a JPG, PNG, or WebP under 5MB';
            return;
        }

        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
        }
        this.previewUrl = URL.createObjectURL(file);
        this.fileError = '';
        this.fileSelected.emit(file);
        this.showErrors = false;
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        this.processFile(file);
        input.value = '';
    }

    onFileDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        this.processFile(file);
    }

    handleRemoveReceipt() {
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
            this.previewUrl = null;
        }
        this.removeReceipt.emit();
        this.showErrors = false;
        this.fileError = '';
    }
}
