import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExpense, deleteExpense, updateExpense } from "@/lib/expenses";
import { expensesQueryKey } from "@/queries/expenses";

type ExpenseData = {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
};

type UpdateExpenseVariables = {
    id: number;
    data: ExpenseData;
};

type DeleteExpenseVariables = {
    id: number;
};

async function addExpense(data: ExpenseData) {
    const response = await createExpense(data);

    if (!response.ok) {
        throw new Error("Failed to add expense.");
    }

    return response;
}

async function editExpense({ id, data }: UpdateExpenseVariables) {
    const response = await updateExpense(id, data);

    if (!response.ok) {
        throw new Error("Failed to update expense.");
    }

    return response;
}

async function removeExpense({ id }: DeleteExpenseVariables) {
    const response = await deleteExpense(id);

    if (!response.ok) {
        throw new Error("Failed to delete expense.");
    }

    return response;
}

export function useCreateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addExpense,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}

export function useUpdateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editExpense,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}

export function useDeleteExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeExpense,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}
