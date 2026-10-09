/**
 * Illustrative preview of the Sika dashboard inside an app frame.
 * Figures are sample data; the whole thing is one image for screen readers.
 */

const stats = [
    { label: "Expenses", value: "41", sub: "3 today" },
    { label: "Daily average", value: "GH₵240.61", sub: "This month" },
    { label: "Top category", value: "Groceries", sub: "38% of spending" },
];

const bars = [22, 38, 16, 54, 30, 4, 46, 28, 70, 20, 42, 60, 34, 82];

const categories = [
    { name: "Groceries", amount: "GH₵820.00", share: 38, color: "bg-category-1", dark: "bg-category-1-on-dark" },
    { name: "Transport", amount: "GH₵540.00", share: 25, color: "bg-category-3", dark: "bg-category-3-on-dark" },
    { name: "Utilities", amount: "GH₵460.00", share: 21, color: "bg-category-4", dark: "bg-category-4-on-dark" },
    { name: "Dining out", amount: "GH₵345.50", share: 16, color: "bg-category-2", dark: "bg-category-2-on-dark" },
];

export default function ProductFrame() {
    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-10 -z-10 h-[420px] w-[min(900px,90%)] -translate-x-1/2 rounded-full bg-accent/40 blur-[90px]"
            />

            <div
                role="img"
                aria-label="Preview of the Sika dashboard with sample data: GH₵2,165.50 spent this month, a daily spending chart and spending by category."
                className="rounded-[20px] border border-border bg-surface p-2 shadow-[0_40px_90px_-30px_rgba(29,35,24,0.35)] sm:p-2.5"
            >
                <div className="flex overflow-hidden rounded-xl border border-border bg-background">
                    {/* Sidebar */}
                    <div className="hidden w-[200px] shrink-0 flex-col gap-1 border-r border-border bg-surface px-3 py-[18px] md:flex">
                        <div className="flex items-center gap-2 px-2 pb-4">
                            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-dark text-xs font-bold text-accent">
                                ₵
                            </span>
                            <span className="text-sm font-semibold">Sika</span>
                        </div>
                        <div className="flex h-[34px] items-center rounded-lg bg-surface-muted px-2.5 text-[13px] font-semibold">
                            Overview
                        </div>
                        <div className="flex h-[34px] items-center px-2.5 text-[13px] text-text-secondary">
                            Expenses
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-4 sm:px-7 sm:py-6">
                        <div>
                            <p className="text-xs text-text-secondary">Friday 9 October</p>
                            <p className="mt-0.5 text-lg font-semibold tracking-[-0.02em] sm:text-[22px]">
                                Good morning, Akua.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <div className="col-span-2 rounded-xl bg-dark p-3.5 text-text-on-dark lg:col-span-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                                    Spent this month
                                </p>
                                <p className="tabular mt-1.5 text-[22px] font-semibold">
                                    GH₵2,165.50
                                </p>
                                <div className="mt-3 flex h-1.5 gap-[2px] overflow-hidden rounded-full">
                                    {categories.map((category) => (
                                        <span
                                            key={category.name}
                                            className={category.dark}
                                            style={{ width: `${category.share}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-xl border border-border bg-surface p-3.5 ${
                                        index === 2 ? "col-span-2 lg:col-span-1" : ""
                                    }`}
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                                        {stat.label}
                                    </p>
                                    <p className="mt-1.5 truncate text-lg font-semibold tracking-[-0.02em] sm:text-[22px]">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs text-text-secondary">
                                        {stat.sub}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
                            <div className="flex flex-col rounded-xl border border-border bg-surface p-4">
                                <p className="text-[13px] font-semibold">Daily spending</p>
                                <div className="mt-3 flex h-36 items-end gap-1 border-b border-border sm:h-44 sm:gap-1.5">
                                    {bars.map((height, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 origin-bottom rounded-t-[3px] bg-dark motion-safe:animate-grow-up"
                                            style={{
                                                height: `${height}%`,
                                                animationDelay: `${400 + index * 35}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-surface p-4">
                                <p className="text-[13px] font-semibold">By category</p>
                                <ul className="mt-3 space-y-2.5">
                                    {categories.map((category) => (
                                        <li
                                            key={category.name}
                                            className="flex items-center gap-2 text-[13px]"
                                        >
                                            <span className={`h-2 w-2 rounded-[3px] ${category.color}`} />
                                            {category.name}
                                            <span className="tabular ml-auto text-text-secondary">
                                                {category.amount}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
