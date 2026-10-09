/**
 * A static, illustrative preview of the app built from the same visual
 * language as the real dashboard. The figures are sample data.
 */

const bars = [18, 30, 12, 44, 26, 0, 38, 22, 56, 16, 34, 48, 28, 64];

const categories = [
    { name: "Groceries", amount: "GH₵ 820.00", share: 38, bar: "bg-category-1", dot: "bg-category-1" },
    { name: "Transport", amount: "GH₵ 540.00", share: 25, bar: "bg-category-3", dot: "bg-category-3" },
    { name: "Utilities", amount: "GH₵ 460.00", share: 21, bar: "bg-category-4", dot: "bg-category-4" },
    { name: "Dining out", amount: "GH₵ 345.50", share: 16, bar: "bg-category-2", dot: "bg-category-2" },
];

const rows = [
    { initial: "L", title: "Lunch", meta: "Groceries · 12:40 pm", amount: "−GH₵ 45.00", tile: "bg-category-1-soft text-category-1-strong" },
    { initial: "U", title: "Uber to work", meta: "Transport · 8:05 am", amount: "−GH₵ 38.00", tile: "bg-category-3-soft text-category-3-strong" },
    { initial: "E", title: "Electricity top-up", meta: "Utilities · Yesterday", amount: "−GH₵ 150.00", tile: "bg-category-4-soft text-category-4-strong" },
];

export default function ProductPreview() {
    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_70%_30%,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_70%)]"
            />

            {/* App window */}
            <div
                role="img"
                aria-label="Preview of the Sika dashboard with sample data: GH₵ 2,165.50 spent this month, a daily spending chart and a breakdown by category."
                className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_30px_80px_-20px_rgba(29,35,24,0.35)]"
            >
                <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                    <span className="ml-3 h-6 flex-1 rounded-md bg-surface-muted" />
                </div>

                <div className="grid gap-3 p-3 sm:grid-cols-[1.15fr_1fr] sm:p-4">
                    {/* Dark total card */}
                    <div className="rounded-xl bg-dark p-4 text-text-on-dark">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                            Spent this month
                        </p>
                        <p className="tabular mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.03em]">
                            GH₵ 2,165.50
                        </p>
                        <p className="mt-1 text-[11px] text-text-muted">
                            <span className="mr-1 rounded-full bg-positive-soft px-1.5 py-0.5 font-semibold text-positive">
                                ↓ 12%
                            </span>
                            vs last month
                        </p>

                        <div className="mt-4 flex h-1.5 gap-[2px] overflow-hidden rounded-full">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className={category.bar}
                                    style={{ width: `${category.share}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Chart card */}
                    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
                        <div className="flex items-baseline justify-between">
                            <p className="text-[12px] font-semibold text-text-primary">
                                Daily spending
                            </p>
                            <p className="text-[10px] text-text-secondary">
                                Last 14 days
                            </p>
                        </div>

                        <div className="mt-3 flex h-[72px] items-end gap-[3px] border-b border-border">
                            {bars.map((height, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 origin-bottom rounded-t-[2px] motion-safe:animate-grow-up ${
                                        height === 0 ? "h-[2px] bg-surface-muted" : "bg-dark"
                                    }`}
                                    style={{
                                        height: height === 0 ? undefined : `${height + 30}%`,
                                        animationDelay: `${300 + index * 35}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent expenses */}
                    <div className="rounded-xl border border-border bg-surface shadow-card sm:col-span-2">
                        <div className="flex items-center justify-between px-4 pb-2 pt-3">
                            <p className="text-[12px] font-semibold text-text-primary">
                                Recent expenses
                            </p>
                            <p className="text-[10px] text-text-secondary">
                                View all
                            </p>
                        </div>

                        <ul className="divide-y divide-surface-muted">
                            {rows.map((row) => (
                                <li
                                    key={row.title}
                                    className="flex items-center gap-3 px-4 py-2.5"
                                >
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold ${row.tile}`}
                                    >
                                        {row.initial}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[12px] font-semibold text-text-primary">
                                            {row.title}
                                        </span>
                                        <span className="block truncate text-[10px] text-text-secondary">
                                            {row.meta}
                                        </span>
                                    </span>
                                    <span className="tabular text-[12px] font-semibold text-text-primary">
                                        {row.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Floating category card */}
            <div
                aria-hidden="true"
                className="absolute -bottom-8 -left-6 hidden w-60 rounded-2xl border border-border bg-surface p-4 shadow-float motion-safe:animate-rise-in [animation-delay:600ms] [animation-fill-mode:both] lg:block"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                    By category
                </p>
                <ul className="mt-3 space-y-2">
                    {categories.map((category) => (
                        <li
                            key={category.name}
                            className="flex items-center gap-2 text-[12px]"
                        >
                            <span className={`h-2 w-2 rounded-[3px] ${category.dot}`} />
                            <span className="text-text-primary">{category.name}</span>
                            <span className="tabular ml-auto text-text-secondary">
                                {category.share}%
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Floating "added" toast */}
            <div
                aria-hidden="true"
                className="absolute -right-4 -top-5 hidden items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-float motion-safe:animate-pop-in [animation-delay:900ms] [animation-fill-mode:both] sm:flex"
            >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-positive-soft text-positive">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 10.5l3.2 3L15 7" />
                    </svg>
                </span>
                <span className="text-[12px] font-medium text-text-primary">
                    Lunch added
                </span>
                <span className="tabular text-[12px] font-semibold text-text-secondary">
                    GH₵ 45.00
                </span>
            </div>
        </div>
    );
}
