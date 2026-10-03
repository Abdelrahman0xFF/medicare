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
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
                (click)="viewApt = null"
                (keydown.escape)="viewApt = null"
                tabindex="0"
            >
                <div
                    class="fixed inset-0 bg-black/70"
                    (click)="viewApt = null"
                    (keydown.enter)="viewApt = null"
                    tabindex="0"
                ></div>
                <div
                    class="relative max-w-full max-h-full z-10"
                    (click)="$event.stopPropagation()"
                    (keydown.escape)="$event.stopPropagation()"
                    tabindex="-1"
                >
                    <button
                        type="button"
                        (click)="viewApt = null"
                        class="absolute -top-10 right-0 size-8 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition cursor-pointer"
                    >
                        <ng-icon name="fluentDismiss" size="20" />
                    </button>

                    @if (viewApt.receiptImageUrl) {
                        <img
                            [src]="viewApt.receiptImageUrl"
                            alt="Payment receipt"
                            class="max-w-full max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl object-contain"
                        />
                    } @else {
                        <div
                            class="bg-slate-800 rounded-lg h-64 w-80 flex items-center justify-center border border-slate-600"
                        >
                            <div class="text-center">
                                <ng-icon
                                    name="fluentImage"
                                    size="32"
                                    class="text-slate-500 mx-auto mb-2 block"
                                />
                                <p class="text-sm text-slate-400">No receipt uploaded</p>
                            </div>
                        </div>
                    }
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
