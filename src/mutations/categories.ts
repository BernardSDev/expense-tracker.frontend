import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory, deleteCategory, updateCategory } from "@/lib/categories";
import { categoriesQueryKey } from "@/queries/categories";
import { expensesQueryKey } from "@/queries/expenses";
import { CategoryInput } from "@/types/category";

type UpdateCategoryVariables = {
    id: number;
    data: CategoryInput;
};

async function getErrorMessage(response: Response, fallback: string) {
    const body = await response.json().catch(() => null);

    return body?.details || body?.message || fallback;
}

async function addCategory(data: CategoryInput) {
    const response = await createCategory(data);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to create category."));
    }

    return response;
}

async function editCategory({ id, data }: UpdateCategoryVariables) {
    const response = await updateCategory(id, data);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to update category."));
    }

    return response;
}

async function removeCategory(id: number) {
    const response = await deleteCategory(id);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to delete category."));
    }

    return response;
}

function useCategoryMutation<TVariables>(
    mutationFn: (variables: TVariables) => Promise<Response>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoriesQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: expensesQueryKey,
            });
        },
    });
}

export function useCreateCategoryMutation() {
    return useCategoryMutation(addCategory);
}

export function useUpdateCategoryMutation() {
    return useCategoryMutation(editCategory);
}

export function useDeleteCategoryMutation() {
    return useCategoryMutation(removeCategory);
}
