import {apiRequest} from "./api";

const CATEGORIES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Categories`;

export function getCategories() {
    return apiRequest(CATEGORIES_API_URL);
}

export function createCategory(data: {
    name: string;
}) {
    return apiRequest(CATEGORIES_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function updateCategory(
    id: number,
    data: {
        name: string;
    }
) {
    return apiRequest(`${CATEGORIES_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function deleteCategory(id: number) {
    return apiRequest(`${CATEGORIES_API_URL}/${id}`, {
        method: "DELETE",
    });
}