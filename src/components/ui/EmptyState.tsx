import type { ReactNode } from "react";

type EmptyIcon = "receipt" | "chart" | "pie" | "search";

const icons: Record<EmptyIcon, ReactNode> = {
    receipt: (
        <>
            <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" />
            <path d="M9 8h6M9 11.5h6M9 15h3" />
        </>
    ),
    chart: (
        <>
            <path d="M4 20h16" />
            <path d="M7 16v-4M12 16V8M17 16v-6" />
        </>
    ),
    pie: (
        <>
            <path d="M12 3.5v8.5h8.5" />
            <path d="M20.2 15.5A8.5 8.5 0 1 1 8.5 3.8" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4-4" />
        </>
    ),
};

type EmptyStateProps = {
    icon: EmptyIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

export default function EmptyState({
                                       icon,
                                       title,
                                       description,
                                       action,
                                       className = "",
                                   }: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong px-6 py-8 text-center ${className}`}
        >
            <div
                aria-hidden="true"
                className="relative mb-4"
            >
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent ring-4 ring-surface" />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-text-primary">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {icons[icon]}
                    </svg>
                </span>
            </div>

            <p className="text-sm font-semibold text-text-primary">
                {title}
            </p>

            {description && (
                <p className="mt-1 max-w-xs text-sm leading-6 text-text-secondary">
                    {description}
                </p>
            )}

            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
