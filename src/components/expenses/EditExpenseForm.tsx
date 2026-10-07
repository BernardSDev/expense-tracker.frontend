"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {expenseSchema, type ExpenseFormData} from "@/schemas/expense";
import {useUpdateExpenseMutation} from "@/mutations/expenses";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import { useCategoriesQuery } from "@/queries/categories";
import { Expense } from "@/types/expense";

type EditExpenseFormProps = {
    expense: Expense;
    onCancel: () => void;
};

export default function EditExpenseForm({
                                            expense,
                                            onCancel,
                                        }: EditExpenseFormProps) {
    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useCategoriesQuery();

    const updateExpenseMutation = useUpdateExpenseMutation();

    const form = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: String(expense.amount),
            description: expense.description,
            date: expense.date.slice(0, 16),
            categoryId: expense.categoryId !== null
                    ? String(expense.categoryId)
                    : "",
        },
    });

    function onSubmit(data: ExpenseFormData) {
        updateExpenseMutation.mutate(
            {
                id: expense.id,
                data: {
                    amount: Number(data.amount),
                    description: data.description,
                    date: new Date(
                        data.date
                    ).toISOString(),
                    ...(data.categoryId
                        ? {
                            categoryId: Number(
                                data.categoryId
                            ),
                        }
                        : {}),
                },
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Expense updated successfully."
                    );

                    onCancel();
                },
                onError: () => {
                    toast.error(
                        "We couldn't update the expense. Please try again."
                    );
                },
            }
        );
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="Amount"
                    htmlFor="edit-amount"
                    error={
                        form.formState.errors.amount?.message
                    }
                >
                    <div className="flex border border-border bg-surface focus-within:border-border-strong">
                        <span className="flex items-center border-r border-border px-3 text-sm text-text-secondary">
                            GH₵
                        </span>

                        <Input
                            id="edit-amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            {...form.register("amount")}
                            className="border-0 focus:border-0"
                        />
                    </div>
                </FormField>

                <FormField
                    label="Date"
                    htmlFor="edit-date"
                    error={
                        form.formState.errors.date?.message
                    }
                >
                    <Input
                        id="edit-date"
                        type="datetime-local"
                        {...form.register("date")}
                    />
                </FormField>
            </div>

            <FormField
                label="Description"
                htmlFor="edit-description"
                error={
                    form.formState.errors.description?.message
                }
            >
                <Input
                    id="edit-description"
                    type="text"
                    maxLength={250}
                    placeholder="e.g. Lunch at work"
                    {...form.register("description")}
                />
            </FormField>

            <FormField
                label="Category"
                htmlFor="edit-category"
                description="Category is optional."
            >
                <Select
                    id="edit-category"
                    {...form.register("categoryId")}
                    disabled={
                        isCategoriesLoading ||
                        !!categoriesError
                    }
                >
                    <option value="">
                        {isCategoriesLoading
                            ? "Loading categories..."
                            : categoriesError
                                ? "Unable to load categories"
                                : "Select a category"}
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </Select>
            </FormField>

            <div className="flex justify-end gap-3 border-t border-border pt-6">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="bg-surface text-text-primary hover:bg-surface-muted"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={updateExpenseMutation.isPending}
                >
                    {updateExpenseMutation.isPending
                        ? "Saving..."
                        : "Save changes"}
                </Button>
            </div>
        </form>
    );
}