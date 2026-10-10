export type Expense = {
    id: number;
    amount: number;
    description: string;
    date: string;
    userId: string;
    categoryId: number | null;
    categoryName: string | null;
};

export type ExpenseInput = {
    amount: number;
    description: string;
    date: string;
    categoryId?: number;
};

export type DateRange = {
    from: Date;
    to: Date;
};
