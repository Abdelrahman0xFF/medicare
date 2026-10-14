import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    fluentClock,
    fluentCheckmarkCircle,
    fluentArrowRight,
    fluentPeopleQueue,
    fluentDocumentBulletList,
} from '@ng-icons/fluent-ui';
import { QueueCardItem } from '../queue.types';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
    selector: 'app-queue-kanban',
    imports: [NgIcon, ScrollAnimateDirective],
    viewProviders: [
        provideIcons({
            fluentClock,
            fluentCheckmarkCircle,
            fluentArrowRight,
            fluentPeopleQueue,
            fluentDocumentBulletList,
        }),
    ],
    template: `
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
            <div
                appScrollAnimate animateDirection="up" animateDelay="0ms"
                class="flex-1 flex flex-col rounded-xl border border-amber-200 bg-amber-50/40 overflow-hidden"
            >
                <div
                    class="flex items-center gap-2 px-5 py-3.5 bg-amber-50 border-b border-amber-200"
                >
                    <ng-icon name="fluentPeopleQueue" size="20" class="text-amber-600 shrink-0" />
                    <h3 class="font-semibold text-amber-900 text-sm">Waiting</h3>
                    <span
                        class="ml-auto size-6 rounded-full bg-amber-100 flex items-center justify-center"
                    >
                        <span class="text-amber-700 font-semibold text-xs">{{
                            waitingEntries.length
                        }}</span>
                    </span>
                </div>
                <div class="flex-1 p-4 space-y-3 min-h-50">
                    @if (waitingEntries.length > 0) {
                        @for (entry of waitingEntries; track entry.id; let i = $index) {
                            <div
                                appScrollAnimate animateDirection="zoom" animateDelay="{{ i * 50 }}ms"
                                class="bg-white rounded-lg border border-amber-200 p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div class="flex items-start justify-between gap-3">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <div
                                            class="size-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0"
                                        >
                                            <span class="text-amber-700 font-semibold text-sm">{{
                                                entry.patientName.charAt(0)
                                            }}</span>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="font-medium text-slate-900 text-sm truncate">
                                                {{ entry.patientName }}
                                            </p>
                                            <div class="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                                                <ng-icon
                                                    name="fluentClock"
                                                    size="13"
                                                    class="text-amber-500 shrink-0"
                                                />
                                                <span>{{ entry.timeLabel }} {{ entry.operationalTime }}</span>
                                                @if (entry.elapsedText) {
                                                    <span class="text-slate-300">·</span>
                                                    <span class="text-amber-700 font-medium bg-amber-100/60 px-1.5 py-0.5 rounded text-[11px]">{{ entry.elapsedText }}</span>
                                                }
                                            </div>
                                            @if (entry.appointmentTime && entry.appointmentTime !== '--:--') {
                                                <p class="text-[11px] text-slate-400 mt-0.5">
                                                    Appt: {{ entry.appointmentTime }}
                                                </p>
                                            }
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        (click)="moveToConsultation.emit(entry)"
                                        title="Send to consultation"
                                        class="size-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition cursor-pointer shrink-0"
                                    >
                                        <ng-icon name="fluentArrowRight" size="18" />
                                    </button>
                                </div>
                            </div>
                        }
                    } @else {
                        <div class="flex flex-col items-center justify-center py-10 text-center">
                            <span
                                class="size-10 rounded-full bg-amber-100 flex items-center justify-center mb-3"
                            >
                                <ng-icon
                                    name="fluentPeopleQueue"
                                    size="18"
                                    class="text-amber-400"
                                />
                            </span>
                            <p class="text-sm font-medium text-amber-700">No patients waiting</p>
                        </div>
                    }
                </div>
            </div>

            <div class="hidden lg:flex items-center justify-center shrink-0">
                <ng-icon name="fluentArrowRight" size="24" class="text-slate-300" />
            </div>

            <div
                appScrollAnimate animateDirection="up" animateDelay="100ms"
                class="flex-1 flex flex-col rounded-xl border border-blue-200 bg-blue-50/40 overflow-hidden"
            >
                <div
                    class="flex items-center gap-2 px-5 py-3.5 bg-blue-50 border-b border-blue-200"
                >
                    <ng-icon
                        name="fluentDocumentBulletList"
                        size="20"
                        class="text-blue-600 shrink-0"
                    />
                    <h3 class="font-semibold text-blue-900 text-sm">In Consultation</h3>
                    <span
                        class="ml-auto size-6 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                        <span class="text-blue-700 font-semibold text-xs">{{
                            consultationEntries.length
                        }}</span>
                    </span>
                </div>
                <div class="flex-1 p-4 space-y-3 min-h-50">
                    @if (consultationEntries.length > 0) {
                        @for (entry of consultationEntries; track entry.id; let i = $index) {
                            <div
                                appScrollAnimate animateDirection="zoom" animateDelay="{{ i * 50 }}ms"
                                class="bg-white rounded-lg border border-blue-200 p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div class="flex items-start justify-between gap-3">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <div
                                            class="size-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0"
                                        >
                                            <span class="text-blue-700 font-semibold text-sm">{{
                                                entry.patientName.charAt(0)
                                            }}</span>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="font-medium text-slate-900 text-sm truncate">
                                                {{ entry.patientName }}
                                            </p>
                                            <div class="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                                                <ng-icon
                                                    name="fluentClock"
                                                    size="13"
                                                    class="text-blue-500 shrink-0"
                                                />
                                                <span>{{ entry.timeLabel }} {{ entry.operationalTime }}</span>
                                                @if (entry.elapsedText) {
                                                    <span class="text-slate-300">·</span>
                                                    <span class="text-blue-700 font-medium bg-blue-100/60 px-1.5 py-0.5 rounded text-[11px]">{{ entry.elapsedText }}</span>
                                                }
                                            </div>
                                            @if (entry.appointmentTime && entry.appointmentTime !== '--:--') {
                                                <p class="text-[11px] text-slate-400 mt-0.5">
                                                    Appt: {{ entry.appointmentTime }}
                                                </p>
                                            }
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        (click)="moveToCompleted.emit(entry)"
                                        title="Mark as completed"
                                        class="size-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition cursor-pointer shrink-0"
                                    >
                                        <ng-icon name="fluentCheckmarkCircle" size="18" />
                                    </button>
                                </div>
                            </div>
                        }
                    } @else {
                        <div class="flex flex-col items-center justify-center py-10 text-center">
                            <span
                                class="size-10 rounded-full bg-blue-100 flex items-center justify-center mb-3"
                            >
                                <ng-icon
                                    name="fluentDocumentBulletList"
                                    size="18"
                                    class="text-blue-400"
                                />
                            </span>
                            <p class="text-sm font-medium text-blue-700">No active consultation</p>
                        </div>
                    }
                </div>
            </div>

            <div class="hidden lg:flex items-center justify-center shrink-0">
                <ng-icon name="fluentArrowRight" size="24" class="text-slate-300" />
            </div>

            <div
                appScrollAnimate animateDirection="up" animateDelay="200ms"
                class="flex-1 flex flex-col rounded-xl border border-emerald-200 bg-emerald-50/40 overflow-hidden"
            >
                <div
                    class="flex items-center gap-2 px-5 py-3.5 bg-emerald-50 border-b border-emerald-200"
                >
                    <ng-icon
                        name="fluentCheckmarkCircle"
                        size="20"
                        class="text-emerald-600 shrink-0"
                    />
                    <h3 class="font-semibold text-emerald-900 text-sm">Completed</h3>
                    <span
                        class="ml-auto size-6 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                        <span class="text-emerald-700 font-semibold text-xs">{{
                            completedEntries.length
                        }}</span>
                    </span>
                </div>
                <div class="flex-1 p-4 space-y-3 min-h-50">
                    @if (completedEntries.length > 0) {
                        @for (entry of completedEntries; track entry.id; let i = $index) {
                            <div
                                appScrollAnimate animateDirection="zoom" animateDelay="{{ i * 50 }}ms"
                                class="bg-white rounded-lg border border-emerald-200 p-4 shadow-xs opacity-75 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:opacity-100"
                            >
                                <div class="flex items-center gap-3">
                                    <div
                                        class="size-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"
                                    >
                                        <span class="text-emerald-700 font-semibold text-sm">{{
                                            entry.patientName.charAt(0)
                                        }}</span>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="font-medium text-slate-900 text-sm truncate">
                                            {{ entry.patientName }}
                                        </p>
                                        <div class="flex items-center gap-1.5 mt-0.5 text-xs text-emerald-600">
                                            <ng-icon
                                                name="fluentCheckmarkCircle"
                                                size="13"
                                                class="text-emerald-500 shrink-0"
                                            />
                                            <span>Completed {{ entry.operationalTime }}</span>
                                            @if (entry.elapsedText) {
                                                <span class="text-slate-300">·</span>
                                                <span class="text-emerald-700 font-medium bg-emerald-100/60 px-1.5 py-0.5 rounded text-[11px]">{{ entry.elapsedText }}</span>
                                            }
                                        </div>
                                        @if (entry.appointmentTime && entry.appointmentTime !== '--:--') {
                                            <p class="text-[11px] text-slate-400 mt-0.5">
                                                Appt: {{ entry.appointmentTime }}
                                            </p>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    } @else {
                        <div class="flex flex-col items-center justify-center py-10 text-center">
                            <span
                                class="size-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3"
                            >
                                <ng-icon
                                    name="fluentCheckmarkCircle"
                                    size="18"
                                    class="text-emerald-400"
                                />
                            </span>
                            <p class="text-sm font-medium text-emerald-700">No completed yet</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
})
export class QueueKanban {
    @Input() waitingEntries: QueueCardItem[] = [];
    @Input() consultationEntries: QueueCardItem[] = [];
    @Input() completedEntries: QueueCardItem[] = [];
    @Output() moveToConsultation = new EventEmitter<QueueCardItem>();
    @Output() moveToCompleted = new EventEmitter<QueueCardItem>();
}
