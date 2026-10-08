"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthNavbar from "@/components/navigation/AuthNavbar";
import CategoryBreakdown, {
    CategoryBar,
    getCategoryTotals,
} from "@/components/dashboard/CategoryBreakdown";
import SpendingChart from "@/components/dashboard/SpendingChart";
import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import { getCategoryStyles } from "@/components/expenses/categoryStyles";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import StatLabel from "@/components/ui/StatLabel";

import { useExpensesQuery } from "@/queries/expenses";
import { Expense } from "@/types/expense";
import {
    formatAmount,
    formatDate,
    formatTime,
    getExpenseInitial,
} from "@/utils/expenses";

function subscribeToStorage(callback: () => void) {
    window.addEventListener("storage", callback);

    return () => window.removeEventListener("storage", callback);
}

function getGreeting(hour: number) {
    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
}

function isSameMonth(date: Date, reference: Date) {
    return (
        date.getFullYear() === reference.getFullYear() &&
        date.getMonth() === reference.getMonth()
    );
}

function isSameDay(date: Date, reference: Date) {
    return isSameMonth(date, reference) && date.getDate() === reference.getDate();
}

function sum(expenses: Expense[]) {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function StatSkeleton({ dark = false }: { dark?: boolean }) {
    const block = dark ? "bg-dark-surface" : "bg-surface-muted";

    return (
        <div className="animate-pulse">
            <div className={`h-3.5 w-24 rounded ${block}`} />
            <div className={`mt-4 h-8 w-32 rounded ${block}`} />
            <div className={`mt-3 h-3.5 w-20 rounded ${block}`} />
        </div>
    );
}

export default function DashboardPage() {
    const {
        data: expenses = [],
        isLoading,
        error,
        refetch,
    } = useExpensesQuery();

    const [isAddOpen, setIsAddOpen] = useState(false);

    const username = useSyncExternalStore(
        subscribeToStorage,
        () => localStorage.getItem("username") ?? "",
        () => ""
    );

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthExpenses = expenses.filter((expense) =>
        isSameMonth(new Date(expense.date), now)
    );
    const lastMonthExpenses = expenses.filter((expense) =>
        isSameMonth(new Date(expense.date), lastMonth)
    );
    const todayExpenses = thisMonthExpenses.filter((expense) =>
        isSameDay(new Date(expense.date), now)
    );

    const monthTotal = sum(thisMonthExpenses);
    const lastMonthTotal = sum(lastMonthExpenses);
    const dailyAverage = monthTotal / now.getDate();

    const monthChange =
        lastMonthTotal > 0
            ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100
            : null;

    const monthCategories = getCategoryTotals(thisMonthExpenses);
    const topCategory = monthCategories.find((category) => category.key !== "other");

    const recentExpenses = expenses
        .slice()
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5);

    const monthName = now.toLocaleDateString("en-GB", { month: "long" });
    const lastMonthName = lastMonth.toLocaleDateString("en-GB", {
        month: "long",
    });

    return (
        <ProtectedRoute>
            <AuthNavbar />

            <main className="min-h-screen bg-background lg:pl-60">
                <div className="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12 lg:pt-10">
                    {/* Header */}
                    <PageHeader
                        eyebrow={now.toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                        title={`${getGreeting(now.getHours())}${username ? `, ${username}` : ""}.`}
                        description="Here's how your spending looks this month."
                        actions={
                            <>
                                <Link
                                    href="/expenses"
                                    className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted sm:flex-none"
                                >
                                    View expenses
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(true)}
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-dark px-4 text-sm font-semibold text-text-on-dark transition-[background-color,transform] duration-150 hover:bg-dark-surface active:scale-[0.98] sm:flex-none"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4 text-accent"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                    >
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    Add expense
                                </button>
                            </>
                        }
                    />

                    {error && (
                        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-text-primary">
                                We couldn&apos;t load your expenses. Your numbers may be out of date.
                            </p>

                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="h-9 shrink-0 rounded-lg bg-dark px-4 text-sm font-semibold text-text-on-dark transition-[background-color,transform] duration-150 hover:bg-dark-surface active:scale-[0.98]"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Stats */}
                    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        <div className="col-span-2 rounded-2xl bg-dark p-5 text-text-on-dark lg:col-span-1">
                            {isLoading ? (
                                <StatSkeleton dark />
                            ) : (
                                <>
                                    <StatLabel icon="wallet" tone="dark">
                                        Spent in {monthName}
                                    </StatLabel>

                                    <p className="tabular mt-3 text-[30px] font-semibold leading-tight tracking-[-0.03em]">
                                        {formatAmount(monthTotal)}
                                    </p>

                                    <p className="mt-2 text-[13px] text-text-muted">
                                        {monthChange === null ? (
                                            `No spending recorded in ${lastMonthName}`
                                        ) : (
                                            <>
                                                <span
                                                    className={`mr-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                                                        monthChange > 0
                                                            ? "bg-negative-soft text-negative"
                                                            : "bg-positive-soft text-positive"
                                                    }`}
                                                >
                                                    {monthChange > 0 ? "↑" : "↓"}{" "}
                                                    {Math.abs(Math.round(monthChange))}%
                                                </span>
                                                vs {lastMonthName}
                                            </>
                                        )}
                                    </p>

                                    {monthTotal > 0 && (
                                        <div className="mt-4 flex flex-col gap-2.5">
                                            <CategoryBar
                                                categories={monthCategories}
                                                variant="dark"
                                                className="h-2"
                                            />

                                            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-text-muted">
                                                {monthCategories.slice(0, 3).map((category) => (
                                                    <li
                                                        key={category.key}
                                                        className="flex min-w-0 items-center gap-1.5"
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`h-2 w-2 shrink-0 rounded-[3px] ${category.styles.barOnDark}`}
                                                        />
                                                        <span className="truncate">
                                                            {category.name}
                                                        </span>
                                                        <span className="tabular text-text-on-dark">
                                                            {formatAmount(category.total)}
                                                        </span>
                                                    </li>
                                                ))}

                                                {monthCategories.length > 3 && (
                                                    <li>+{monthCategories.length - 3} more</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="rounded-2xl border border-border bg-surface shadow-card p-4 sm:p-5">
                            {isLoading ? (
                                <StatSkeleton />
                            ) : (
                                <>
                                    <StatLabel icon="receipt">
                                        Expenses
                                    </StatLabel>

                                    <p className="tabular mt-2 text-2xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[28px]">
                                        {thisMonthExpenses.length}
                                    </p>

                                    <p className="mt-1 text-[13px] text-text-secondary">
                                        {todayExpenses.length} today
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="rounded-2xl border border-border bg-surface shadow-card p-4 sm:p-5">
                            {isLoading ? (
                                <StatSkeleton />
                            ) : (
                                <>
                                    <StatLabel icon="calendar">
                                        Daily average
                                    </StatLabel>

                                    <p className="tabular mt-2 truncate text-2xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[28px]">
                                        {formatAmount(dailyAverage)}
                                    </p>

                                    <p className="mt-1 text-[13px] text-text-secondary">
                                        This month
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="col-span-2 rounded-2xl border border-border bg-surface shadow-card p-4 sm:p-5 lg:col-span-1">
                            {isLoading ? (
                                <StatSkeleton />
                            ) : (
                                <>
                                    <StatLabel icon="tag">
                                        Top category
                                    </StatLabel>

                                    <p className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[28px]">
                                        {topCategory ? topCategory.name : "None yet"}
                                    </p>

                                    <p className="mt-1 text-[13px] text-text-secondary">
                                        {topCategory && monthTotal > 0
                                            ? `${formatAmount(topCategory.total)} · ${Math.round((topCategory.total / monthTotal) * 100)}% of spending`
                                            : "Add an expense to see this"}
                                    </p>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Charts */}
                    <section className="mt-4 grid gap-4 lg:grid-cols-5">
                        <div className="rounded-2xl border border-border bg-surface shadow-card p-5 sm:p-6 lg:col-span-3">
                            {isLoading ? (
                                <div className="h-60 animate-pulse rounded-xl bg-surface-muted" />
                            ) : (
                                <SpendingChart expenses={expenses} />
                            )}
                        </div>

                        <div className="rounded-2xl border border-border bg-surface shadow-card p-5 sm:p-6 lg:col-span-2">
                            {isLoading ? (
                                <div className="h-60 animate-pulse rounded-xl bg-surface-muted" />
                            ) : (
                                <CategoryBreakdown expenses={thisMonthExpenses} />
                            )}
                        </div>
                    </section>

                    {/* Recent expenses */}
                    <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
                        <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-5 sm:px-6">
                            <div>
                                <h2 className="text-base font-semibold text-text-primary">
                                    Recent expenses
                                </h2>
                                <p className="mt-0.5 text-[13px] text-text-secondary">
                                    Your latest activity
                                </p>
                            </div>

                            <Link
                                href="/expenses"
                                className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                            >
                                View all
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7.5 5l5 5-5 5" />
                                </svg>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="divide-y divide-surface-muted">
                                {[0, 1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="flex animate-pulse items-center gap-3 px-5 py-3.5 sm:px-6"
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
                        ) : recentExpenses.length === 0 ? (
                            <div className="px-5 pb-6 pt-2 sm:px-6">
                                <div className="rounded-xl border border-dashed border-border-strong px-6 py-8 text-center">
                                    <p className="text-sm font-medium text-text-primary">
                                        No expenses yet
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary">
                                        Add your first expense to start tracking.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-surface-muted border-t border-surface-muted">
                                {recentExpenses.map((expense) => {
                                    const styles = getCategoryStyles(
                                        expense.categoryName,
                                        expense.categoryId
                                    );

                                    return (
                                        <li
                                            key={expense.id}
                                            className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
                                        >
                                            <span
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${styles.background} ${styles.color}`}
                                            >
                                                {getExpenseInitial(expense.description)}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[15px] font-semibold text-text-primary">
                                                    {expense.description}
                                                </p>
                                                <p className="truncate text-[13px] text-text-secondary">
                                                    {expense.categoryName ?? "Uncategorized"}
                                                    {" · "}
                                                    {formatDate(expense.date)}
                                                    <span className="hidden sm:inline">
                                                        {" · "}
                                                        {formatTime(expense.date)}
                                                    </span>
                                                </p>
                                            </div>

                                            <p className="tabular shrink-0 text-[15px] font-semibold text-text-primary">
                                                −{formatAmount(expense.amount)}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                </div>
            </main>

            <Modal
                isOpen={isAddOpen}
                title="Add expense"
                description="Record a new expense and keep your spending organized."
                onClose={() => setIsAddOpen(false)}
            >
                <AddExpenseForm
                    onCancel={() => setIsAddOpen(false)}
                    onSuccess={() => setIsAddOpen(false)}
                />
            </Modal>
        </ProtectedRoute>
    );
}
