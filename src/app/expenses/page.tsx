"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
    apiRequest,
    SessionExpiredError,
} from "@/lib/api";

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

export default function ExpensesPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");

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
        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }

        async function loadExpenses() {
            setIsLoading(true);
            setError("");

            try {
                const response = await apiRequest(
                    "http://localhost:5077/api/Expenses"
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
                "http://localhost:5077/api/Expenses",
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

    function handleSignOut() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        router.push("/login");
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                {/* Header */}
                <header className="mb-10 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                            My expenses
                        </h1>

                        <p className="mt-1 text-sm text-text-secondary">
                            Keep track of where your money goes.
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        {username && (
                            <span className="hidden text-sm font-medium text-text-primary sm:block">
                Hi, {username}
              </span>
                        )}

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
                        >
                            Sign out
                        </button>
                    </div>
                </header>

                {/* Summary */}
                <section className="mb-10 grid gap-px border border-border bg-border sm:grid-cols-2">
                    <div className="bg-surface p-6">
                        <p className="text-sm text-text-secondary">
                            Total spending
                        </p>

                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                            {formatAmount(totalExpenses)}
                        </p>
                    </div>

                    <div className="bg-surface p-6">
                        <p className="text-sm text-text-secondary">
                            Expenses recorded
                        </p>

                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                            {expenses.length}
                        </p>
                    </div>
                </section>

                {/* Main content */}
                <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
                    {/* Expense list */}
                    <section>
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                                Recent expenses
                            </h2>

                            <p className="mt-1 text-sm text-text-secondary">
                                Your latest spending activity.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="border border-border bg-surface p-10 text-center">
                                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-border border-t-text-primary" />

                                <p className="mt-4 text-sm text-text-secondary">
                                    Loading your expenses...
                                </p>
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="border border-dashed border-border-strong bg-surface p-10 text-center">
                                <p className="text-base font-medium text-text-primary">
                                    No expenses yet
                                </p>

                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                                    Add your first expense and start understanding
                                    where your money goes.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border border-y border-border bg-surface">
                                {expenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between gap-6 px-5 py-5"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-text-primary">
                                                {expense.description}
                                            </p>

                                            <p className="mt-1 text-sm text-text-secondary">
                                                {formatDate(expense.date)}{" "}
                                                <span aria-hidden="true">•</span>{" "}
                                                {formatTime(expense.date)}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-base font-semibold text-text-primary">
                                            {formatAmount(expense.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Add expense */}
                    <section className="h-fit border border-border bg-surface p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                                Add expense
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-text-secondary">
                                Record something you spent money on.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                        setDescription(event.target.value);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="h-12 w-full border border-border-strong bg-surface px-4 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                />
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
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
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="text-sm text-green-700">
                                    {success}
                                </p>
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
                </div>
            </div>
        </main>
    );
}