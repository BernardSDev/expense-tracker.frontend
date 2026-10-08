"use client";

import {Expense} from "@/types/expense";
import {formatAmount, formatDate} from "@/utils/expenses";

import {getCategoryStyles} from "./categoryStyles";
import StatLabel from "@/components/ui/StatLabel";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

type ExpenseSummaryProps = {
    expenses: Expense[];
    isLoading: boolean;
};

type CategoryTotal = {
    name: string;
    categoryName: string | null;
    categoryId: number | null;
    total: number;
};

function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
    const totals = new Map<string, CategoryTotal>();

    for (const expense of expenses) {
        const name = expense.categoryName ?? "Uncategorized";
        const existing = totals.get(name);

        if (existing) {
            existing.total += expense.amount;
            continue;
        }

        totals.set(name, {
            name,
            categoryName: expense.categoryName,
            categoryId: expense.categoryId,
            total: expense.amount,
        });
    }

    return Array.from(totals.values()).sort((a, b) => b.total - a.total);
}

function ExpenseSummary({
                            expenses,
                            isLoading,
                        }: ExpenseSummaryProps) {
    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount, 0
    );

    const categoryTotals = getCategoryTotals(expenses);

    const largestExpense = expenses.reduce<Expense | null>(
        (largest, expense) =>
            !largest || expense.amount > largest.amount ? expense : largest,
        null
    );

    if (isLoading) {
        return (
            <section className="mb-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="shimmer rounded-2xl bg-dark p-5 sm:p-6">
                    <div className="h-4 w-28 rounded bg-dark-surface" />
                    <div className="mt-4 h-9 w-44 rounded bg-dark-surface" />
                    <div className="mt-5 h-2 w-full rounded-full bg-dark-surface" />
                </div>

                {[0, 1].map((item) => (
                    <div
                        key={item}
                        className="hidden shimmer rounded-2xl border border-border bg-surface shadow-card p-6 sm:block"
                    >
                        <div className="h-4 w-28 rounded bg-surface-muted" />
                        <div className="mt-4 h-9 w-32 rounded bg-surface-muted" />
                        <div className="mt-3 h-4 w-24 rounded bg-surface-muted" />
                    </div>
                ))}
            </section>
        );
    }

    const categoryBar = (variant: "dark" | "light") => (
        <div
            className="flex h-2 origin-left gap-[3px] overflow-hidden rounded-full motion-safe:animate-grow-x"
            aria-hidden="true"
        >
            {[...categoryTotals]
                .sort(
                    (a, b) =>
                        (a.categoryId ?? Number.MAX_SAFE_INTEGER) -
                        (b.categoryId ?? Number.MAX_SAFE_INTEGER)
                )
                .map((category) => {
                const styles = getCategoryStyles(category.categoryName, category.categoryId);

                return (
                    <div
                        key={category.name}
                        className={`rounded-full ${variant === "dark" ? styles.barOnDark : styles.bar}`}
                        style={{
                            width: `${(category.total / totalExpenses) * 100}%`,
                        }}
                    />
                );
            })}
        </div>
    );

    return (
        <section className="stagger mb-[18px] grid gap-4 sm:mb-6 sm:grid-cols-3">
            {/* Total spending */}
            <div className="flex flex-col gap-4 rounded-2xl bg-dark p-5 text-text-on-dark sm:gap-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
                        <StatLabel icon="wallet" tone="dark">
                            <span className="sm:hidden">Spent this month</span>
                            <span className="hidden sm:inline">Total spent</span>
                        </StatLabel>

                        <p className="tabular text-[32px] font-semibold leading-tight tracking-[-0.03em] sm:text-[28px]">
                            <AnimatedNumber value={totalExpenses} format={formatAmount} />
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-[5px] text-xs font-semibold text-text-primary sm:hidden">
                        {expenses.length}{" "}
                        {expenses.length === 1 ? "expense" : "expenses"}
                    </span>
                </div>

                <p className="hidden text-[13px] text-text-muted sm:block">
                    Across {expenses.length}{" "}
                    {expenses.length === 1 ? "expense" : "expenses"}
                </p>

                {totalExpenses > 0 && (
                    <div className="flex flex-col gap-2.5 sm:hidden">
                        {categoryBar("dark")}

                        <ul className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-[13px] text-text-muted">
                            {categoryTotals.map((category) => (
                                <li
                                    key={category.name}
                                    className="flex items-center gap-1.5"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-2 w-2 rounded-[3px] ${getCategoryStyles(category.categoryName, category.categoryId).barOnDark}`}
                                    />
                                    {category.name}
                                    <span className="tabular text-text-on-dark">
                                        {formatAmount(category.total)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Largest expense */}
            <div className="hidden flex-col gap-2 rounded-2xl border border-border bg-surface shadow-card p-5 sm:flex">
                <StatLabel icon="trophy">
                    Largest expense
                </StatLabel>

                <p className="tabular text-[28px] font-semibold leading-tight tracking-[-0.03em] text-text-primary">
                    <AnimatedNumber value={largestExpense?.amount ?? 0} format={formatAmount} />
                </p>

                <p className="truncate text-[13px] text-text-secondary">
                    {largestExpense
                        ? `${largestExpense.description} · ${formatDate(largestExpense.date)}`
                        : "No expenses yet"}
                </p>
            </div>

            {/* By category */}
            <div className="hidden flex-col gap-3 rounded-2xl border border-border bg-surface shadow-card p-5 sm:flex">
                <StatLabel icon="pie">
                    By category
                </StatLabel>

                {totalExpenses > 0 ? (
                    <>
                        {categoryBar("light")}

                        <ul className="flex flex-col gap-1.5 text-[13px] text-text-primary">
                            {categoryTotals.map((category) => (
                                <li
                                    key={category.name}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-2 w-2 rounded-[3px] ${getCategoryStyles(category.categoryName, category.categoryId).bar}`}
                                    />
                                    {category.name}
                                    <span className="tabular ml-auto">
                                        {formatAmount(category.total)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-[13px] text-text-secondary">
                        No spending yet
                    </p>
                )}
            </div>
        </section>
    );
}

export default ExpenseSummary;
