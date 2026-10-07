import {useQuery} from "@tanstack/react-query";

import {getCategories} from "@/lib/categories";

export type Category = {
    id: number;
    name: string;
};

export const categoriesQueryKey = ["categories"];

export function useCategoriesQuery() {
    return useQuery({
        queryKey: categoriesQueryKey,
        queryFn: async (): Promise<Category[]> => {
            const response = await getCategories();

            if (!response.ok) {
                throw new Error("Failed to load categories.");
            }

            return response.json();
        },
    });
}