import { Expense } from "@/types/expense";
import { formatAmount } from "@/utils/expenses";

type SpendingChartProps = {
    expenses: Expense[];
    days?: number;
};

type DayTotal = {
    key: string;
    date: Date;
    total: number;
};

function getDayKey(value: Date) {
    return [value.getFullYear(), value.getMonth(), value.getDate()].join("-");
}

function getDailyTotals(expenses: Expense[], days: number): DayTotal[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totals = new Map<string, DayTotal>();

    for (let offset = days - 1; offset >= 0; offset--) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        totals.set(getDayKey(date), { key: getDayKey(date), date, total: 0 });
    }

    for (const expense of expenses) {
        const day = totals.get(getDayKey(new Date(expense.date)));

        if (day) {
            day.total += expense.amount;
        }
    }

    return Array.from(totals.values());
}

function formatDay(date: Date) {
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

export default function SpendingChart({
                                          expenses,
                                          days = 14,
                                      }: SpendingChartProps) {
    const dailyTotals = getDailyTotals(expenses, days);
    const max = Math.max(...dailyTotals.map((day) => day.total), 0);
    const periodTotal = dailyTotals.reduce((sum, day) => sum + day.total, 0);
    const lastIndex = dailyTotals.length - 1;

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-text-primary">
                        Daily spending
                    </h2>
                    <p className="mt-0.5 text-[13px] text-text-secondary">
                        Last {days} days
                    </p>
                </div>

                <p className="tabular text-sm font-semibold text-text-primary">
                    {formatAmount(periodTotal)}
                </p>
            </div>

            {max === 0 ? (
                <div className="mt-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-border-strong text-sm text-text-secondary">
                    No spending in the last {days} days
                </div>
            ) : (
                <>
                    <div
                        aria-hidden="true"
                        className="mt-5 flex h-44 items-end gap-1 border-b border-border sm:gap-1.5"
                    >
                        {dailyTotals.map((day, index) => {
                            const height =
                                day.total > 0
                                    ? Math.max((day.total / max) * 100, 3)
                                    : 0;

                            const alignTooltip =
                                index < 3
                                    ? "left-0"
                                    : index > lastIndex - 3
                                        ? "right-0"
                                        : "left-1/2 -translate-x-1/2";

                            return (
                                <div
                                    key={day.key}
                                    className="group relative flex h-full flex-1 items-end"
                                >
                                    {day.total > 0 ? (
                                        <div
                                            className="w-full rounded-t-[4px] bg-dark transition-colors group-hover:bg-dark-surface"
                                            style={{ height: `${height}%` }}
                                        />
                                    ) : (
                                        <div className="h-[2px] w-full rounded-full bg-surface-muted" />
                                    )}

                                    <div
                                        className={`pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-dark px-2.5 py-1.5 text-xs text-text-on-dark shadow-float group-hover:block ${alignTooltip}`}
                                    >
                                        <span className="text-text-muted">
                                            {formatDay(day.date)}
                                        </span>{" "}
                                        <span className="tabular font-semibold">
                                            {formatAmount(day.total)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        aria-hidden="true"
                        className="mt-2 flex justify-between text-[11px] text-text-secondary"
                    >
                        <span>
                            {dailyTotals[0].date.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                            })}
                        </span>
                        <span>Today</span>
                    </div>

                    <ul className="sr-only">
                        {dailyTotals.map((day) => (
                            <li key={day.key}>
                                {formatDay(day.date)}: {formatAmount(day.total)}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
