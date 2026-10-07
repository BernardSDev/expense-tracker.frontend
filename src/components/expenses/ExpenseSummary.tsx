"use client";

import {Expense} from "@/types/expense";
import {formatAmount} from "@/utils/expenses";

type ExpenseSummaryProps = {
    expenses: Expense[];
    isLoading: boolean;
};

function ExpenseSummary({
                            expenses,
                            isLoading,
                        }: ExpenseSummaryProps) {
    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount, 0
    );

    return (
        <section className="mb-12 grid overflow-hidden border border-border bg-border sm:grid-cols-2">
            {/* Total spending */}
            <div className="bg-surface px-5 py-5 sm:px-7 sm:py-7">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-4 w-28 bg-surface-muted" />

                        <div className="mt-4 h-10 w-48 bg-surface-muted" />

                        <div className="mt-3 h-4 w-40 bg-surface-muted" />
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-medium text-text-secondary">
                            Total spending
                        </p>

                        <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
                            {formatAmount(
                                totalExpenses
                            )}
                        </p>

                        <p className="mt-2 text-sm text-text-muted">
                            Across{" "}
                            {expenses.length}{" "}
                            recorded{" "}
                            {expenses.length ===
                            1
                                ? "expense"
                                : "expenses"}
                        </p>
                    </>
                )}
            </div>

            {/* Expense count */}
            <div className="bg-surface px-5 py-5 sm:border-l sm:border-border sm:px-7 sm:py-7">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-4 w-32 bg-surface-muted" />

                        <div className="mt-4 h-10 w-16 bg-surface-muted" />

                        <div className="mt-3 h-4 w-40 bg-surface-muted" />
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-medium text-text-secondary">
                            Expenses recorded
                        </p>

                        <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
                            {expenses.length}
                        </p>

                        <p className="mt-2 text-sm text-text-muted">
                            Your spending activity
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}

export default ExpenseSummary;