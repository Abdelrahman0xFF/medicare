import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../shared/api.types';
import { AppointmentDto } from './appointment.types';

@Injectable({ providedIn: 'root' })
export class AppointmentApi {
    private http = inject(HttpClient);
    private base = '/api/appointment';

    getAll(params?: {
        page?: number;
        limit?: number;
        date?: string;
    }): Observable<PaginatedResponse<AppointmentDto>> {
        return this.http.get<PaginatedResponse<AppointmentDto>>(this.base, { params });
    }

    getSlots(date: string): Observable<string[]> {
        return this.http
            .get<ApiResponse<string[]>>(`${this.base}/slots`, { params: { date } })
            .pipe(map((res) => res.data!));
    }

    create(formData: FormData): Observable<ApiResponse<AppointmentDto>> {
        return this.http
            .post<ApiResponse<AppointmentDto>>(this.base, formData)
            .pipe(timeout(30000));
    }

    getPatientAppointments(phone: string, fullName: string, params?: { page?: number; limit?: number }): Observable<PaginatedResponse<AppointmentDto>> {
        return this.http
            .get<PaginatedResponse<AppointmentDto>>(`${this.base}/${phone}/${fullName}`, { params });
    }

    updateStatus(
        id: string,
        status: 'approved' | 'rejected' | 'completed',
    ): Observable<ApiResponse<AppointmentDto>> {
        return this.http.put<ApiResponse<AppointmentDto>>(`${this.base}/${id}`, { status });
    }

    reschedule(
        id: string,
        data: { date: string; time: string; phone: string; fullName: string },
    ): Observable<ApiResponse<AppointmentDto>> {
        return this.http.put<ApiResponse<AppointmentDto>>(`${this.base}/${id}/reschedule`, data);
    }

    checkIn(id: string): Observable<ApiResponse<unknown>> {
        return this.http.put<ApiResponse<unknown>>(`${this.base}/${id}/checkin`, {});
    }
}
