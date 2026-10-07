import {apiRequest} from "./api";

const EXPENSES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`;

export function getExpenses() {
    return apiRequest(EXPENSES_API_URL);
}

export function createExpense(data: {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
}) {
    return apiRequest(EXPENSES_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function updateExpense(
    id: number,
    data: {
        amount: number;
        description: string;
        date: string;
        categoryId?: number;
    }
) {
    return apiRequest(`${EXPENSES_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function deleteExpense(id: number) {
    return apiRequest(`${EXPENSES_API_URL}/${id}`, {
        method: "DELETE",
    });
}