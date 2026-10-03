"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { apiRequest } from "@/lib/api";
import AuthNavbar from "@/components/AuthNavbar";

type Expense = {
    id: number;
    amount: number;
    description: string;
    date: string;
    userId: string;
};

function ExpenseSummarySkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-4 w-24 bg-surface-muted" />

            <div className="mt-4 h-10 w-44 bg-surface-muted" />

            <div className="mt-3 h-4 w-20 bg-surface-muted" />
        </div>
    );
}

function ExpenseCountSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-4 w-20 bg-surface-muted" />

            <div className="mt-4 h-9 w-12 bg-surface-muted" />

            <div className="mt-3 h-4 w-20 bg-surface-muted" />
        </div>
    );
}

function RecentExpensesSkeleton() {
    return (
        <div className="divide-y divide-border">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5"
                >
                    <div className="animate-pulse">
                        <div className="h-4 w-28 bg-surface-muted" />
                        <div className="mt-2 h-3 w-24 bg-surface-muted" />
                    </div>

                    <div className="h-4 w-20 animate-pulse bg-surface-muted" />
                </div>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const [username, setUsername] = useState("there");
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        async function loadExpenses() {
            try {
                const response = await apiRequest(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`
                );

                if (!response.ok) {
                    throw new Error("Failed to load expenses.");
                }

                const data = await response.json();

                setExpenses(data.expenses ?? []);
            } catch (error) {
                console.error("Failed to load expenses:", error);
            } finally {
                setIsLoadingExpenses(false);
            }
        }

        loadExpenses();
    }, []);

    const totalSpending = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const expenseCount = expenses.length;

    const recentExpenses = expenses
        .slice()
        .sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        )
        .slice(0, 3);

    return (
        <ProtectedRoute>
            <AuthNavbar />

            <main className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-6 pb-28 pt-8 sm:pb-8 lg:px-8">
                    {/* Header */}
                    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm text-text-secondary">
                                    Overview
                                </p>

                                <span className="h-1 w-1 rounded-full bg-border-strong" />

                                <p className="text-sm text-text-secondary">
                                    October 2026
                                </p>
                            </div>

                            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Good afternoon, {username}.
                            </h1>
                        </div>

                        <Link
                            href="/expenses"
                            className="inline-flex w-fit items-center bg-accent px-5 py-3 text-sm font-semibold text-text-primary transition hover:bg-accent-hover"
                        >
                            Add expense
                            <span className="ml-2">+</span>
                        </Link>
                    </header>

                    {/* Summary */}
                    <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="border border-border bg-surface p-6 lg:col-span-2">
                            {isLoadingExpenses ? (
                                <ExpenseSummarySkeleton />
                            ) : (
                                <>
                                    <p className="text-sm text-text-secondary">
                                        Total spending
                                    </p>

                                    <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-text-primary">
                                        GH₵ {totalSpending.toFixed(2)}
                                    </p>

                                    <p className="mt-2 text-sm text-text-muted">
                                        This month
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="border border-border bg-surface p-6">
                            {isLoadingExpenses ? (
                                <ExpenseCountSkeleton />
                            ) : (
                                <>
                                    <p className="text-sm text-text-secondary">
                                        Expenses
                                    </p>

                                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                                        {expenseCount}
                                    </p>

                                    <p className="mt-2 text-sm text-text-muted">
                                        This month
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="border border-border bg-surface p-6">
                            <p className="text-sm text-text-secondary">
                                Categories
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                                0
                            </p>

                            <p className="mt-2 text-sm text-text-muted">
                                Active
                            </p>
                        </div>
                    </section>

                    {/* Spending + Recent expenses */}
                    <section className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* Spending */}
                        <div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary">
                                        Spending
                                    </p>

                                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                                        Where your money goes
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-6 overflow-hidden border border-border bg-surface">
                                {isLoadingExpenses ? (
                                    <div className="animate-pulse px-6 py-7">
                                        <div className="h-4 w-32 bg-surface-muted" />

                                        <div className="mt-3 h-4 w-64 bg-surface-muted" />

                                        <div className="mt-7 space-y-4">
                                            <div className="h-3 w-full bg-surface-muted" />
                                            <div className="h-3 w-4/5 bg-surface-muted" />
                                            <div className="h-3 w-3/5 bg-surface-muted" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-b border-border px-6 py-5">
                                        <p className="text-sm text-text-secondary">
                                            No spending data yet
                                        </p>

                                        <p className="mt-1 text-base text-text-primary">
                                            Add your first expense to see your
                                            spending breakdown.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent expenses */}
                        <div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary">
                                        Activity
                                    </p>

                                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                                        Recent expenses
                                    </h2>
                                </div>

                                <Link
                                    href="/expenses"
                                    className="px-2 py-2 text-sm font-medium text-text-secondary underline underline-offset-4 transition hover:text-text-primary"
                                >
                                    View all
                                </Link>
                            </div>

                            <div className="mt-6 overflow-hidden rounded-sm border border-border bg-surface">
                                {isLoadingExpenses ? (
                                    <RecentExpensesSkeleton />
                                ) : recentExpenses.length === 0 ? (
                                    <div className="px-6 py-8">
                                        <p className="text-sm text-text-secondary">
                                            No expenses yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {recentExpenses.map((expense) => (
                                            <div
                                                key={expense.id}
                                                className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-surface-muted/60 sm:px-6 sm:py-5"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-text-primary">
                                                        {expense.description}
                                                    </p>

                                                    <p className="mt-1 text-sm text-text-secondary">
                                                        {new Date(
                                                            expense.date
                                                        ).toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>

                                                <p className="shrink-0 text-sm font-semibold text-text-primary sm:text-base">
                                                    GH₵{" "}
                                                    {expense.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </ProtectedRoute>
    );
}