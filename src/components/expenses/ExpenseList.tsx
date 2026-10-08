"use client";

import { useEffect, useMemo, useState } from "react";

import { Expense } from "@/types/expense";
import {
    formatAmount,
    formatDate,
    formatTime,
    getExpenseInitial,
} from "@/utils/expenses";

import { getCategoryStyles } from "./categoryStyles";
import EmptyState from "@/components/ui/EmptyState";

type ExpenseListProps = {
    expenses: Expense[];
    isLoading: boolean;
    error: Error | null;
    onRetry: () => void;
    onAddExpense?: () => void;
    onEdit: (expense: Expense) => void;
    onDelete: (expense: Expense) => void;
};

type LeavingExpense = {
    expense: Expense;
    index: number;
};

type ExpenseGroup = {
    key: string;
    label: string;
    dateLabel: string;
    total: number;
    expenses: Expense[];
};

const ALL = "All";
const UNCATEGORIZED = "Uncategorized";

function getDateKey(value: Date) {
    return [value.getFullYear(), value.getMonth(), value.getDate()].join("-");
}

function getGroupLabels(date: string) {
    const value = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateLabel = value.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    if (getDateKey(value) === getDateKey(today)) {
        return { label: "Today", dateLabel };
    }

    if (getDateKey(value) === getDateKey(yesterday)) {
        return { label: "Yesterday", dateLabel };
    }

    return {
        label: value.toLocaleDateString("en-GB", { weekday: "long" }),
        dateLabel: value.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    };
}

function groupByDay(expenses: Expense[]): ExpenseGroup[] {
    const groups = new Map<string, ExpenseGroup>();

    const sorted = [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const expense of sorted) {
        const key = getDateKey(new Date(expense.date));
        const existing = groups.get(key);

        if (existing) {
            existing.expenses.push(expense);
            existing.total += expense.amount;
            continue;
        }

        groups.set(key, {
            key,
            ...getGroupLabels(expense.date),
            total: expense.amount,
            expenses: [expense],
        });
    }

    return Array.from(groups.values());
}

function CategoryIcon({ expense }: { expense: Expense }) {
    const styles = getCategoryStyles(expense.categoryName, expense.categoryId);

    return (
        <span
            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${styles.background} ${styles.color}`}
        >
            {expense.categoryName === "Groceries" ? (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
            ) : expense.categoryName === "Vacation" ? (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M10.5 13.5L4 11l1.5-1.5 7 1 4-4a2 2 0 0 1 3 3l-4 4 1 7L15 22l-2.5-6.5L9 19v2l-1.5 1-1-3-3-1L5 16.5h2l3.5-3z" />
                </svg>
            ) : (
                getExpenseInitial(expense.description)
            )}
        </span>
    );
}

function SearchIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4-4" />
        </svg>
    );
}

function ExpenseList({
                         expenses,
                         isLoading,
                         error,
                         onRetry,
                         onAddExpense,
                         onEdit,
                         onDelete,
                     }: ExpenseListProps) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(ALL);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Row animations: remember which expenses were already shown, so new ones
    // can be highlighted and deleted ones can fade out instead of vanishing.
    const [previousExpenses, setPreviousExpenses] = useState(expenses);
    const [seenIds, setSeenIds] = useState<Set<number> | null>(null);
    const [newIds, setNewIds] = useState<number[]>([]);
    const [leaving, setLeaving] = useState<LeavingExpense[]>([]);

    if (seenIds === null) {
        if (!isLoading && !error) {
            setSeenIds(new Set(expenses.map((expense) => expense.id)));
            setPreviousExpenses(expenses);
        }
    } else if (expenses !== previousExpenses) {
        const currentIds = new Set(expenses.map((expense) => expense.id));

        const added = expenses
            .filter((expense) => !seenIds.has(expense.id))
            .map((expense) => expense.id);

        const removed = previousExpenses
            .map((expense, index) => ({ expense, index }))
            .filter(({ expense }) => !currentIds.has(expense.id));

        setPreviousExpenses(expenses);

        if (added.length > 0) {
            setSeenIds(new Set([...seenIds, ...added]));
            setNewIds((ids) => [...ids, ...added]);
        }

        if (removed.length > 0) {
            setLeaving((rows) => [...rows, ...removed]);
        }
    }

    useEffect(() => {
        if (newIds.length === 0) {
            return;
        }

        const timeout = setTimeout(() => setNewIds([]), 1700);

        return () => clearTimeout(timeout);
    }, [newIds]);

    useEffect(() => {
        if (leaving.length === 0) {
            return;
        }

        const timeout = setTimeout(() => setLeaving([]), 300);

        return () => clearTimeout(timeout);
    }, [leaving]);

    const leavingIds = useMemo(
        () => new Set(leaving.map(({ expense }) => expense.id)),
        [leaving]
    );

    const displayExpenses = useMemo(() => {
        const merged = [...expenses];

        for (const { expense, index } of [...leaving].sort(
            (a, b) => a.index - b.index
        )) {
            if (!merged.some((item) => item.id === expense.id)) {
                merged.splice(Math.min(index, merged.length), 0, expense);
            }
        }

        return merged;
    }, [expenses, leaving]);

    function getRowAnimation(id: number) {
        if (leavingIds.has(id)) {
            return "pointer-events-none overflow-hidden motion-safe:animate-row-out";
        }

        if (newIds.includes(id)) {
            return "motion-safe:animate-row-new";
        }

        return "";
    }

    const categories = useMemo(() => {
        const names = new Set<string>();

        for (const expense of expenses) {
            names.add(expense.categoryName ?? UNCATEGORIZED);
        }

        return [ALL, ...Array.from(names).sort()];
    }, [expenses]);

    const activeCategory = categories.includes(category) ? category : ALL;

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return displayExpenses.filter((expense) => {
            const name = expense.categoryName ?? UNCATEGORIZED;

            if (activeCategory !== ALL && name !== activeCategory) {
                return false;
            }

            if (!query) {
                return true;
            }

            return (
                expense.description.toLowerCase().includes(query) ||
                name.toLowerCase().includes(query)
            );
        });
    }, [displayExpenses, search, activeCategory]);

    const groups = useMemo(() => groupByDay(filtered), [filtered]);

    const menuExpense =
        openMenuId === null
            ? null
            : expenses.find((expense) => expense.id === openMenuId) ?? null;

    const visibleExpenses = filtered.filter(
        (expense) => !leavingIds.has(expense.id)
    );

    const filteredTotal = visibleExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    useEffect(() => {
        if (openMenuId === null) {
            return;
        }

        function handlePointerDown(event: MouseEvent) {
            if (!(event.target as Element).closest("[data-expense-menu]")) {
                setOpenMenuId(null);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openMenuId]);

    if (isLoading) {
        return (
            <section
                aria-busy="true"
                aria-label="Loading expenses"
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
            >
                <div className="divide-y divide-border">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="flex shimmer items-center gap-3 px-4 py-4 sm:px-6"
                        >
                            <div className="h-[42px] w-[42px] shrink-0 rounded-xl bg-surface-muted" />

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
                    className="mt-5 h-10 rounded-xl bg-dark px-5 text-sm font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                >
                    Try again
                </button>
            </section>
        );
    }

    if (expenses.length === 0) {
        return (
            <section className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6">
                <EmptyState
                    icon="receipt"
                    title="No expenses yet"
                    description="Your first one is a tap away. Add it and it'll show up here."
                    className="py-10"
                    action={
                        onAddExpense && (
                            <button
                                type="button"
                                onClick={onAddExpense}
                                className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-dark px-4 text-sm font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
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
                                Add your first expense
                            </button>
                        )
                    }
                />
            </section>
        );
    }

    const chips = (size: "mobile" | "desktop") =>
        categories.map((name) => {
            const isActive = name === activeCategory;

            return (
                <button
                    key={name}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setCategory(name)}
                    className={`shrink-0 border font-medium transition-colors ${
                        size === "mobile"
                            ? "h-9 rounded-full px-3.5 text-sm"
                            : "h-8 rounded-lg px-3 text-[13px]"
                    } ${
                        isActive
                            ? "border-dark bg-dark text-text-on-dark"
                            : "border-border bg-surface text-text-primary hover:border-border-strong"
                    }`}
                >
                    {name}
                </button>
            );
        });

    const noMatches = (
        <EmptyState
            icon="search"
            title="Nothing matches"
            description="Try a different search or pick another category."
            className="bg-surface"
        />
    );

    return (
        <section>
            {/* Mobile: search, chips and rows grouped by day */}
            <div className="space-y-[18px] md:hidden">
                <label className="flex h-[46px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 text-text-secondary">
                    <SearchIcon />
                    <span className="sr-only">Search expenses</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search expenses"
                        className="min-w-0 flex-1 bg-transparent text-[15px] text-text-primary outline-none"
                    />
                </label>

                <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
                    {chips("mobile")}
                </div>

                {groups.length === 0
                    ? noMatches
                    : groups.map((group) => (
                        <section
                            key={group.key}
                            className="space-y-2"
                        >
                            <div className="flex items-baseline justify-between px-1">
                                <h2 className="text-[13px] font-semibold text-text-primary">
                                    {group.label}{" "}
                                    <span className="font-normal text-text-secondary">
                                        · {group.dateLabel}
                                    </span>
                                </h2>

                                <p className="tabular text-[13px] text-text-secondary">
                                    {formatAmount(group.total)}
                                </p>
                            </div>

                            <ul className="divide-y divide-surface-muted rounded-2xl border border-border bg-surface shadow-card">
                                {group.expenses.map((expense) => {
                                    const isMenuOpen = openMenuId === expense.id;

                                    return (
                                        <li
                                            key={expense.id}
                                            className={`flex items-center gap-3 py-3.5 pl-3.5 pr-2 first:rounded-t-2xl last:rounded-b-2xl ${getRowAnimation(expense.id)}`}
                                        >
                                            <CategoryIcon expense={expense} />

                                            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                                                <p className="truncate text-[15px] font-semibold text-text-primary">
                                                    {expense.description}
                                                </p>

                                                <p className="truncate text-[13px] text-text-secondary">
                                                    {expense.categoryName ?? UNCATEGORIZED}
                                                    {" · "}
                                                    {formatTime(expense.date)}
                                                </p>
                                            </div>

                                            <p className="tabular shrink-0 text-[15px] font-semibold text-text-primary">
                                                −{formatAmount(expense.amount)}
                                            </p>

                                            <div
                                                data-expense-menu
                                                className="relative shrink-0"
                                            >
                                                <button
                                                    type="button"
                                                    aria-label={`Actions for ${expense.description}`}
                                                    aria-haspopup="dialog"
                                                    aria-expanded={isMenuOpen}
                                                    onClick={() =>
                                                        setOpenMenuId(
                                                            isMenuOpen ? null : expense.id
                                                        )
                                                    }
                                                    className="flex h-11 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        viewBox="0 0 24 24"
                                                        className="h-[18px] w-[18px]"
                                                        fill="currentColor"
                                                    >
                                                        <circle cx="12" cy="5" r="1.6" />
                                                        <circle cx="12" cy="12" r="1.6" />
                                                        <circle cx="12" cy="19" r="1.6" />
                                                    </svg>
                                                </button>

                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
            </div>

            {/* Mobile: action sheet for the selected expense */}
            {menuExpense && (
                <div
                    className="fixed inset-0 z-[60] flex items-end bg-dark/40 backdrop-blur-[2px] motion-safe:animate-fade-in md:hidden"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setOpenMenuId(null);
                        }
                    }}
                >
                    <div
                        data-expense-menu
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Actions for ${menuExpense.description}`}
                        className="w-full rounded-t-[20px] bg-surface motion-safe:animate-sheet-in px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 shadow-float"
                    >
                        <div
                            aria-hidden="true"
                            className="mx-auto mb-3 h-1 w-10 rounded-full bg-border-strong"
                        />

                        <div className="flex items-center gap-3 px-1 pb-4">
                            <CategoryIcon expense={menuExpense} />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[15px] font-semibold text-text-primary">
                                    {menuExpense.description}
                                </p>

                                <p className="truncate text-[13px] text-text-secondary">
                                    {formatDate(menuExpense.date)}
                                    {" · "}
                                    {formatTime(menuExpense.date)}
                                </p>
                            </div>

                            <p className="tabular shrink-0 text-[15px] font-semibold text-text-primary">
                                −{formatAmount(menuExpense.amount)}
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-border">
                            <button
                                type="button"
                                autoFocus
                                onClick={() => {
                                    setOpenMenuId(null);
                                    onEdit(menuExpense);
                                }}
                                className="flex h-[52px] w-full items-center gap-3 px-4 text-left text-[15px] font-medium text-text-primary transition-colors hover:bg-surface-muted"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 text-text-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
                                    <path d="M13.5 6.5l3 3" />
                                </svg>
                                Edit expense
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpenMenuId(null);
                                    onDelete(menuExpense);
                                }}
                                className="flex h-[52px] w-full items-center gap-3 border-t border-border px-4 text-left text-[15px] font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                                </svg>
                                Delete expense
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpenMenuId(null)}
                            className="mt-2.5 h-[52px] w-full rounded-2xl bg-surface-muted text-[15px] font-semibold text-text-primary transition-colors hover:bg-border"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop: table card with toolbar */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-card md:block">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-muted px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                        {chips("desktop")}
                    </div>

                    <label className="flex h-9 min-w-[220px] items-center gap-2 rounded-[10px] border border-border px-3 text-text-secondary">
                        <SearchIcon />
                        <span className="sr-only">Search expenses</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search expenses"
                            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none"
                        />
                    </label>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-4">
                        <EmptyState
                            icon="search"
                            title="Nothing matches"
                            description="Try a different search or pick another category."
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-[0.04em] text-text-secondary">
                                    <th scope="col" className="px-4 py-3 font-medium">
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
                                    <th scope="col" className="w-36 px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((expense) => {
                                    const styles = getCategoryStyles(
                                        expense.categoryName,
                                        expense.categoryId
                                    );

                                    return (
                                        <tr
                                            key={expense.id}
                                            className={`group border-t border-surface-muted transition-colors hover:bg-surface-muted/50 ${getRowAnimation(expense.id)}`}
                                        >
                                            <td className="px-4 py-3.5">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span
                                                        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-[13px] font-semibold text-text-primary ${styles.background}`}
                                                    >
                                                        {getExpenseInitial(
                                                            expense.description
                                                        )}
                                                    </span>

                                                    <span className="truncate font-semibold text-text-primary">
                                                        {expense.description}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {expense.categoryName ? (
                                                    <span
                                                        className={`inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-text-primary ${styles.background}`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                                                        />
                                                        {expense.categoryName}
                                                    </span>
                                                ) : (
                                                    <span className="text-text-secondary">
                                                        {UNCATEGORIZED}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3.5 text-text-secondary">
                                                {formatDate(expense.date)}
                                                {" · "}
                                                {formatTime(expense.date)}
                                            </td>

                                            <td className="tabular whitespace-nowrap px-4 py-3.5 text-right font-semibold text-text-primary">
                                                {formatAmount(expense.amount)}
                                            </td>

                                            <td className="px-4 py-2">
                                                <div className="flex justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(expense)}
                                                        className="h-8 rounded-lg px-3 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(expense)}
                                                        className="h-8 rounded-lg px-3 text-[13px] font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
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
                )}

                <div className="flex items-center justify-between border-t border-surface-muted px-4 py-3 text-[13px] text-text-secondary">
                    <span>
                        Showing {visibleExpenses.length} of {expenses.length}
                    </span>

                    <span className="tabular font-semibold text-text-primary">
                        {formatAmount(filteredTotal)}
                    </span>
                </div>
            </div>
        </section>
    );
}

export default ExpenseList;
