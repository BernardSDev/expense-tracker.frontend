import { apiRequest } from "./api";
import { DateRange, ExpenseInput } from "@/types/expense";

const EXPENSES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`;

export function getExpenses(range?: DateRange) {
    if (!range) {
        return apiRequest(EXPENSES_API_URL);
    }

    const params = new URLSearchParams({
        from: range.from.toISOString(),
        to: range.to.toISOString(),
    });

    return apiRequest(`${EXPENSES_API_URL}?${params}`);
}

export function createExpense(data: ExpenseInput) {
    return apiRequest(EXPENSES_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function updateExpense(id: number, data: ExpenseInput) {
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