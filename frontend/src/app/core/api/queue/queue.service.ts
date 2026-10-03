import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../shared/api.types';
import { QueueEntryDto } from './queue.types';

@Injectable({ providedIn: 'root' })
export class QueueApi {
    private http = inject(HttpClient);
    private base = '/api/queue';

    getAll(params?: {
        page?: number;
        limit?: number;
        date?: string;
    }): Observable<PaginatedResponse<QueueEntryDto>> {
        return this.http.get<PaginatedResponse<QueueEntryDto>>(this.base, { params });
    }

    updateStage(id: string, stage: 'waiting' | 'in_consultation' | 'completed'): Observable<{
        success: boolean;
        message: string;
        data: QueueEntryDto;
    }> {
        return this.http.put<{
            success: boolean;
            message: string;
            data: QueueEntryDto;
        }>(`${this.base}/${id}`, { stage });
    }
}
