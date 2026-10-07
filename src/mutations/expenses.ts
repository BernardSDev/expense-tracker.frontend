import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExpense } from "@/lib/expenses";
import { expensesQueryKey } from "@/queries/expenses";

type CreateExpenseData = {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
};

export function useCreateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExpenseData) =>
            createExpense(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}