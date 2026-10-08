import { Expense } from "@/types/expense";
import { formatAmount } from "@/utils/expenses";

import {
    getCategoryStyles,
    type CategoryStyles,
} from "@/components/expenses/categoryStyles";

export type CategoryTotal = {
    key: string;
    name: string;
    total: number;
    count: number;
    styles: CategoryStyles;
};

const MAX_SEGMENTS = 5;

const OTHER_STYLES: CategoryStyles = {
    background: "bg-surface-muted",
    color: "text-text-primary",
    bar: "bg-border-strong",
    barOnDark: "bg-text-muted",
    dot: "bg-border-strong",
};

/**
 * Totals per category, largest first. Anything past the top five folds
 * into "Other" so the bar never needs a seventh colour.
 */
export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
    const totals = new Map<string, CategoryTotal>();

    for (const expense of expenses) {
        const key =
            expense.categoryId !== null
                ? `id-${expense.categoryId}`
                : "uncategorized";
        const existing = totals.get(key);

        if (existing) {
            existing.total += expense.amount;
            existing.count += 1;
            continue;
        }

        totals.set(key, {
            key,
            name: expense.categoryName ?? "Uncategorized",
            total: expense.amount,
            count: 1,
            styles: getCategoryStyles(expense.categoryName, expense.categoryId),
        });
    }

    const sorted = Array.from(totals.values()).sort((a, b) => b.total - a.total);

    if (sorted.length <= MAX_SEGMENTS + 1) {
        return sorted;
    }

    const rest = sorted.slice(MAX_SEGMENTS);

    return [
        ...sorted.slice(0, MAX_SEGMENTS),
        {
            key: "other",
            name: `Other (${rest.length})`,
            total: rest.reduce((sum, category) => sum + category.total, 0),
            count: rest.reduce((sum, category) => sum + category.count, 0),
            styles: OTHER_STYLES,
        },
    ];
}

type CategoryBarProps = {
    categories: CategoryTotal[];
    variant?: "light" | "dark";
    className?: string;
};

export function CategoryBar({
                                categories,
                                variant = "light",
                                className = "h-2.5",
                            }: CategoryBarProps) {
    const total = categories.reduce((sum, category) => sum + category.total, 0);

    if (total === 0) {
        return null;
    }

    return (
        <div
            aria-hidden="true"
            className={`flex gap-[2px] overflow-hidden rounded-full ${className}`}
        >
            {categories.map((category) => (
                <div
                    key={category.key}
                    className={`h-full first:rounded-l-full last:rounded-r-full ${
                        variant === "dark"
                            ? category.styles.barOnDark
                            : category.styles.bar
                    }`}
                    style={{ width: `${(category.total / total) * 100}%` }}
                />
            ))}
        </div>
    );
}

type CategoryBreakdownProps = {
    expenses: Expense[];
};

export default function CategoryBreakdown({
                                              expenses,
                                          }: CategoryBreakdownProps) {
    const categories = getCategoryTotals(expenses);
    const total = categories.reduce((sum, category) => sum + category.total, 0);

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-text-primary">
                        By category
                    </h2>
                    <p className="mt-0.5 text-[13px] text-text-secondary">
                        Where your money went this month
                    </p>
                </div>

                {total > 0 && (
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
                        {categories.length}{" "}
                        {categories.length === 1 ? "category" : "categories"}
                    </span>
                )}
            </div>

            {total === 0 ? (
                <div className="mt-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-border-strong px-6 text-center text-sm text-text-secondary">
                    Add expenses this month to see your breakdown
                </div>
            ) : (
                <>
                    <CategoryBar
                        categories={categories}
                        className="mt-5 h-2.5"
                    />

                    <ul className="mt-4 divide-y divide-surface-muted">
                        {categories.map((category) => {
                            const share = Math.round((category.total / total) * 100);

                            return (
                                <li
                                    key={category.key}
                                    className="flex items-center gap-3 py-2.5 text-sm"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${category.styles.dot}`}
                                    />

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate font-medium text-text-primary">
                                            {category.name}
                                        </span>
                                        <span className="block text-xs text-text-secondary">
                                            {category.count}{" "}
                                            {category.count === 1 ? "expense" : "expenses"}
                                        </span>
                                    </span>

                                    <span className="text-right">
                                        <span className="tabular block font-semibold text-text-primary">
                                            {formatAmount(category.total)}
                                        </span>
                                        <span className="tabular block text-xs text-text-secondary">
                                            {share}%
                                        </span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}
