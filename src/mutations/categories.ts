import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/categories";

import {categoriesQueryKey} from "@/queries/categories";

type CategoryData = {
    name: string;
};

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CategoryData) => createCategory(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoriesQueryKey,
            });
        },
    });
}

export function useUpdateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         data,
                     }: {
            id: number;
            data: CategoryData;
        }) => updateCategory(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoriesQueryKey,
            });
        },
    });
}

export function useDeleteCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            deleteCategory(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoriesQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: ["expenses"],
            });
        },
    });
}