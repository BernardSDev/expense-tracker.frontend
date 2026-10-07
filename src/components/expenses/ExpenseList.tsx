import { Expense } from "@/types/expense";
import {
    formatAmount,
    formatDate,
    formatTime,
    getExpenseInitial,
} from "@/utils/expenses";

import { getCategoryStyles } from "./categoryStyles";

type ExpenseListProps = {
    expenses: Expense[];
    isLoading: boolean;
    error: Error | null;
    onRetry: () => void;
    onAddExpense?: () => void;
    onEdit: (expense: Expense) => void;
    onDelete: (expense: Expense) => void;
};

function ExpenseList({
                         expenses,
                         isLoading,
                         error,
                         onRetry,
                         onAddExpense,
                         onEdit,
                         onDelete,
                     }: ExpenseListProps) {
    if (isLoading) {
        return (
            <section
                aria-busy="true"
                aria-label="Loading expenses"
                className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
                <div className="divide-y divide-border">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="flex animate-pulse items-center gap-3 px-4 py-4 sm:px-6"
                        >
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-muted" />

                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 rounded bg-surface-muted" />
                                <div className="h-3 w-24 rounded bg-surface-muted" />
                            </div>

                            <div className="h-4 w-20 rounded bg-surface-muted" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                    !
                </div>

                <h2 className="mt-4 text-base font-semibold text-text-primary">
                    We couldn&apos;t load your expenses
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                    Something went wrong while loading your expenses.
                    Please try again.
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 h-10 rounded-xl bg-dark px-5 text-sm font-semibold text-text-on-dark transition-colors hover:bg-dark-surface"
                >
                    Try again
                </button>
            </section>
        );
    }

    if (expenses.length === 0) {
        return (
            <section className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
                <h2 className="text-base font-semibold text-text-primary">
                    No expenses yet
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                    Add your first expense below and it will show up here.
                </p>

                {onAddExpense && (
                    <button
                        type="button"
                        onClick={onAddExpense}
                        className="mt-5 h-10 rounded-xl bg-dark px-5 text-sm font-semibold text-text-on-dark transition-colors hover:bg-dark-surface"
                    >
                        Add expense
                    </button>
                )}
            </section>
        );
    }

    return (
        <section>
            <div className="mb-3 flex items-baseline justify-between gap-4 px-1">
                <h2 className="text-base font-semibold text-text-primary">
                    Recent expenses
                </h2>

                <p className="shrink-0 text-sm text-text-secondary">
                    {expenses.length}{" "}
                    {expenses.length === 1
                        ? "expense"
                        : "expenses"}
                </p>
            </div>

            {/* Mobile: compact rows */}
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface md:hidden">
                {expenses.map((expense) => {
                    const styles = getCategoryStyles(
                        expense.categoryName
                    );

                    return (
                        <li
                            key={expense.id}
                            className="flex gap-3 px-4 py-3.5"
                        >
                            <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${styles.background} ${styles.color}`}
                            >
                                {getExpenseInitial(
                                    expense.description
                                )}
                            </span>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between gap-3">
                                    <p className="truncate text-[15px] font-semibold text-text-primary">
                                        {expense.description}
                                    </p>

                                    <p className="tabular shrink-0 text-[15px] font-semibold text-text-primary">
                                        {formatAmount(expense.amount)}
                                    </p>
                                </div>

                                <p className="mt-0.5 truncate text-[13px] text-text-secondary">
                                    {expense.categoryName
                                        ? `${expense.categoryName} · `
                                        : ""}
                                    {formatDate(expense.date)} · {formatTime(expense.date)}
                                </p>

                                <div className="-ml-2 mt-1.5 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(expense)}
                                        className="h-8 rounded-lg px-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete(expense)}
                                        className="h-8 rounded-lg px-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Desktop: table */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-[0.04em] text-text-secondary">
                                <th scope="col" className="px-6 py-3 font-medium">
                                    Expense
                                </th>
                                <th scope="col" className="px-4 py-3 font-medium">
                                    Category
                                </th>
                                <th scope="col" className="px-4 py-3 font-medium">
                                    Date
                                </th>
                                <th scope="col" className="px-4 py-3 text-right font-medium">
                                    Amount
                                </th>
                                <th scope="col" className="w-36 px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {expenses.map((expense) => {
                                const styles = getCategoryStyles(
                                    expense.categoryName
                                );

                                return (
                                    <tr
                                        key={expense.id}
                                        className="group border-t border-border transition-colors hover:bg-surface-muted/50"
                                    >
                                        <td className="px-6 py-3.5">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${styles.background} ${styles.color}`}
                                                >
                                                    {getExpenseInitial(
                                                        expense.description
                                                    )}
                                                </span>

                                                <span className="truncate font-medium text-text-primary">
                                                    {expense.description}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            {expense.categoryName ? (
                                                <span
                                                    className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-text-primary ${styles.background}`}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`h-1.5 w-1.5 rounded-full ${styles.bar}`}
                                                    />
                                                    {expense.categoryName}
                                                </span>
                                            ) : (
                                                <span className="text-text-secondary">
                                                    Uncategorized
                                                </span>
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3.5 text-text-primary">
                                            {formatDate(expense.date)}
                                            <span className="text-text-secondary">
                                                {" · "}
                                                {formatTime(expense.date)}
                                            </span>
                                        </td>

                                        <td className="tabular whitespace-nowrap px-4 py-3.5 text-right font-semibold text-text-primary">
                                            {formatAmount(expense.amount)}
                                        </td>

                                        <td className="px-6 py-3.5">
                                            <div className="flex justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(expense)}
                                                    className="h-8 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(expense)}
                                                    className="h-8 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default ExpenseList;
