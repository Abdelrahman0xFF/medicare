export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
    if (typeof window !== "undefined") {
        window.scrollTo({
            top: 0,
            behavior,
        });
    }
}

export function scrollToElement(id: string): void {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    const navHeight = resolveCssLength(
        getComputedStyle(document.documentElement).getPropertyValue("--public-nav-height"),
    );
    const targetY = window.scrollY + element.getBoundingClientRect().top - navHeight;

    window.scrollTo({
        top: targetY,
        behavior: "smooth",
    });
}

function resolveCssLength(value: string): number {
    const trimmed = value.trim();
    if (!trimmed) {
        return 0;
    }

    if (trimmed.endsWith("px")) {
        return Number.parseFloat(trimmed);
    }

    if (trimmed.endsWith("rem") || trimmed.endsWith("em")) {
        const rootFontSize = Number.parseFloat(
            getComputedStyle(document.documentElement).fontSize || "16",
        );
        return Number.parseFloat(trimmed) * rootFontSize;
    }

    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : 0;
}
