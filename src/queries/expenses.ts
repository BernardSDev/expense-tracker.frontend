import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getExpenses } from "@/lib/expenses";
import { DateRange, Expense } from "@/types/expense";
import { getMonthRange, normalizeExpense, toMonthKey } from "@/utils/expenses";

export const expensesQueryKey = ["expenses"];

async function fetchExpenses(range?: DateRange): Promise<Expense[]> {
    const response = await getExpenses(range);

    if (!response.ok) {
        throw new Error("Failed to load expenses.");
    }

    const data = await response.json();

    return (data.expenses ?? []).map(
        (expense: Partial<Expense>) => normalizeExpense(expense)
    );
}

export function useExpensesQuery(month?: Date) {
    const range = month ? getMonthRange(month) : undefined;

    return useQuery({
        queryKey: month
            ? [...expensesQueryKey, toMonthKey(month)]
            : expensesQueryKey,
        queryFn: () => fetchExpenses(range),
        placeholderData: keepPreviousData,
    });
}
