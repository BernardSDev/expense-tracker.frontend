import { Expense } from "@/types/expense";
import {formatAmount, formatDate, formatTime, getExpenseInitial} from "@/utils/expenses";

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
                         onDelete}: ExpenseListProps) {
    if (isLoading) {
        return (
            <section>
                <p>Loading expenses...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="border border-red-200 bg-red-50 px-6 py-12 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                    !
                </div>

                <h2 className="mt-4 text-base font-semibold text-text-primary">
                    We could&#39;t load your expenses
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                    Something went wrong while loading your expenses.
                    Please try again.
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 bg-accent px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-hover"
                >
                    Try again
                </button>
            </section>
        );
    }

    if (expenses.length === 0) {
        return (
            <section>
                <p>No expenses yet.</p>
            </section>
        );
    }

    return (
        <section className="border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div>
                    <h2 className="text-base font-semibold text-text-primary">
                        Recent expenses
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        Your latest spending activity
                    </p>
                </div>

                <p className="text-sm text-text-muted">
                    {expenses.length}{" "}
                    {expenses.length === 1
                        ? "expense"
                        : "expenses"}
                </p>
            </div>

            <div className="divide-y divide-border">
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-surface-muted/40"
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted font-semibold text-text-primary">
                                {getExpenseInitial(
                                    expense.description
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-medium text-text-primary">
                                    {expense.description}
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-secondary">
                                <span>
                                    {formatDate(expense.date)}
                                </span>

                                    <span aria-hidden="true">·</span>

                                    <span>
                                    {formatTime(expense.date)}
                                </span>

                                    {expense.categoryName && (
                                        <>
                                        <span aria-hidden="true">
                                            ·
                                        </span>

                                            <span className="font-medium text-text-primary">
                                            {expense.categoryName}
                                        </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                            <p className="font-semibold text-text-primary">
                                {formatAmount(expense.amount)}
                            </p>

                            <button
                                type="button"
                                onClick={() => onEdit(expense)}
                                className="text-sm font-medium text-text-secondary opacity-0 transition-opacity hover:text-text-primary group-hover:opacity-100 focus:opacity-100"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(expense)}
                                className="text-sm font-medium text-text-secondary opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ExpenseList;