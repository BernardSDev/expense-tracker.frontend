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
                    `${process.env.NEXT_PUBLIC_API_URL}/api/Users/Expenses`
                );

                if (!response.ok) {
                    throw new Error("Failed to load expenses.");
                }

                const data = await response.json();

                setExpenses(data.expenses);
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
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
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

                    <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="border border-border bg-surface p-6 lg:col-span-2">
                            <p className="text-sm text-text-secondary">
                                Total spending
                            </p>

                            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-text-primary">
                                GH₵ {totalSpending.toFixed(2)}
                            </p>

                            <p className="mt-2 text-sm text-text-muted">
                                This month
                            </p>
                        </div>

                        <div className="border border-border bg-surface p-6">
                            <p className="text-sm text-text-secondary">
                                Expenses
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                                {expenseCount}
                            </p>

                            <p className="mt-2 text-sm text-text-muted">
                                This month
                            </p>
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

                    <section className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
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

                            <div className="mt-6 border border-border bg-surface">
                                <div className="border-b border-border px-6 py-5">
                                    <p className="text-sm text-text-secondary">
                                        No spending data yet
                                    </p>

                                    <p className="mt-1 text-base text-text-primary">
                                        Add your first expense to see your
                                        spending breakdown.
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                    className="text-sm font-medium text-text-secondary underline underline-offset-4 transition hover:text-text-primary"
                                >
                                    View all
                                </Link>
                            </div>

                            <div className="mt-6 border border-border bg-surface">
                                {isLoadingExpenses ? (
                                    <div className="px-6 py-8">
                                        <p className="text-sm text-text-secondary">
                                            Loading expenses...
                                        </p>
                                    </div>
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
                                                className="flex items-center justify-between px-6 py-5"
                                            >
                                                <div>
                                                    <p className="font-medium text-text-primary">
                                                        {expense.description}
                                                    </p>

                                                    <p className="mt-1 text-sm text-text-secondary">
                                                        {new Date(
                                                            expense.date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <p className="font-semibold text-text-primary">
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