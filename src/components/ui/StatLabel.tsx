import type { ReactNode } from "react";

export type StatIconName = "wallet" | "receipt" | "calendar" | "tag" | "trophy" | "pie";

const paths: Record<StatIconName, ReactNode> = {
    wallet: (
        <>
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
            <path d="M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5Z" />
            <path d="M16 13.5h.01" />
        </>
    ),
    receipt: (
        <>
            <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" />
            <path d="M9 8h6M9 11.5h6M9 15h3" />
        </>
    ),
    calendar: (
        <>
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16" />
        </>
    ),
    tag: (
        <>
            <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.2 7.2a1 1 0 0 1 0 1.4l-8.1 8.1a1 1 0 0 1-1.4 0l-7.2-7.2a1 1 0 0 1-.3-.7z" />
            <circle cx="8" cy="8" r="1.4" />
        </>
    ),
    trophy: (
        <>
            <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
            <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6" />
        </>
    ),
    pie: (
        <>
            <path d="M12 3.5v8.5h8.5" />
            <path d="M20.2 15.5A8.5 8.5 0 1 1 8.5 3.8" />
        </>
    ),
};

type StatLabelProps = {
    icon: StatIconName;
    tone?: "light" | "dark";
    children: ReactNode;
};

export default function StatLabel({
                                      icon,
                                      tone = "light",
                                      children,
                                  }: StatLabelProps) {
    return (
        <div className="flex items-center gap-2">
            <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    tone === "dark"
                        ? "bg-dark-surface text-accent"
                        : "bg-surface-muted text-text-primary"
                }`}
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {paths[icon]}
                </svg>
            </span>

            <p
                className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                    tone === "dark" ? "text-text-muted" : "text-text-secondary"
                }`}
            >
                {children}
            </p>
        </div>
    );
}
