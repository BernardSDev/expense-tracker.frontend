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

function getExpenseInitial(description: string) {
    return description.trim().charAt(0).toUpperCase();
}

export default function ExpensesPage() {
    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(getCurrentDate());
    const [time, setTime] = useState(getCurrentTime());

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const totalExpenses = useMemo(() => {
        return expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );
    }, [expenses]);

    useEffect(() => {
        async function loadExpenses() {
            setIsLoading(true);
            setError("");

            try {
                const response = await apiRequest(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`
                );

                const data = await response.json();

                setExpenses(data.expenses ?? []);
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

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!amount || !description.trim() || !date || !time) {
            setError("Please complete all fields.");
            setSuccess("");
            return;
        }

        const numericAmount = Number(amount);

        if (numericAmount <= 0) {
            setError("Amount must be greater than zero.");
            setSuccess("");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await apiRequest(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: numericAmount,
                        description: description.trim(),
                        date: `${date}T${time}`,
                    }),
                }
            );

            const data = await response.json();

            setExpenses((currentExpenses) => [
                data,
                ...currentExpenses,
            ]);

            setAmount("");
            setDescription("");
            setDate(getCurrentDate());
            setTime(getCurrentTime());

            setSuccess("Expense added successfully.");
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
                    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
                        {/* Page header */}
                        <header className="mb-10 max-w-2xl">
                            <p className="text-sm font-medium text-text-secondary">
                                Expenses
                            </p>

                            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
                                Keep track of where your money goes.
                            </h1>

                            <p className="mt-3 text-base leading-7 text-text-secondary">
                                Record your spending and keep your financial
                                activity organized in one place.
                            </p>
                        </header>

                        {/* Summary */}
                        <section className="mb-12 grid overflow-hidden border border-border bg-border sm:grid-cols-2">
                            <div className="bg-surface px-6 py-7 sm:px-7">
                                <p className="text-sm font-medium text-text-secondary">
                                    Total spending
                                </p>

                                <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
                                    {formatAmount(totalExpenses)}
                                </p>

                                <p className="mt-2 text-sm text-text-muted">
                                    Across {expenses.length} recorded{" "}
                                    {expenses.length === 1
                                        ? "expense"
                                        : "expenses"}
                                </p>
                            </div>

                            <div className="bg-surface px-6 py-7 sm:border-l sm:border-border sm:px-7">
                                <p className="text-sm font-medium text-text-secondary">
                                    Expenses recorded
                                </p>

                                <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
                                    {expenses.length}
                                </p>

                                <p className="mt-2 text-sm text-text-muted">
                                    Your spending activity
                                </p>
                            </div>
                        </section>

                        {/* Main content */}
                        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
                            {/* Add expense - appears first on mobile */}
                            <section className="order-1 h-fit border border-border bg-surface p-6 sm:p-7 lg:order-2">
                                <div className="mb-7">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                                        New expense
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-text-primary">
                                        Add expense
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        Record something you spent money on.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {/* Amount */}
                                    <div>
                                        <label
                                            htmlFor="amount"
                                            className="mb-2 block text-sm font-medium text-text-primary"
                                        >
                                            Amount
                                        </label>

                                        <input
                                            id="amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(event) => {
                                                setAmount(event.target.value);
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="h-12 w-full border border-border-strong bg-surface px-4 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                        />
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
                                            placeholder="e.g. Lunch"
                                            value={description}
                                            onChange={(event) => {
                                                setDescription(
                                                    event.target.value
                                                );
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="h-12 w-full border border-border-strong bg-surface px-4 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
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
                                                    setDate(event.target.value);
                                                    setError("");
                                                    setSuccess("");
                                                }}
                                                className="h-12 w-full border border-border-strong bg-surface px-3 text-base text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40"
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
                                                    setTime(event.target.value);
                                                    setError("");
                                                    setSuccess("");
                                                }}
                                                className="h-12 w-full border border-border-strong bg-surface px-3 text-base text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    {error && (
                                        <div className="border border-red-200 bg-red-50 px-4 py-3">
                                            <p className="text-sm text-red-700">
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="border border-green-200 bg-green-50 px-4 py-3">
                                            <p className="text-sm text-green-700">
                                                {success}
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex h-12 w-full items-center justify-center text-sm font-semibold text-text-primary transition ${
                                            isSubmitting
                                                ? "cursor-not-allowed bg-neutral-300"
                                                : "bg-accent hover:bg-accent-hover"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-text-primary/30 border-t-text-primary" />
                                                Adding expense...
                                            </>
                                        ) : (
                                            "Add expense"
                                        )}
                                    </button>
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
                                    <div className="border border-border bg-surface">
                                        <div className="animate-pulse px-5 py-6">
                                            <div className="h-4 w-32 bg-surface-muted" />
                                            <div className="mt-3 h-3 w-48 bg-surface-muted" />
                                        </div>

                                        <div className="border-t border-border animate-pulse px-5 py-6">
                                            <div className="h-4 w-24 bg-surface-muted" />
                                            <div className="mt-3 h-3 w-44 bg-surface-muted" />
                                        </div>

                                        <div className="border-t border-border animate-pulse px-5 py-6">
                                            <div className="h-4 w-28 bg-surface-muted" />
                                            <div className="mt-3 h-3 w-40 bg-surface-muted" />
                                        </div>
                                    </div>
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
                                        {expenses.map((expense, index) => (
                                            <div
                                                key={expense.id}
                                                className={`group flex items-center justify-between gap-5 px-4 py-5 transition-colors hover:bg-surface-muted/60 sm:px-5 ${
                                                    index > 0
                                                        ? "border-t border-border"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-muted text-sm font-semibold text-text-secondary">
                                                        {getExpenseInitial(
                                                            expense.description
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-text-primary">
                                                            {
                                                                expense.description
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-sm text-text-secondary">
                                                            {formatDate(
                                                                expense.date
                                                            )}{" "}
                                                            <span
                                                                aria-hidden="true"
                                                                className="mx-1 text-text-muted"
                                                            >
                                                                •
                                                            </span>{" "}
                                                            {formatTime(
                                                                expense.date
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="shrink-0 text-sm font-semibold text-text-primary sm:text-base">
                                                    {formatAmount(
                                                        expense.amount
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}