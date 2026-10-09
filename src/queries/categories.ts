import {useQuery} from "@tanstack/react-query";

import {getCategories} from "@/lib/categories";
import { Category } from "@/types/category";

export type { Category };

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