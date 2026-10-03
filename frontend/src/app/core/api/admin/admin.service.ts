import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/api.types';
import { AdminDto, LoginRequest, CreateAdminRequest, DashboardStats } from './admin.types';
import { SILENT_REQUEST } from '../api.interceptor';

@Injectable({ providedIn: 'root' })
export class AdminApi {
    private http = inject(HttpClient);
    private base = '/api/admin';

    login(data: LoginRequest): Observable<ApiResponse<{ admin: AdminDto }>> {
        return this.http.post<ApiResponse<{ admin: AdminDto }>>(`${this.base}/login`, data);
    }

    getProfile(): Observable<ApiResponse<AdminDto>> {
        return this.http.get<ApiResponse<AdminDto>>(this.base, {
            context: new HttpContext().set(SILENT_REQUEST, true),
        });
    }

    getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
        return this.http.get<ApiResponse<DashboardStats>>(`${this.base}/dashboard`);
    }

    getAllAdmins(): Observable<ApiResponse<AdminDto[]>> {
        return this.http.get<ApiResponse<AdminDto[]>>(`${this.base}/all`);
    }

    createAdmin(data: CreateAdminRequest): Observable<ApiResponse<{ admin: AdminDto }>> {
        return this.http.post<ApiResponse<{ admin: AdminDto }>>(this.base, data);
    }

    deleteAdmin(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
    }

    logout(): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.base}/logout`, {});
    }
}
