import { Expense } from "@/types/expense";
import { formatAmount } from "@/utils/expenses";

import { getCategoryStyles } from "@/components/expenses/categoryStyles";

type CategoryBreakdownProps = {
    expenses: Expense[];
};

type CategoryTotal = {
    name: string;
    categoryName: string | null;
    total: number;
    count: number;
};

function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
    const totals = new Map<string, CategoryTotal>();

    for (const expense of expenses) {
        const name = expense.categoryName ?? "Uncategorized";
        const existing = totals.get(name);

        if (existing) {
            existing.total += expense.amount;
            existing.count += 1;
            continue;
        }

        totals.set(name, {
            name,
            categoryName: expense.categoryName,
            total: expense.amount,
            count: 1,
        });
    }

    return Array.from(totals.values()).sort((a, b) => b.total - a.total);
}

export default function CategoryBreakdown({
                                              expenses,
                                          }: CategoryBreakdownProps) {
    const categories = getCategoryTotals(expenses);
    const total = categories.reduce((sum, category) => sum + category.total, 0);

    return (
        <div>
            <h2 className="text-base font-semibold text-text-primary">
                Where your money goes
            </h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">
                This month, by category
            </p>

            {total === 0 ? (
                <div className="mt-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-border-strong px-6 text-center text-sm text-text-secondary">
                    Add expenses this month to see your breakdown
                </div>
            ) : (
                <ul className="mt-5 space-y-4">
                    {categories.map((category) => {
                        const share = (category.total / total) * 100;
                        const styles = getCategoryStyles(category.categoryName);

                        return (
                            <li key={category.name}>
                                <div className="flex items-baseline justify-between gap-3 text-sm">
                                    <span className="flex min-w-0 items-center gap-2 font-medium text-text-primary">
                                        <span
                                            aria-hidden="true"
                                            className={`h-2 w-2 shrink-0 rounded-[3px] ${styles.bar}`}
                                        />
                                        <span className="truncate">
                                            {category.name}
                                        </span>
                                        <span className="shrink-0 text-[13px] font-normal text-text-secondary">
                                            {category.count}{" "}
                                            {category.count === 1 ? "expense" : "expenses"}
                                        </span>
                                    </span>

                                    <span className="tabular shrink-0 font-semibold text-text-primary">
                                        {formatAmount(category.total)}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-3">
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                                        <div
                                            className={`h-full rounded-full ${styles.bar}`}
                                            style={{ width: `${share}%` }}
                                        />
                                    </div>

                                    <span className="tabular w-10 shrink-0 text-right text-xs text-text-secondary">
                                        {Math.round(share)}%
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
