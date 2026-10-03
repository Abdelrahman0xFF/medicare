import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'app-logo',
    standalone: true,
    template: `
        <div [class]="containerClasses()">
            <svg
                [attr.width]="dimension()"
                [attr.height]="dimension()"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0 transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="medicare-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#3b82f6" />
                        <stop offset="100%" stop-color="#1d4ed8" />
                    </linearGradient>
                    <filter id="medicare-logo-shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
                        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#1e3a8a" flood-opacity="0.25" />
                    </filter>
                </defs>
                <rect width="64" height="64" rx="16" fill="url(#medicare-logo-grad)" />
                <g filter="url(#medicare-logo-shadow)">
                    <!-- Medical Cross -->
                    <path
                        fill="#ffffff"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M26 12C26 10.3431 27.3431 9 29 9H35C36.6569 9 38 10.3431 38 12V24H50C51.6569 24 53 25.3431 53 27V33C53 34.6569 51.6569 36 50 36H38V48C38 49.6569 36.6569 51 35 51H29C27.3431 51 26 49.6569 26 48V36H14C12.3431 36 11 34.6569 11 33V27C11 25.3431 12.3431 24 14 24H26V12Z"
                    />
                    <!-- Heartbeat ECG line -->
                    <path
                        d="M12 30H22L25.5 35.5L30 18L35 40.5L38.5 28.5L41.5 30H52"
                        stroke="#2563eb"
                        stroke-width="3.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </g>
            </svg>

            @if (showText()) {
                <div class="flex flex-col text-left">
                    <span [class]="titleClasses()">{{ title() }}</span>
                    @if (subtitle()) {
                        <span [class]="subtitleClasses()">{{ subtitle() }}</span>
                    }
                </div>
            }
        </div>
    `,
})
export class AppLogo {
    size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
    showText = input<boolean>(false);
    title = input<string>('MediCare');
    subtitle = input<string>('');
    textColor = input<'dark' | 'white'>('dark');
    class = input<string>('');

    dimension = computed(() => {
        switch (this.size()) {
            case 'xs':
                return 24;
            case 'sm':
                return 32;
            case 'md':
                return 40;
            case 'lg':
                return 48;
            case 'xl':
                return 56;
            default:
                return 40;
        }
    });

    containerClasses = computed(() => {
        return `inline-flex items-center gap-2.5 select-none ${this.class()}`.trim();
    });

    titleClasses = computed(() => {
        const base = 'font-bold leading-tight tracking-tight';
        const color = this.textColor() === 'white' ? 'text-white' : 'text-slate-900';
        const textSize =
            this.size() === 'lg' || this.size() === 'xl'
                ? 'text-xl'
                : this.size() === 'sm' || this.size() === 'xs'
                  ? 'text-base'
                  : 'text-lg';
        return `${base} ${color} ${textSize}`;
    });

    subtitleClasses = computed(() => {
        const color = this.textColor() === 'white' ? 'text-blue-200' : 'text-slate-500';
        return `text-[11px] leading-tight font-medium ${color}`;
    });
}
