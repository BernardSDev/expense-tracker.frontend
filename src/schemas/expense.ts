import { z } from "zod";

export const expenseSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (value) => Number(value) >= 0.01,
            "Amount must be greater than 0"
        )
        .refine(
            (value) => Number(value) <= 10_000_000,
            "Amount is too large"
        ),

    description: z
        .string()
        .min(1, "Description is required")
        .max(250, "Description cannot exceed 250 characters"),

    date: z
        .string()
        .min(1, "Date is required"),

    categoryId: z
        .string()
        .optional(),
});

export type ExpenseFormData = z.infer<
    typeof expenseSchema
>;