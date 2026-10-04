"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { apiRequest, SessionExpiredError } from "@/lib/api";
import AuthNavbar from "@/components/AuthNavbar";

type Expense = {
    id: number;
    amount: number;
    description: string;
    date: string;
    userId: string;
};

function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCurrentTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
    }).format(amount);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GH", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatTime(date: string) {
    return new Intl.DateTimeFormat("en-GH", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}

function getExpenseInitial(description?: string) {
    return description?.trim().charAt(0).toUpperCase() || "?";
}

/*
 * Normalize API data before putting it into React state.
 *
 * This protects the UI from missing/null fields returned
 * by the API while keeping the rest of the page simple.
 */
function normalizeExpense(expense: Partial<Expense>): Expense {
    return {
        id: Number(expense.id),
        amount: Number(expense.amount) || 0,
        description:
            typeof expense.description === "string"
                ? expense.description
                : "",
        date: expense.date ?? "",
        userId: expense.userId ?? "",
    };
}

function SummarySkeleton({
                             width = "w-40",
                         }: {
    width?: string;
}) {
    return (
        <div className="animate-pulse">
            <div className="h-4 w-28 bg-surface-muted" />

            <div
                className={`mt-4 h-10 ${width} bg-surface-muted`}
            />

            <div className="mt-3 h-4 w-36 bg-surface-muted" />
        </div>
    );
}

function ExpenseListSkeleton() {
    return (
        <div className="overflow-hidden border-y border-border bg-surface">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className={`flex items-center justify-between gap-5 px-4 py-5 sm:px-5 ${
                        item > 1 ? "border-t border-border" : ""
                    }`}
                >
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="h-10 w-10 shrink-0 animate-pulse bg-surface-muted" />

                        <div className="min-w-0 animate-pulse">
                            <div className="h-4 w-28 bg-surface-muted" />

                            <div className="mt-2 h-3 w-36 bg-surface-muted" />
                        </div>
                    </div>

                    <div className="h-4 w-20 shrink-0 animate-pulse bg-surface-muted" />
                </div>
            ))}
        </div>
    );
}

export default function ExpensesPage() {
    const router = useRouter();

    // Add expense form
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(getCurrentDate());
    const [time, setTime] = useState(getCurrentTime());

    // Expenses
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Add expense state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit expense state
    const [editingExpense, setEditingExpense] =
        useState<Expense | null>(null);

    const [isUpdating, setIsUpdating] = useState(false);

    const [editAmount, setEditAmount] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");
    const [editError, setEditError] = useState("");

    // Delete expense state
    const [deletingExpense, setDeletingExpense] =
        useState<Expense | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // Expense action menu
    const [openExpenseMenuId, setOpenExpenseMenuId] =
        useState<number | null>(null);

    // General page feedback
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const totalExpenses = useMemo(() => {
        return expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );
    }, [expenses]);

    const EXPENSES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`;


    /*
     * Load expenses
     */
    useEffect(() => {
        async function loadExpenses() {
            setIsLoading(true);
            setError("");

            try {
                const response = await apiRequest(EXPENSES_API_URL);

                const data = await response.json();

                const normalizedExpenses = (
                    data.expenses ?? []
                ).map((expense: Partial<Expense>) =>
                    normalizeExpense(expense)
                );

                setExpenses(normalizedExpenses);
            } catch (error) {
                if (error instanceof SessionExpiredError) {
                    router.push("/login");
                    return;
                }

                setError(
                    "Unable to load your expenses. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadExpenses();
    }, [router]);

    /*
     * Automatically remove success messages.
     */
    useEffect(() => {
        if (!success) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setSuccess("");
        }, 3000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [success]);

    /*
     * Close the three-dot menu when clicking outside it.
     */
    useEffect(() => {
        if (openExpenseMenuId === null) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            const target = event.target as HTMLElement;

            if (!target.closest("[data-expense-menu]")) {
                setOpenExpenseMenuId(null);
            }
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown
            );
        };
    }, [openExpenseMenuId]);

    /*
     * Start editing an expense.
     */
    function startEditing(expense: Expense) {
        const expenseDate = new Date(expense.date);

        const year = expenseDate.getFullYear();

        const month = String(
            expenseDate.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            expenseDate.getDate()
        ).padStart(2, "0");

        const hours = String(
            expenseDate.getHours()
        ).padStart(2, "0");

        const minutes = String(
            expenseDate.getMinutes()
        ).padStart(2, "0");

        setEditingExpense(expense);

        setEditAmount(String(expense.amount));
        setEditDescription(expense.description);
        setEditDate(`${year}-${month}-${day}`);
        setEditTime(`${hours}:${minutes}`);

        setEditError("");
        setOpenExpenseMenuId(null);
    }

    /*
     * Close edit modal.
     */
    function closeEditModal() {
        if (isUpdating) {
            return;
        }

        setEditingExpense(null);

        setEditAmount("");
        setEditDescription("");
        setEditDate("");
        setEditTime("");
        setEditError("");
    }

    /*
     * Start deleting an expense.
     */
    function startDeleting(expense: Expense) {
        setDeletingExpense(expense);
        setDeleteError("");
        setOpenExpenseMenuId(null);
    }

    /*
     * Close delete modal.
     */
    function closeDeleteModal() {
        if (isDeleting) {
            return;
        }

        setDeletingExpense(null);
        setDeleteError("");
    }

    /*
     * Close edit modal with Escape.
     */
    useEffect(() => {
        if (!editingExpense) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !isUpdating) {
                closeEditModal();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [editingExpense, isUpdating]);

    /*
     * Close delete modal with Escape.
     */
    useEffect(() => {
        if (!deletingExpense) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !isDeleting) {
                closeDeleteModal();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [deletingExpense, isDeleting]);

    /*
     * Update expense.
     */
    async function handleUpdateExpense(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!editingExpense) {
            return;
        }

        if (
            !editAmount ||
            !editDescription.trim() ||
            !editDate ||
            !editTime
        ) {
            setEditError("Please complete all fields.");
            return;
        }

        const numericAmount = Number(editAmount);

        if (numericAmount <= 0) {
            setEditError(
                "Amount must be greater than zero."
            );
            return;
        }

        setIsUpdating(true);
        setEditError("");

        try {
            const response = await apiRequest(
                `${EXPENSES_API_URL}/${editingExpense.id}   `,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: numericAmount,
                        description:
                            editDescription.trim(),
                        date: `${editDate}T${editTime}`,
                    }),
                }
            );

            const data = await response.json();

            const updatedExpense =
                normalizeExpense(data);

            setExpenses((currentExpenses) =>
                currentExpenses.map((expense) =>
                    expense.id === updatedExpense.id
                        ? updatedExpense
                        : expense
                )
            );

            setEditingExpense(null);

            setEditAmount("");
            setEditDescription("");
            setEditDate("");
            setEditTime("");
            setEditError("");

            setSuccess(
                "Expense updated successfully."
            );
        } catch (error) {
            if (error instanceof SessionExpiredError) {
                router.push("/login");
                return;
            }

            setEditError(
                "Unable to update the expense. Please try again."
            );
        } finally {
            setIsUpdating(false);
        }
    }

    /*
     * Delete expense.
     */
    async function handleDeleteExpense() {
        if (!deletingExpense) {
            return;
        }

        setIsDeleting(true);
        setDeleteError("");

        try {
            await apiRequest(
                `${EXPENSES_API_URL}/${deletingExpense.id}`,
                {
                    method: "DELETE",
                }
            );

            setExpenses((currentExpenses) =>
                currentExpenses.filter(
                    (expense) =>
                        expense.id !== deletingExpense.id
                )
            );

            setDeletingExpense(null);
            setSuccess("Expense deleted successfully.");
        } catch (error) {
            if (error instanceof SessionExpiredError) {
                router.push("/login");
                return;
            }

            setDeleteError(
                "Unable to delete the expense. Please try again."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    /*
     * Add expense.
     */
    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !amount ||
            !description.trim() ||
            !date ||
            !time
        ) {
            setError("Please complete all fields.");
            setSuccess("");
            return;
        }

        const numericAmount = Number(amount);

        if (numericAmount <= 0) {
            setError(
                "Amount must be greater than zero."
            );
            setSuccess("");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await apiRequest(EXPENSES_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: numericAmount,
                        description:
                            description.trim(),
                        date: `${date}T${time}`,
                    }),
                }
            );

            const data = await response.json();

            const newExpense =
                normalizeExpense(data);

            setExpenses((currentExpenses) => [
                newExpense,
                ...currentExpenses,
            ]);

            setAmount("");
            setDescription("");
            setDate(getCurrentDate());
            setTime(getCurrentTime());

            setSuccess(
                "Expense added successfully."
            );
        } catch (error) {
            if (error instanceof SessionExpiredError) {
                router.push("/login");
                return;
            }

            setError(
                "Unable to create the expense. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <AuthNavbar />

                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

                        {/* Page header */}
                        <header className="mb-10 max-w-2xl">
                            <p className="text-sm font-medium text-text-secondary">
                                Expenses
                            </p>

                            <h1 className="mt-2 text-[2rem] font-semibold leading-[1.08] tracking-[-0.045em] text-text-primary sm:text-4xl">
                                Keep track of where your money goes.
                            </h1>

                            <p className="mt-3 text-base leading-7 text-text-secondary">
                                Record your spending and keep your financial
                                activity organized in one place.
                            </p>
                        </header>

                        {/* Summary */}
                        <section className="mb-12 grid overflow-hidden border border-border bg-border sm:grid-cols-2">

                            {/* Total spending */}
                            <div className="bg-surface px-5 py-6 sm:border-l sm:border-border sm:px-7 sm:py-7">
                                {isLoading ? (
                                    <SummarySkeleton />
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
                            <div className="bg-surface px-6 py-7 sm:border-l sm:border-border sm:px-7">
                                {isLoading ? (
                                    <SummarySkeleton width="w-16" />
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

                        {/* Main content */}
                        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">

                            {/* Add expense */}
                            <section className="order-1 h-fit border border-border bg-surface lg:order-2">

                                <div className="border-b border-border px-6 py-6 sm:px-7">
                                    <div className="flex items-start justify-between gap-4">

                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                                                New expense
                                            </p>

                                            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-text-primary">
                                                Add expense
                                            </h2>

                                            <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                                                Record something you spent money on.
                                            </p>
                                        </div>

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent text-lg font-medium text-text-primary">
                                            +
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6 p-6 sm:p-7"
                                >
                                    {/* Amount */}
                                    <div>
                                        <label
                                            htmlFor="amount"
                                            className="mb-2 block text-sm font-medium text-text-primary"
                                        >
                                            Amount
                                        </label>

                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                                                GH₵
                                            </span>

                                            <input
                                                id="amount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(event) => {
                                                    setAmount(
                                                        event.target.value
                                                    );
                                                    setError("");
                                                    setSuccess("");
                                                }}
                                                className="h-13 w-full border border-border-strong bg-surface pl-14 pr-4 text-lg font-medium text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="mb-2 block text-sm font-medium text-text-primary"
                                        >
                                            Description
                                        </label>

                                        <input
                                            id="description"
                                            type="text"
                                            placeholder="What did you spend on?"
                                            value={description}
                                            onChange={(event) => {
                                                setDescription(
                                                    event.target.value
                                                );
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="h-12 w-full border border-border-strong bg-surface px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                        />
                                    </div>

                                    {/* Date and Time */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">

                                        <div>
                                            <label
                                                htmlFor="date"
                                                className="mb-2 block text-sm font-medium text-text-primary"
                                            >
                                                Date
                                            </label>

                                            <input
                                                id="date"
                                                type="date"
                                                value={date}
                                                onChange={(event) => {
                                                    setDate(
                                                        event.target.value
                                                    );
                                                    setError("");
                                                    setSuccess("");
                                                }}
                                                className="h-12 w-full border border-border-strong bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="time"
                                                className="mb-2 block text-sm font-medium text-text-primary"
                                            >
                                                Time
                                            </label>

                                            <input
                                                id="time"
                                                type="time"
                                                value={time}
                                                onChange={(event) => {
                                                    setTime(
                                                        event.target.value
                                                    );
                                                    setError("");
                                                    setSuccess("");
                                                }}
                                                className="h-12 w-full border border-border-strong bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    {error && (
                                        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
                                            <span className="mt-0.5 text-sm text-red-600">
                                                !
                                            </span>

                                            <p className="text-sm leading-5 text-red-700">
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="flex items-start gap-3 border border-green-200 bg-green-50 px-4 py-3">
                                            <span className="mt-0.5 text-sm text-green-600">
                                                ✓
                                            </span>

                                            <p className="text-sm leading-5 text-green-700">
                                                {success}
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-text-primary transition ${
                                            isSubmitting
                                                ? "cursor-not-allowed bg-neutral-300"
                                                : "bg-accent hover:bg-accent-hover"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-primary/30 border-t-text-primary" />
                                                Adding expense...
                                            </>
                                        ) : (
                                            <>
                                                Add expense

                                                <span
                                                    aria-hidden="true"
                                                    className="text-base"
                                                >
                                                    →
                                                </span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-text-muted">
                                        Your expense will be added to your activity.
                                    </p>
                                </form>
                            </section>

                            {/* Expense list */}
                            <section className="order-2 lg:order-1">

                                <div className="mb-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                                        Activity
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-text-primary">
                                        All expenses
                                    </h2>

                                    <p className="mt-1 text-sm text-text-secondary">
                                        Everything you've recorded so far.
                                    </p>
                                </div>

                                {isLoading ? (
                                    <ExpenseListSkeleton />
                                ) : expenses.length === 0 ? (
                                    <div className="border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
                                        <p className="text-base font-medium text-text-primary">
                                            No expenses yet
                                        </p>

                                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                                            Add your first expense and start
                                            understanding where your money goes.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden border-y border-border bg-surface">

                                        {expenses.map(
                                            (expense, index) => (
                                                <div
                                                    key={expense.id}
                                                    className={`group flex items-center justify-between gap-5 px-4 py-5 transition-colors hover:bg-surface-muted/60 sm:px-5 ${
                                                        index > 0
                                                            ? "border-t border-border"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* Expense information */}
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-muted text-sm font-semibold text-text-secondary">
                                                            {getExpenseInitial(
                                                                expense.description
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium text-text-primary">
                                                                {expense.description ||
                                                                    "Untitled expense"}
                                                            </p>

                                                            <p className="mt-1 text-sm text-text-secondary">
                                                                {formatDate(
                                                                    expense.date
                                                                )}

                                                                <span
                                                                    aria-hidden="true"
                                                                    className="mx-1 text-text-muted"
                                                                >
                                                                    •
                                                                </span>

                                                                {formatTime(
                                                                    expense.date
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Amount + actions */}
                                                    <div
                                                        data-expense-menu
                                                        className="relative flex shrink-0 items-center gap-2"
                                                    >
                                                        <p className="text-sm font-semibold text-text-primary sm:text-base">
                                                            {formatAmount(
                                                                expense.amount
                                                            )}
                                                        </p>

                                                        <button
                                                            type="button"
                                                            aria-label={`Actions for ${
                                                                expense.description ||
                                                                "expense"
                                                            }`}
                                                            aria-expanded={
                                                                openExpenseMenuId ===
                                                                expense.id
                                                            }
                                                            onClick={() =>
                                                                setOpenExpenseMenuId(
                                                                    (
                                                                        currentId
                                                                    ) =>
                                                                        currentId ===
                                                                        expense.id
                                                                            ? null
                                                                            : expense.id
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary sm:opacity-0 sm:group-hover:opacity-100"
                                                        >
                                                            <span
                                                                aria-hidden="true"
                                                                className="text-lg leading-none"
                                                            >
                                                                •••
                                                            </span>
                                                        </button>

                                                        {openExpenseMenuId ===
                                                            expense.id && (
                                                                <div
                                                                    className={`absolute right-0 z-30 w-40 border border-border bg-surface py-1 shadow-md ${
                                                                        index ===
                                                                        0
                                                                            ? "top-full mt-2"
                                                                            : "bottom-full mb-2"
                                                                    }`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            startEditing(
                                                                                expense
                                                                            )
                                                                        }
                                                                        className="w-full px-4 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-surface-muted"
                                                                    >
                                                                        Edit expense
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            startDeleting(
                                                                                expense
                                                                            )
                                                                        }
                                                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                                                    >
                                                                        Delete expense
                                                                    </button>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </main>

                {/* Edit expense modal */}
                {editingExpense && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6"
                        role="presentation"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeEditModal();
                            }
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="edit-expense-title"
                            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                        >
                            {/* Modal header */}
                            <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5 sm:px-7">

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                                        Edit expense
                                    </p>

                                    <h2
                                        id="edit-expense-title"
                                        className="mt-2 text-xl font-semibold tracking-[-0.03em] text-text-primary"
                                    >
                                        Update expense
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        Make changes to this expense and save
                                        when you're done.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={isUpdating}
                                    aria-label="Close edit expense"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center text-xl text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal form */}
                            <form
                                onSubmit={
                                    handleUpdateExpense
                                }
                                className="space-y-6 p-6 sm:p-7"
                            >
                                {/* Amount */}
                                <div>
                                    <label
                                        htmlFor="edit-amount"
                                        className="mb-2 block text-sm font-medium text-text-primary"
                                    >
                                        Amount
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                                            GH₵
                                        </span>

                                        <input
                                            id="edit-amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={editAmount}
                                            onChange={(event) => {
                                                setEditAmount(
                                                    event.target.value
                                                );
                                                setEditError("");
                                            }}
                                            disabled={isUpdating}
                                            autoFocus
                                            className="h-13 w-full border border-border-strong bg-surface pl-14 pr-4 text-lg font-medium text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-surface-muted"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="edit-description"
                                        className="mb-2 block text-sm font-medium text-text-primary"
                                    >
                                        Description
                                    </label>

                                    <input
                                        id="edit-description"
                                        type="text"
                                        placeholder="What did you spend on?"
                                        value={
                                            editDescription
                                        }
                                        onChange={(event) => {
                                            setEditDescription(
                                                event.target.value
                                            );
                                            setEditError("");
                                        }}
                                        disabled={isUpdating}
                                        className="h-12 w-full border border-border-strong bg-surface px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-surface-muted"
                                    />
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                                    <div>
                                        <label
                                            htmlFor="edit-date"
                                            className="mb-2 block text-sm font-medium text-text-primary"
                                        >
                                            Date
                                        </label>

                                        <input
                                            id="edit-date"
                                            type="date"
                                            value={editDate}
                                            onChange={(event) => {
                                                setEditDate(
                                                    event.target.value
                                                );
                                                setEditError("");
                                            }}
                                            disabled={isUpdating}
                                            className="h-12 w-full border border-border-strong bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-surface-muted"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="edit-time"
                                            className="mb-2 block text-sm font-medium text-text-primary"
                                        >
                                            Time
                                        </label>

                                        <input
                                            id="edit-time"
                                            type="time"
                                            value={editTime}
                                            onChange={(event) => {
                                                setEditTime(
                                                    event.target.value
                                                );
                                                setEditError("");
                                            }}
                                            disabled={isUpdating}
                                            className="h-12 w-full border border-border-strong bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-surface-muted"
                                        />
                                    </div>
                                </div>

                                {/* Edit error */}
                                {editError && (
                                    <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
                                        <span className="mt-0.5 text-sm text-red-600">
                                            !
                                        </span>

                                        <p className="text-sm leading-5 text-red-700">
                                            {editError}
                                        </p>
                                    </div>
                                )}

                                {/* Modal actions */}
                                <div className="grid grid-cols-2 gap-3 pt-1">

                                    <button
                                        type="button"
                                        onClick={
                                            closeEditModal
                                        }
                                        disabled={isUpdating}
                                        className="h-12 border border-border bg-surface text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className={`flex h-12 items-center justify-center gap-2 text-sm font-semibold text-text-primary transition ${
                                            isUpdating
                                                ? "cursor-not-allowed bg-neutral-300"
                                                : "bg-accent hover:bg-accent-hover"
                                        }`}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-primary/30 border-t-text-primary" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                Save changes

                                                <span
                                                    aria-hidden="true"
                                                    className="text-base"
                                                >
                                                    →
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete expense modal */}
                {deletingExpense && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6"
                        role="presentation"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeDeleteModal();
                            }
                        }}
                    >
                        <div
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="delete-expense-title"
                            aria-describedby="delete-expense-description"
                            className="w-full max-w-lg border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                        >
                            {/* Modal header */}
                            <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5 sm:px-7">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                                        Delete expense
                                    </p>

                                    <h2
                                        id="delete-expense-title"
                                        className="mt-2 text-xl font-semibold tracking-[-0.03em] text-text-primary"
                                    >
                                        Delete this expense?
                                    </h2>

                                    <p
                                        id="delete-expense-description"
                                        className="mt-2 text-sm leading-6 text-text-secondary"
                                    >
                                        This action cannot be undone.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    disabled={isDeleting}
                                    aria-label="Close delete expense"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center text-xl text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Confirmation content */}
                            <div className="p-6 sm:p-7">
                                <p className="text-sm leading-6 text-text-secondary">
                                    Are you sure you want to delete{" "}
                                    <span className="font-medium text-text-primary">
                                        {deletingExpense.description ||
                                            "Untitled expense"}
                                    </span>{" "}
                                    for{" "}
                                    <span className="font-medium text-text-primary">
                                        {formatAmount(
                                            deletingExpense.amount
                                        )}
                                    </span>
                                    ?
                                </p>

                                {deleteError && (
                                    <div className="mt-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
                                        <span className="mt-0.5 text-sm text-red-600">
                                            !
                                        </span>

                                        <p className="text-sm leading-5 text-red-700">
                                            {deleteError}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal actions */}
                            <div className="grid grid-cols-2 gap-3 border-t border-border px-6 py-5 sm:px-7">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    disabled={isDeleting}
                                    className="h-12 border border-border bg-surface text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDeleteExpense}
                                    disabled={isDeleting}
                                    className={`flex h-12 items-center justify-center gap-2 text-sm font-semibold text-white transition ${
                                        isDeleting
                                            ? "cursor-not-allowed bg-red-300"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    {isDeleting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete expense"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
