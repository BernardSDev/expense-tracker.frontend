import { DateRange, Expense } from "@/types/expense";

export function getCurrentDate() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getCurrentTime() {
    const now = new Date();

    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function getMonthRange(month: Date): DateRange {
    return {
        from: new Date(month.getFullYear(), month.getMonth(), 1),
        to: new Date(month.getFullYear(), month.getMonth() + 1, 1),
    };
}

export function toMonthKey(month: Date) {
    return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
}

export function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
    }).format(amount);
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GH", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-GH", {
        hour: "numeric",
        minute: "2-digit",
    });
}

export function getExpenseInitial(description?: string) {
    return description?.charAt(0).toUpperCase() || "?";
}

export function normalizeExpense(
    expense: Partial<Expense>
): Expense {
    return {
        id: Number(expense.id),
        amount: Number(expense.amount) || 0,
        description:
            typeof expense.description === "string"
                ? expense.description
                : "",
        date: expense.date ?? "",
        userId: expense.userId ?? "",
        categoryId: expense.categoryId ?? null,
        categoryName: expense.categoryName ?? null,
    };
}