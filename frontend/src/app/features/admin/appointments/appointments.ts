import { Component, OnInit, inject, signal } from '@angular/core';
import { AppointmentApi } from '../../../core/api/appointment/appointment.service';
import { AppointmentDto } from '../../../core/api/appointment/appointment.types';
import { AppointmentsToolbar } from './sections/toolbar';
import { AppointmentsTable } from './sections/table';
import { SpinnerComponent } from '../../../shared/ui/spinner/spinner';

@Component({
    selector: 'app-appointments',
    imports: [AppointmentsToolbar, AppointmentsTable, SpinnerComponent],
    template: `
        <div>
            <app-appointments-toolbar
                [filterTabs]="filterTabs"
                [selectedFilter]="selectedFilter()"
                (filterChange)="selectedFilter.set($event)"
            />

            @if (loading()) {
                <app-spinner message="Loading appointments..." />
            } @else {
                <app-appointments-table
                    [appointments]="displayAppointments"
                    [selectedFilter]="selectedFilter()"
                    [actionLoading]="actionLoading()"
                    (approve)="handleApprove($event)"
                    (reject)="handleReject($event)"
                />
            }
        </div>
    `,
})
export class Appointments implements OnInit {
    private appointmentApi = inject(AppointmentApi);

    appointments = signal<AppointmentDto[]>([]);
    selectedFilter = signal('all');
    actionLoading = signal<string | null>(null);
    loading = signal(true);

    ngOnInit() {
        this.appointmentApi.getAll({ limit: 100 }).subscribe({
            next: (res) => {
                this.appointments.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    get pendingCount() {
        return this.appointments().filter((a) => a.status === 'pending').length;
    }

    get approvedCount() {
        return this.appointments().filter((a) => a.status === 'approved').length;
    }

    get rejectedCount() {
        return this.appointments().filter((a) => a.status === 'rejected').length;
    }

    get filterTabs() {
        return [
            { key: 'all', label: 'All', count: this.appointments().length },
            { key: 'pending', label: 'Pending', count: this.pendingCount },
            { key: 'approved', label: 'Approved', count: this.approvedCount },
            { key: 'rejected', label: 'Rejected', count: this.rejectedCount },
        ];
    }

    get displayAppointments() {
        const filter = this.selectedFilter();
        const list =
            filter === 'all'
                ? this.appointments()
                : this.appointments().filter((a) => a.status === filter);
        return list.map((a) => {
            const patientObj = (a.patientId && typeof a.patientId === 'object') ? a.patientId : null;
            return {
                id: a.id,
                patientName: patientObj ? patientObj.fullName : 'Unknown Patient',
                date: a.date,
                time: a.time,
                phone: patientObj ? patientObj.phone : '',
                status: a.status,
                reason: a.reason || undefined,
                receiptImageUrl: a.receiptImageUrl || undefined,
            };
        });
    }

    handleApprove(id: string): void {
        this.actionLoading.set(id);
        this.appointmentApi.updateStatus(id, 'approved').subscribe({
            next: (res) => {
                this.appointments.update((list) =>
                    list.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a)),
                );
                this.actionLoading.set(null);
                if (res.smsStatus && res.smsStatus !== 'sent') {
                    console.warn('SMS status:', res.smsStatus);
                }
            },
            error: () => this.actionLoading.set(null),
        });
    }

    handleReject(id: string): void {
        this.actionLoading.set(id);
        this.appointmentApi.updateStatus(id, 'rejected').subscribe({
            next: () => {
                this.appointments.update((list) =>
                    list.map((a) => (a.id === id ? { ...a, status: 'rejected' as const } : a)),
                );
                this.actionLoading.set(null);
            },
            error: () => this.actionLoading.set(null),
        });
    }
}
