import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    fluentEye,
    fluentCheckmark,
    fluentDismiss,
    fluentCalendarClock,
    fluentPerson,
    fluentPhone,
    fluentDocumentText,
    fluentMoney,
    fluentImage,
} from '@ng-icons/fluent-ui';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
    viewProviders: [
        provideIcons({
            fluentEye,
            fluentCheckmark,
            fluentDismiss,
            fluentCalendarClock,
            fluentPerson,
            fluentPhone,
            fluentDocumentText,
            fluentMoney,
            fluentImage,
        }),
    ],
    selector: 'app-appointments-table',
    imports: [NgIcon, ScrollAnimateDirective],
    template: `
        <div class="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 bg-slate-50/50">
                            <th
                                class="px-6 py-3.5 text-left font-semibold text-slate-900 text-xs uppercase tracking-wider"
                            >
                                Patient
                            </th>
                            <th
                                class="px-6 py-3.5 text-left font-semibold text-slate-900 text-xs uppercase tracking-wider"
                            >
                                Date & Time
                            </th>
                            <th
                                class="px-6 py-3.5 text-left font-semibold text-slate-900 text-xs uppercase tracking-wider hidden md:table-cell"
                            >
                                Phone
                            </th>
                            <th
                                class="px-6 py-3.5 text-left font-semibold text-slate-900 text-xs uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                class="px-6 py-3.5 text-right font-semibold text-slate-900 text-xs uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @if (appointments.length > 0) {
                            @for (apt of appointments; track apt.id; let i = $index) {
                                <tr
                                    appScrollAnimate
                                    animateDirection="fade"
                                    animateDelay="{{ i * 50 }}ms"
                                    class="transition-colors hover:bg-slate-50"
                                >
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="size-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
                                            >
                                                <span class="text-slate-600 font-semibold text-sm">
                                                    {{ apt.patientName.charAt(0) }}
                                                </span>
                                            </div>
                                            <div>
                                                <p class="font-medium text-slate-900">
                                                    {{ apt.patientName }}
                                                </p>
                                                @if (apt.reason) {
                                                    <p
                                                        class="text-xs text-slate-500 mt-0.5 line-clamp-1"
                                                    >
                                                        {{ apt.reason }}
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-2">
                                            <ng-icon
                                                name="fluentCalendarClock"
                                                size="16"
                                                class="text-slate-400 shrink-0"
                                            />
                                            <span class="text-slate-700">
                                                {{ apt.date }}
                                                <span class="text-slate-400">at</span>
                                                {{ apt.time }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                        <span class="text-slate-600 font-mono text-sm">
                                            {{ apt.phone }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span [class]="statusBadgeClass(apt.status)">
                                            {{
                                                apt.status.charAt(0).toUpperCase() +
                                                    apt.status.slice(1)
                                            }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right">
                                        <div class="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                (click)="viewApt = apt"
                                                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                            >
                                                <ng-icon name="fluentEye" size="16" />
                                                <span class="hidden sm:inline">View</span>
                                            </button>

                                            @if (apt.status === 'pending') {
                                                <button
                                                    type="button"
                                                    (click)="approve.emit(apt.id)"
                                                    [disabled]="actionLoading === apt.id"
                                                    class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    @if (actionLoading === apt.id) {
                                                        <span
                                                            class="size-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"
                                                        ></span>
                                                    } @else {
                                                        <ng-icon name="fluentCheckmark" size="16" />
                                                    }
                                                    <span class="hidden sm:inline">Approve</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    (click)="reject.emit(apt.id)"
                                                    [disabled]="actionLoading === apt.id"
                                                    class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    @if (actionLoading === apt.id) {
                                                        <span
                                                            class="size-3.5 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"
                                                        ></span>
                                                    } @else {
                                                        <ng-icon name="fluentDismiss" size="16" />
                                                    }
                                                    <span class="hidden sm:inline">Reject</span>
                                                </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            }
                        } @else {
                            <tr>
                                <td colspan="5" class="px-6 py-16 text-center">
                                    <div
                                        class="size-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"
                                    >
                                        <ng-icon
                                            name="fluentCalendarClock"
                                            size="24"
                                            class="text-slate-400"
                                        />
                                    </div>
                                    <p class="text-slate-500 font-medium">
                                        No {{ selectedFilter === 'all' ? '' : selectedFilter }}
                                        appointments found
                                    </p>
                                    <p class="text-slate-400 text-sm mt-1">
                                        {{
                                            selectedFilter === 'all'
                                                ? 'Appointments will appear here when patients book.'
                                                : 'No appointments match this filter.'
                                        }}
                                    </p>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>

        @if (viewApt) {
            <div
                class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                (click)="viewApt = null"
                (keydown.escape)="viewApt = null"
                tabindex="0"
                role="dialog"
            >
                <div
                    class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                    (click)="viewApt = null"
                    (keydown.enter)="viewApt = null"
                    tabindex="0"
                ></div>
                <div
                    class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 z-10 max-h-[90vh] flex flex-col overflow-hidden"
                    (click)="$event.stopPropagation()"
                    (keydown.escape)="$event.stopPropagation()"
                    tabindex="-1"
                >
                    <!-- Modal Header -->
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="size-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                                {{ viewApt.patientName.charAt(0) }}
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-slate-900 text-base leading-tight truncate">{{ viewApt.patientName }}</h3>
                                <p class="text-xs text-slate-500 mt-0.5">Appointment Details & Verification</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <span [class]="statusBadgeClass(viewApt.status)">
                                {{ viewApt.status.charAt(0).toUpperCase() + viewApt.status.slice(1) }}
                            </span>
                            <button
                                type="button"
                                (click)="viewApt = null"
                                class="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            >
                                <ng-icon name="fluentDismiss" size="18" />
                            </button>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto space-y-5">
                        <!-- Key info cards -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <ng-icon name="fluentCalendarClock" size="20" class="text-blue-600 shrink-0" />
                                <div>
                                    <p class="text-xs text-slate-500 font-medium">Date & Time</p>
                                    <p class="text-sm font-semibold text-slate-900">{{ viewApt.date }} at {{ viewApt.time }}</p>
                                </div>
                            </div>
                            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-3 min-w-0">
                                    <ng-icon name="fluentPhone" size="20" class="text-emerald-600 shrink-0" />
                                    <div class="min-w-0">
                                        <p class="text-xs text-slate-500 font-medium">Phone</p>
                                        <p class="text-sm font-semibold text-slate-900 font-mono truncate">{{ viewApt.phone }}</p>
                                    </div>
                                </div>
                                <a
                                    [href]="'tel:' + viewApt.phone"
                                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition shrink-0"
                                >
                                    Call
                                </a>
                            </div>
                        </div>

                        <!-- Reason for Visit -->
                        @if (viewApt.reason) {
                            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div class="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    <ng-icon name="fluentDocumentText" size="14" class="text-slate-400" />
                                    <span>Reason for Visit</span>
                                </div>
                                <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{{ viewApt.reason }}</p>
                            </div>
                        }

                        <!-- Payment Receipt -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-semibold text-slate-700 uppercase tracking-wider">Payment Receipt</span>
                                @if (viewApt.receiptImageUrl) {
                                    <a
                                        [href]="viewApt.receiptImageUrl"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        Open Full Size &nearr;
                                    </a>
                                }
                            </div>
                            @if (viewApt.receiptImageUrl) {
                                <div class="rounded-xl border border-slate-200 overflow-hidden bg-slate-900/5 max-h-72 flex items-center justify-center p-2">
                                    <img
                                        [src]="viewApt.receiptImageUrl"
                                        alt="Payment receipt"
                                        class="max-h-68 w-auto rounded-lg shadow-sm object-contain"
                                    />
                                </div>
                            } @else {
                                <div class="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                                    <ng-icon name="fluentImage" size="28" class="text-slate-400 mx-auto mb-1.5 block" />
                                    <p class="text-sm text-slate-500 font-medium">No receipt image uploaded</p>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Modal Footer with actions -->
                    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0">
                        <button
                            type="button"
                            (click)="viewApt = null"
                            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            Close
                        </button>

                        @if (viewApt.status === 'pending') {
                            <div class="flex items-center gap-2">
                                <button
                                    type="button"
                                    (click)="reject.emit(viewApt.id); viewApt = null"
                                    [disabled]="actionLoading === viewApt.id"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                                >
                                    <ng-icon name="fluentDismiss" size="16" />
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    (click)="approve.emit(viewApt.id); viewApt = null"
                                    [disabled]="actionLoading === viewApt.id"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
                                >
                                    <ng-icon name="fluentCheckmark" size="16" />
                                    Approve
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
    `,
})
export class AppointmentsTable {
    @Input() appointments: {
        id: string;
        patientName: string;
        date: string;
        time: string;
        phone: string;
        status: string;
        reason?: string;
        receiptImageUrl?: string;
    }[] = [];
    @Input() selectedFilter = 'all';
    @Input() actionLoading: string | null = null;
    @Output() approve = new EventEmitter<string>();
    @Output() reject = new EventEmitter<string>();

    viewApt: (typeof this.appointments)[0] | null = null;

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        if (this.viewApt) {
            this.viewApt = null;
        }
    }

    statusBadgeClass(status: string): string {
        const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
        switch (status) {
            case 'pending':
                return `${base} bg-amber-100 text-amber-700`;
            case 'approved':
                return `${base} bg-blue-100 text-blue-700`;
            case 'rejected':
            case 'cancelled':
                return `${base} bg-rose-100 text-rose-700`;
            default:
                return `${base} bg-slate-100 text-slate-700`;
        }
    }
}
