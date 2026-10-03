import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private activeRequests = signal<number>(0);
    private loadingSignal = signal<boolean>(false);
    private timer: ReturnType<typeof setTimeout> | null = null;

    readonly isLoading = this.loadingSignal.asReadonly();

    show() {
        this.activeRequests.update((count) => count + 1);
        if (!this.loadingSignal() && !this.timer) {
            this.timer = setTimeout(() => {
                if (this.activeRequests() > 0) {
                    this.loadingSignal.set(true);
                }
                this.timer = null;
            }, 150);
        }
    }

    hide() {
        this.activeRequests.update((count) => {
            const next = Math.max(0, count - 1);
            if (next === 0) {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.loadingSignal.set(false);
            }
            return next;
        });
    }
}
