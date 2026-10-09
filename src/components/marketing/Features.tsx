import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
    return (
        <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-text-primary"
        >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {children}
            </svg>
        </span>
    );
}

function FeatureCard({
                         icon,
                         title,
                         description,
                         visual,
                         className = "",
                     }: {
    icon: ReactNode;
    title: string;
    description: string;
    visual?: ReactNode;
    className?: string;
}) {
    return (
        <article className={`flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-7 ${className}`}>
            <Icon>{icon}</Icon>

            <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-text-primary">
                {title}
            </h3>

            <p className="mt-1.5 text-[15px] leading-7 text-text-secondary">
                {description}
            </p>

            {visual && <div className="mt-6 flex-1">{visual}</div>}
        </article>
    );
}

function AddExpenseVisual() {
    return (
        <div
            aria-hidden="true"
            className="rounded-xl border border-border bg-background p-4"
        >
            <p className="text-[11px] font-medium text-text-secondary">Amount</p>
            <div className="mt-1 flex h-12 items-center rounded-[10px] border border-dark bg-surface px-3 ring-4 ring-accent/40">
                <span className="text-base font-medium text-text-secondary">GH₵</span>
                <span className="tabular ml-2 text-xl font-semibold text-text-primary">45.00</span>
                <span className="ml-0.5 h-5 w-px animate-pulse bg-text-primary" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-[10px] border border-border bg-surface px-3 py-2.5 text-[13px] text-text-primary">
                    Lunch
                </div>
                <div className="flex h-10 items-center gap-2 rounded-[10px] border border-border bg-surface px-3 text-[13px] text-text-primary">
                    <span className="h-2 w-2 rounded-[3px] bg-category-1" />
                    Groceries
                </div>
            </div>
            <div className="mt-3 flex h-10 items-center justify-center gap-2 rounded-[10px] bg-dark text-[13px] font-semibold text-text-on-dark">
                <span className="text-accent">+</span> Add expense
            </div>
        </div>
    );
}

function MonthVisual() {
    return (
        <div
            aria-hidden="true"
            className="grid grid-cols-2 gap-2"
        >
            <div className="col-span-2 rounded-xl bg-dark p-3.5 text-text-on-dark">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Spent this month
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                    <p className="tabular text-xl font-semibold tracking-[-0.02em]">
                        GH₵ 2,165.50
                    </p>
                    <span className="rounded-full bg-positive-soft px-1.5 py-0.5 text-[11px] font-semibold text-positive">
                        ↓ 12%
                    </span>
                </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                    Daily average
                </p>
                <p className="tabular mt-1 text-[15px] font-semibold text-text-primary">
                    GH₵ 240.61
                </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                    Top category
                </p>
                <p className="mt-1 text-[15px] font-semibold text-text-primary">
                    Groceries
                </p>
            </div>
        </div>
    );
}

function CategoriesVisual() {
    const items = [
        { name: "Groceries", tile: "bg-category-1-soft text-category-1-strong" },
        { name: "Transport", tile: "bg-category-3-soft text-category-3-strong" },
        { name: "Utilities", tile: "bg-category-4-soft text-category-4-strong" },
        { name: "Health", tile: "bg-category-6-soft text-category-6-strong" },
        { name: "Dining out", tile: "bg-category-2-soft text-category-2-strong" },
        { name: "Internet", tile: "bg-category-8-soft text-category-8-strong" },
    ];

    return (
        <div aria-hidden="true" className="flex flex-wrap gap-2">
            {items.map((item) => (
                <span
                    key={item.name}
                    className={`inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium ${item.tile}`}
                >
                    {item.name}
                </span>
            ))}
        </div>
    );
}

export default function Features() {
    return (
        <section
            id="features"
            className="scroll-mt-20 bg-background"
        >
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                <div className="max-w-2xl">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                        Features
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[44px] sm:leading-[1.1]">
                        Everything you need to stay on top of your spending.
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-text-secondary">
                        No spreadsheets, no bank logins. Just a clear, calm
                        place to record what you spend and see the bigger picture.
                    </p>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        className="lg:row-span-2"
                        title="Log an expense in seconds"
                        description="Amount, a short note, a category if you like. The date fills itself in, and it shows up in your list straight away."
                        icon={<><path d="M12 5v14M5 12h14" /></>}
                        visual={<AddExpenseVisual />}
                    />

                    <FeatureCard
                        title="Your month at a glance"
                        description="See what you've spent this month, how it compares with last month and your daily average, all on one screen."
                        icon={<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 15v-3M12 15V9M16 15v-5" /></>}
                        visual={<MonthVisual />}
                    />

                    <FeatureCard
                        title="Categories that make sense"
                        description="Create your own categories. Each one gets its own colour, so you can spot it anywhere in the app."
                        icon={<><path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.2 7.2a1 1 0 0 1 0 1.4l-8.1 8.1a1 1 0 0 1-1.4 0l-7.2-7.2a1 1 0 0 1-.3-.7z" /><circle cx="8" cy="8" r="1.4" /></>}
                        visual={<CategoriesVisual />}
                    />

                    <FeatureCard
                        title="Find anything, fast"
                        description="Search by name or category, or filter down to one category with a tap. Expenses are grouped by day so they're easy to scan."
                        icon={<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>}
                    />

                    <FeatureCard
                        title="Made for your phone"
                        description="Swipe a row to edit or delete it, add expenses from a button always within reach, and use it right in your mobile browser."
                        icon={<><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 17.5h2" /></>}
                    />
                </div>
            </div>
        </section>
    );
}
