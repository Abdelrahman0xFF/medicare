import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts = signal<Toast[]>([]);
    private idCounter = 0;

    show(message: string, type: ToastType = 'info', durationMs = 4000) {
        const id = this.idCounter++;
        const toast = { id, message, type };
        this.toasts.update((current) => [...current, toast].slice(-5));

        setTimeout(() => this.remove(id), durationMs);
    }

    success(message: string, durationMs = 4000) {
        this.show(message, 'success', durationMs);
    }

    error(message: string, durationMs = 5000) {
        this.show(message, 'error', durationMs);
    }

    info(message: string, durationMs = 4000) {
        this.show(message, 'info', durationMs);
    }

    remove(id: number) {
        this.toasts.update((current) => current.filter((t) => t.id !== id));
    }
}
