import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createExpense, updateExpense, deleteExpense} from "@/lib/expenses";
import { expensesQueryKey } from "@/queries/expenses";

// fetch only rejects on network failure, so turn 4xx/5xx into an error
// that React Query treats as a failed mutation (onError, not onSuccess).
async function ensureOk(response: Response, fallback: string) {
    if (!response.ok) {
        throw new Error(fallback);
    }

    return response;
}

type CreateExpenseData = {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
};

export function useCreateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateExpenseData) =>
            ensureOk(
                await createExpense(data),
                "Failed to add expense."
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}

type UpdateExpenseData = {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
};

export function useUpdateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                         id,
                         data,
                     }: {
            id: number;
            data: UpdateExpenseData;
        }) =>
            ensureOk(
                await updateExpense(id, data),
                "Failed to update expense."
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}

type DeleteExpenseVariables = {
    id: number;
};

export function useDeleteExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: DeleteExpenseVariables) =>
            ensureOk(
                await deleteExpense(id),
                "Failed to delete expense."
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}