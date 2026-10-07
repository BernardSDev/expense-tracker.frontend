import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createExpense, updateExpense, deleteExpense} from "@/lib/expenses";
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

type UpdateExpenseData = {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
};

export function useUpdateExpenseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         data,
                     }: {
            id: number;
            data: UpdateExpenseData;
        }) => updateExpense(id, data),

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
        mutationFn: ({ id }: DeleteExpenseVariables) =>
            deleteExpense(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}