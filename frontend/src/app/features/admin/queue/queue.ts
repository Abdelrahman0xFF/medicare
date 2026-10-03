import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { fluentPeopleQueue, fluentCalendarCheckmark } from '@ng-icons/fluent-ui';
import { forkJoin } from 'rxjs';
import { AppointmentApi } from '../../../core/api/appointment/appointment.service';
import { QueueApi } from '../../../core/api/queue/queue.service';
import { QueueEntryDto } from '../../../core/api/queue/queue.types';
import { QueueKanban } from './sections/kanban';
import { QueueCheckinList } from './sections/checkin-list';
import { QueueCardItem, CheckInCandidate } from './queue.types';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';
import { SpinnerComponent } from '../../../shared/ui/spinner/spinner';

@Component({
    selector: 'app-queue',
    imports: [NgIcon, QueueKanban, QueueCheckinList, ScrollAnimateDirective, SpinnerComponent],
    viewProviders: [
        provideIcons({
            fluentPeopleQueue,
            fluentCalendarCheckmark,
        }),
    ],
    template: `
        <div>
            <div appScrollAnimate animateDirection="fade" class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl lg:text-3xl font-bold text-slate-900">Queue</h1>
                    <p class="text-slate-500 mt-1">
                        Patient flow - waiting, in consultation, and completed
                    </p>
                </div>
            </div>

            <div class="flex gap-2 mb-8 flex-wrap">
                @for (tab of viewTabs; track tab.key; let i = $index) {
                    <button
                        appScrollAnimate animateDirection="right" animateDelay="{{ i * 50 }}ms"
                        type="button"
                        (click)="selectedView = tab.key"
                        [class]="
                            'px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer inline-flex items-center gap-1.5 ' +
                            (selectedView === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900')
                        "
                    >
                        <ng-icon [name]="tab.icon" size="16" />
                        {{ tab.label }}
                    </button>
                }
            </div>

            @if (loading()) {
                <app-spinner message="Loading queue..." />
            } @else if (selectedView === 'queue') {
                <app-queue-kanban
                    [waitingEntries]="waitingCards()"
                    [consultationEntries]="consultationCards()"
                    [completedEntries]="completedCards()"
                    (moveToConsultation)="moveToConsultation($event)"
                    (moveToCompleted)="moveToCompleted($event)"
                />
            } @else if (selectedView === 'checkin') {
                <app-queue-checkin-list
                    [candidates]="checkInCandidates()"
                    (checkIn)="checkInFromAppointment($event)"
                />
            }
        </div>
    `,
})
export class Queue implements OnInit {
    private appointmentApi = inject(AppointmentApi);
    private queueApi = inject(QueueApi);

    selectedView: 'queue' | 'checkin' = 'queue';

    viewTabs = [
        { key: 'queue' as const, label: 'Live Queue', icon: 'fluentPeopleQueue' },
        { key: 'checkin' as const, label: 'Check In', icon: 'fluentCalendarCheckmark' },
    ];

    loading = signal(true);
    queueEntries = signal<QueueEntryDto[]>([]);
    todayAppointments = signal<CheckInCandidate[]>([]);

    private getPatientName(e: QueueEntryDto): string {
        if (e.appointmentId && typeof e.appointmentId === 'object' && e.appointmentId.patientId) {
            const p = e.appointmentId.patientId;
            return typeof p === 'object' && p.fullName ? p.fullName : 'Unknown Patient';
        }
        return 'Unknown Patient';
    }

    private getAppointmentTime(e: QueueEntryDto): string {
        if (e.appointmentId && typeof e.appointmentId === 'object' && e.appointmentId.time) {
            return e.appointmentId.time;
        }
        return e.time || '--:--';
    }

    private getTodayDateString(): string {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    waitingCards = computed<QueueCardItem[]>(() =>
        this.queueEntries()
            .filter((e) => e.stage === 'waiting')
            .map((e) => ({
                id: e.id,
                patientName: this.getPatientName(e),
                time: this.getAppointmentTime(e),
            })),
    );

    consultationCards = computed<QueueCardItem[]>(() =>
        this.queueEntries()
            .filter((e) => e.stage === 'in_consultation')
            .map((e) => ({
                id: e.id,
                patientName: this.getPatientName(e),
                time: this.getAppointmentTime(e),
            })),
    );

    completedCards = computed<QueueCardItem[]>(() =>
        this.queueEntries()
            .filter((e) => e.stage === 'completed')
            .map((e) => ({
                id: e.id,
                patientName: this.getPatientName(e),
                time: this.getAppointmentTime(e),
            })),
    );

    checkInCandidates = computed<CheckInCandidate[]>(() => {
        const queuedAppointmentIds = new Set(
            this.queueEntries()
                .map((e) => {
                    if (!e.appointmentId) return null;
                    if (typeof e.appointmentId === 'object') {
                        return (
                            e.appointmentId.id ||
                            (e.appointmentId as unknown as { _id?: string })._id ||
                            null
                        );
                    }
                    return e.appointmentId as unknown as string;
                })
                .filter(Boolean),
        );
        return this.todayAppointments().filter((a) => !queuedAppointmentIds.has(a.id));
    });

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.loading.set(true);
        const today = this.getTodayDateString();
        forkJoin({
            queue: this.queueApi.getAll({ date: today, limit: 100 }),
            appointments: this.appointmentApi.getAll({ date: today, limit: 100 }),
        }).subscribe({
            next: ({ queue, appointments }) => {
                this.queueEntries.set(queue.data);
                this.todayAppointments.set(
                    appointments.data
                        .filter(
                            (a) =>
                                a.status === 'approved' &&
                                !a.checkedIn &&
                                typeof a.patientId !== 'string' &&
                                a.patientId !== null,
                        )
                        .map((a) => ({
                            id: a.id,
                            patientName: (
                                a.patientId as { id: string; fullName: string; phone: string }
                            ).fullName,
                            time: a.time,
                            phone: (a.patientId as { id: string; fullName: string; phone: string })
                                .phone,
                            reason: a.reason,
                        })),
                );
            },
            error: (err) => console.error('Failed to load queue data', err),
            complete: () => this.loading.set(false),
        });
    }

    checkInFromAppointment(apt: CheckInCandidate) {
        this.appointmentApi.checkIn(apt.id).subscribe({
            next: () => {
                this.selectedView = 'queue';
                this.loadData();
            },
            error: (err) => console.error('Failed to check in', err),
        });
    }

    moveToConsultation(entry: QueueCardItem) {
        this.queueApi.updateStage(entry.id, 'in_consultation').subscribe({
            next: () => this.loadData(),
            error: (err) => console.error('Failed to move to consultation', err),
        });
    }

    moveToCompleted(entry: QueueCardItem) {
        this.queueApi.updateStage(entry.id, 'completed').subscribe({
            next: () => this.loadData(),
            error: (err) => console.error('Failed to move to completed', err),
        });
    }
}
