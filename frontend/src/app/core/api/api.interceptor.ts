import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { LoadingService } from '../services/loading.service';
import { catchError, tap, throwError, finalize } from 'rxjs';
import { ApiResponse } from './shared/api.types';
import { environment } from '../../../environments/environment';

export const SILENT_REQUEST = new HttpContextToken<boolean>(() => false);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);
    const loadingService = inject(LoadingService);

    loadingService.show();

    let url = req.url;
    if (url.startsWith('/api')) {
        const base = environment.apiUrl ? environment.apiUrl.replace(/\/+$/, '') : '';
        url = `${base}${url}`;
    }

    const authReq = req.clone({
        url: url,
        withCredentials: true
    });

    const isSilent = req.context.get(SILENT_REQUEST);

    return next(authReq).pipe(
        tap((event) => {
            if (event instanceof HttpResponse && event.body) {
                const body = event.body as ApiResponse<unknown>;
                if (body.success && body.message && req.method !== 'GET' && !isSilent) {
                    toastService.success(body.message);
                }
            }
        }),
        catchError((error: HttpErrorResponse) => {
            const isSilentAuthCheck =
                error.status === 401 &&
                (isSilent || (req.method === 'GET' && req.url.includes('/api/admin')));

            if (!isSilent && !isSilentAuthCheck) {
                let errorMsg = 'An unexpected error occurred. Please try again later.';

                if (error.error && error.error.message) {
                    errorMsg = error.error.message;
                } else if (error.status === 0) {
                    errorMsg = 'Cannot connect to the server. Please check your internet connection.';
                } else if (error.status === 404) {
                    errorMsg = 'The requested information could not be found.';
                } else if (error.status === 401) {
                    errorMsg = 'Your session has expired. Please log in again.';
                } else if (error.status === 403) {
                    errorMsg = 'You do not have permission to perform this action.';
                } else if (error.status >= 500) {
                    errorMsg = 'The server is temporarily unavailable. Please try again later.';
                }

                toastService.error(errorMsg);
            }

            return throwError(() => error);
        }),
        finalize(() => {
            loadingService.hide();
        })
    );
};
