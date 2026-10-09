import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExpense, deleteExpense, updateExpense } from "@/lib/expenses";
import { expensesQueryKey } from "@/queries/expenses";
import { ExpenseInput } from "@/types/expense";

type UpdateExpenseVariables = {
    id: number;
    data: ExpenseInput;
};

type DeleteExpenseVariables = {
    id: number;
};

async function addExpense(data: ExpenseInput) {
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

function useExpenseMutation<TVariables>(
    mutationFn: (variables: TVariables) => Promise<Response>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}

export function useCreateExpenseMutation() {
    return useExpenseMutation(addExpense);
}

export function useUpdateExpenseMutation() {
    return useExpenseMutation(editExpense);
}

export function useDeleteExpenseMutation() {
    return useExpenseMutation(removeExpense);
}

