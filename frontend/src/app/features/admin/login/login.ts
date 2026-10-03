import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { fluentEye, fluentEyeOff, fluentLockClosed, fluentPerson } from '@ng-icons/fluent-ui';
import { AuthService } from '../../../core/auth/auth.service';
import { UiButton } from '../../../shared/ui/button';
import { AppLogo } from '../../../shared/ui/logo';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

@Component({
    viewProviders: [provideIcons({ fluentLockClosed, fluentPerson, fluentEye, fluentEyeOff })],
    selector: 'app-login',
    imports: [NgIcon, RouterLink, UiButton, ScrollAnimateDirective, AppLogo],
    template: `
        <div class="min-h-dvh bg-slate-50 flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <a routerLink="/" class="inline-flex items-center gap-3.5 mb-6 group">
                        <app-logo size="lg" />
                        <div class="text-left">
                            <h2 class="font-bold text-slate-900 text-xl leading-tight">MediCare</h2>
                            <p class="text-xs text-slate-500 leading-tight font-medium">Admin Panel</p>
                        </div>
                    </a>
                    <h1 appScrollAnimate animateDirection="up" animateDelay="0ms" class="text-2xl font-bold text-slate-900">Welcome back</h1>
                    <p appScrollAnimate animateDirection="up" animateDelay="100ms" class="text-slate-500 mt-1">Sign in to manage your clinic</p>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div class="space-y-4">
                        <div appScrollAnimate animateDirection="up" animateDelay="0ms">
                            <label for="username" class="block text-sm font-medium text-slate-900 mb-1.5">
                                Username
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <ng-icon name="fluentPerson" size="18" />
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    [value]="username()"
                                    (input)="username.set($any($event.target).value)"
                                    (keydown.enter)="handleLogin()"
                                    placeholder="Enter your username"
                                    class="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div appScrollAnimate animateDirection="up" animateDelay="100ms">
                            <label for="password" class="block text-sm font-medium text-slate-900 mb-1.5">
                                Password
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <ng-icon name="fluentLockClosed" size="18" />
                                </span>
                                <input
                                    id="password"
                                    [type]="showPassword() ? 'text' : 'password'"
                                    [value]="password()"
                                    (input)="password.set($any($event.target).value)"
                                    (keydown.enter)="handleLogin()"
                                    placeholder="Enter your password"
                                    class="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    (click)="showPassword.set(!showPassword())"
                                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <ng-icon [name]="showPassword() ? 'fluentEyeOff' : 'fluentEye'" size="18" />
                                </button>
                            </div>
                        </div>


                        <div appScrollAnimate animateDirection="up" animateDelay="200ms">
                            <app-button (click)="handleLogin()" [loading]="loading()" class="w-full justify-center">
                                Sign in
                            </app-button>
                        </div>
                    </div>
                </div>

                <p class="text-center text-xs text-slate-400 mt-6">
                    &copy; {{ currentYear }} MediCare Clinic. All rights reserved.
                </p>
            </div>
        </div>
    `,
})
export class LoginPage {
    private auth = inject(AuthService);
    private router = inject(Router);

    username = signal('');
    password = signal('');
    showPassword = signal(false);
    loading = signal(false);
    currentYear = new Date().getFullYear();

    handleLogin(): void {
        if (!this.username() || !this.password()) {
            return;
        }

        this.loading.set(true);

        this.auth.login(this.username(), this.password()).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/admin/dashboard']);
            },
            error: () => {
                this.loading.set(false);
            },
        });
    }
}
