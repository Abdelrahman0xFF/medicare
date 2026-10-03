import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    fluentGrid,
    fluentCalendarCheckmark,
    fluentPeopleQueue,
    fluentNews,
    fluentSettings,
    fluentPerson,
    fluentArrowExit,
    fluentNavigation,
    fluentDismiss,
} from '@ng-icons/fluent-ui';
import { AuthService } from '../auth/auth.service';
import { AppLogo } from '../../shared/ui/logo';

@Component({
    viewProviders: [
        provideIcons({
            fluentGrid,
            fluentCalendarCheckmark,
            fluentPeopleQueue,
            fluentNews,
            fluentSettings,
            fluentPerson,
            fluentArrowExit,
            fluentNavigation,
            fluentDismiss,
        }),
    ],
    selector: 'app-layout-admin',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, NgIcon, AppLogo],
    template: `
        <div class="h-dvh bg-slate-50 flex overflow-hidden">
            <!-- Mobile Sidebar Overlay -->
            @if (sidebarOpen()) {
                <div class="fixed inset-0 z-40 lg:hidden">
                    <div 
                        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        (click)="sidebarOpen.set(false)"
                        (keydown.enter)="sidebarOpen.set(false)"
                        tabindex="0"
                    ></div>
                </div>
            }

            <!-- Sidebar -->
            <aside 
                [class]="
                    'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 ' +
                    (sidebarOpen() ? 'translate-x-0' : '-translate-x-full')
                "
            >
                <div class="p-6 border-b border-slate-200 flex items-center justify-between">
                    <a routerLink="/" class="flex items-center gap-3 group">
                        <app-logo size="md" />
                        <div>
                            <h2 class="font-bold text-slate-900 leading-tight">MediCare</h2>
                            <p class="text-[11px] text-slate-500 leading-tight font-medium">Admin Panel</p>
                        </div>
                    </a>
                    <button
                        (click)="sidebarOpen.set(false)"
                        class="lg:hidden flex items-center justify-center size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                    >
                        <ng-icon name="fluentDismiss" size="20" />
                    </button>
                </div>

                <nav class="flex-1 overflow-y-auto p-3 space-y-1">
                    @for (navLink of navLinks; track navLink.label) {
                        <a
                            [routerLink]="navLink.href"
                            (click)="sidebarOpen.set(false)"
                            routerLinkActive="bg-blue-50 text-blue-700 shadow-sm"
                            [routerLinkActiveOptions]="{ exact: false }"
                            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        >
                            <span
                                class="flex items-center justify-center size-8 rounded-lg transition-colors duration-150 text-slate-400 group-hover:text-slate-600"
                            >
                                <ng-icon [name]="navLink.icon" size="20" />
                            </span>
                            {{ navLink.label }}
                        </a>
                    }
                </nav>

                <div class="p-3 border-t border-slate-200">
                    <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 mb-2">
                        <div
                            class="size-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0"
                        >
                            <span class="text-blue-600 font-bold text-sm">{{ adminInitial }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-slate-900 text-sm truncate leading-tight">
                                {{ adminName }}
                            </p>
                            <p class="text-[11px] text-slate-500 truncate leading-tight">
                                Administrator
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        (click)="handleLogout()"
                        class="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 cursor-pointer"
                    >
                        <ng-icon name="fluentArrowExit" size="20" />
                        Logout
                    </button>
                </div>
            </aside>

            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                <!-- Mobile Top Bar -->
                <header class="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-2.5">
                        <app-logo size="sm" />
                        <span class="font-bold text-slate-900">Admin</span>
                    </div>
                    <button
                        (click)="sidebarOpen.set(true)"
                        class="flex items-center justify-center size-10 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                        <ng-icon name="fluentNavigation" size="20" />
                    </button>
                </header>

                <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <router-outlet />
                </main>
            </div>
        </div>
    `,
})
export class LayoutAdmin {
    private auth = inject(AuthService);
    private router = inject(Router);

    sidebarOpen = signal(false);

    navLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: 'fluentGrid' },
        { href: '/admin/appointments', label: 'Appointments', icon: 'fluentCalendarCheckmark' },
        { href: '/admin/queue', label: 'Queue', icon: 'fluentPeopleQueue' },
        { href: '/admin/admins', label: 'Admins', icon: 'fluentPerson' },
        { href: '/admin/blog', label: 'Blog', icon: 'fluentNews' },
        { href: '/admin/settings', label: 'Settings', icon: 'fluentSettings' },
    ];

    get adminName(): string {
        return this.auth.admin()?.username || 'Admin';
    }

    get adminInitial(): string {
        const name = this.adminName;
        return name.charAt(0).toUpperCase();
    }

    handleLogout(): void {
        this.auth.logout();
    }
}
