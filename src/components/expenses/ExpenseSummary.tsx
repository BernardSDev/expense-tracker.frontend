"use client";

import {Expense} from "@/types/expense";
import {formatAmount, formatDate} from "@/utils/expenses";

import {getCategoryStyles} from "./categoryStyles";

type ExpenseSummaryProps = {
    expenses: Expense[];
    isLoading: boolean;
};

type CategoryTotal = {
    name: string;
    categoryName: string | null;
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
                <div className="animate-pulse rounded-2xl bg-dark p-5 sm:p-6">
                    <div className="h-4 w-28 rounded bg-dark-surface" />
                    <div className="mt-4 h-9 w-44 rounded bg-dark-surface" />
                    <div className="mt-5 h-2 w-full rounded-full bg-dark-surface" />
                </div>

                {[0, 1].map((item) => (
                    <div
                        key={item}
                        className="hidden animate-pulse rounded-2xl border border-border bg-surface p-6 sm:block"
                    >
                        <div className="h-4 w-28 rounded bg-surface-muted" />
                        <div className="mt-4 h-9 w-32 rounded bg-surface-muted" />
                        <div className="mt-3 h-4 w-24 rounded bg-surface-muted" />
                    </div>
                ))}
            </section>
        );
    }

    return (
        <section className="mb-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {/* Total spending */}
            <div className="flex flex-col gap-5 rounded-2xl bg-dark p-5 text-text-on-dark sm:p-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm text-text-muted">
                            Total spending
                        </p>

                        <p className="tabular mt-2 text-3xl font-semibold tracking-[-0.04em]">
                            {formatAmount(totalExpenses)}
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-text-primary">
                        {expenses.length}{" "}
                        {expenses.length === 1 ? "expense" : "expenses"}
                    </span>
                </div>

                {totalExpenses > 0 && (
                    <div className="space-y-3">
                        <div
                            className="flex h-2 gap-[3px] overflow-hidden rounded-full"
                            aria-hidden="true"
                        >
                            {categoryTotals.map((category) => (
                                <div
                                    key={category.name}
                                    className={`rounded-full ${getCategoryStyles(category.categoryName).barOnDark}`}
                                    style={{
                                        width: `${(category.total / totalExpenses) * 100}%`,
                                    }}
                                />
                            ))}
                        </div>

                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-text-muted">
                            {categoryTotals.map((category) => (
                                <li
                                    key={category.name}
                                    className="flex items-center gap-1.5"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-2 w-2 rounded-[3px] ${getCategoryStyles(category.categoryName).barOnDark}`}
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
            <div className="hidden flex-col gap-2 rounded-2xl border border-border bg-surface p-6 sm:flex">
                <p className="text-sm text-text-secondary">
                    Largest expense
                </p>

                <p className="tabular text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                    {formatAmount(largestExpense?.amount ?? 0)}
                </p>

                <p className="truncate text-sm text-text-secondary">
                    {largestExpense
                        ? `${largestExpense.description} · ${formatDate(largestExpense.date)}`
                        : "No expenses yet"}
                </p>
            </div>

            {/* Expense count */}
            <div className="hidden flex-col gap-2 rounded-2xl border border-border bg-surface p-6 sm:flex">
                <p className="text-sm text-text-secondary">
                    Expenses recorded
                </p>

                <p className="tabular text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                    {expenses.length}
                </p>

                <p className="text-sm text-text-secondary">
                    Your spending activity
                </p>
            </div>
        </section>
    );
}

export default ExpenseSummary;
