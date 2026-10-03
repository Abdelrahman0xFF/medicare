import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { fluentCalendarClock, fluentSearch, fluentDismiss } from '@ng-icons/fluent-ui';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
    viewProviders: [provideIcons({ fluentCalendarClock, fluentSearch, fluentDismiss })],
    selector: 'app-appointments-toolbar',
    imports: [NgIcon, ScrollAnimateDirective],
    template: `
        <div
            appScrollAnimate
            animateDirection="fade"
            class="flex items-center justify-between mb-6"
        >
            <div>
                <h1 class="text-2xl lg:text-3xl font-bold text-slate-900">Appointments</h1>
                <p class="text-slate-500 mt-1">Manage patient appointment requests</p>
            </div>
            <ng-icon name="fluentCalendarClock" size="24" class="text-slate-300" />
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div class="flex gap-2 flex-wrap">
                @for (tab of filterTabs; track tab.key; let i = $index) {
                    <button
                        appScrollAnimate
                        animateDirection="right"
                        animateDelay="{{ i * 50 }}ms"
                        type="button"
                        (click)="filterChange.emit(tab.key)"
                        [class]="
                            'px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer capitalize ' +
                            (selectedFilter === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900')
                        "
                    >
                        {{ tab.label }}
                        @if (tab.count > 0) {
                            <span
                                [class]="
                                    'ml-1.5 px-1.5 py-0.5 rounded-full text-xs ' +
                                    (selectedFilter === tab.key
                                        ? 'bg-white/20'
                                        : 'bg-slate-200 text-slate-600')
                                "
                            >
                                {{ tab.count }}
                            </span>
                        }
                    </button>
                }
            </div>

            <!-- Live Search -->
            <div class="relative w-full sm:w-72">
                <ng-icon
                    name="fluentSearch"
                    size="18"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                    type="text"
                    [value]="searchQuery"
                    (input)="searchChange.emit($any($event.target).value)"
                    placeholder="Search by name or phone..."
                    class="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-2xs"
                />
                @if (searchQuery) {
                    <button
                        type="button"
                        (click)="searchChange.emit('')"
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        title="Clear search"
                    >
                        <ng-icon name="fluentDismiss" size="14" />
                    </button>
                }
            </div>
        </div>
    `,
})
export class AppointmentsToolbar {
    @Input() filterTabs: { key: string; label: string; count: number }[] = [];
    @Input() selectedFilter = 'all';
    @Input() searchQuery = '';
    @Output() filterChange = new EventEmitter<string>();
    @Output() searchChange = new EventEmitter<string>();
}
