import { useQuery } from "@tanstack/react-query";

import { getExpenses } from "@/lib/expenses";
import { Expense } from "@/types/expense";
import { normalizeExpense } from "@/utils/expenses";

export const expensesQueryKey = ["expenses"];

export function useExpensesQuery() {
    return useQuery({
        queryKey: expensesQueryKey,
        queryFn: async (): Promise<Expense[]> => {
            const response = await getExpenses();

            if (!response.ok) {
                throw new Error("Failed to load expenses.");
            }

            const data = await response.json();

            return (data.expenses ?? []).map(
                (expense: Partial<Expense>) =>
                    normalizeExpense(expense)
            );
        },
    });
}