export type Expense = {
    id: number;
    amount: number;
    description: string;
    date: string;
    userId: string;
    categoryId: number | null;
    categoryName: string | null;
};