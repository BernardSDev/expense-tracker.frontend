"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    expenseSchema,
    type ExpenseFormData,
} from "@/schemas/expense";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import { useCreateExpenseMutation } from "@/mutations/expenses";
import { useCategoriesQuery } from "@/queries/categories";

export default function AddExpenseForm() {
    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useCategoriesQuery();

    const createExpenseMutation =
        useCreateExpenseMutation();

    const form = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: undefined,
            description: "",
            date: "",
            categoryId: "",
        },
    });

    function onSubmit(data: ExpenseFormData) {
        createExpenseMutation.mutate(
            {
                amount: Number(data.amount),
                description: data.description,
                date: new Date(data.date).toISOString(),
                ...(data.categoryId
                    ? {
                        categoryId: Number(data.categoryId),
                    }
                    : {}),
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Expense added successfully."
                    );

                    form.reset();
                },
                onError: () => {
                    toast.error(
                        "We couldn't add the expense. Please try again."
                    );
                },
            }
        );
    }

    return (
        <section className="border border-border bg-surface">
            <div className="border-b border-border px-6 py-5">
                <h2 className="text-base font-semibold text-text-primary">
                    Add expense
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                    Record a new expense and keep your spending organized.
                </p>
            </div>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-6 py-6"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                        label="Amount"
                        htmlFor="amount"
                        error={
                            form.formState.errors.amount
                                ?.message
                        }
                    >
                        <div className="flex border border-border bg-surface focus-within:border-border-strong">
                            <span className="flex items-center border-r border-border px-3 text-sm text-text-secondary">
                                GH₵
                            </span>

                            <Input
                                id="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                {...form.register("amount")}
                                className="focus:border-0"
                            />
                        </div>
                    </FormField>

                    <FormField
                        label="Date"
                        htmlFor="date"
                        error={
                            form.formState.errors.date
                                ?.message
                        }
                    >
                        <Input
                            id="date"
                            type="datetime-local"
                            {...form.register("date")}
                        />
                    </FormField>
                </div>

                <FormField
                    label="Description"
                    htmlFor="description"
                    error={
                        form.formState.errors.description
                            ?.message
                    }
                >
                    <Input
                        id="description"
                        type="text"
                        maxLength={250}
                        placeholder="e.g. Lunch at work"
                        {...form.register("description")}
                    />
                </FormField>

                <FormField
                    label="Category"
                    htmlFor="category"
                    description="Category is optional."
                >
                    <Select
                        id="category"
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

                <div className="flex justify-end border-t border-border pt-6">
                    <Button
                        type="submit"
                        disabled={
                            createExpenseMutation.isPending
                        }
                    >
                        {createExpenseMutation.isPending
                            ? "Adding..."
                            : "Add expense"}
                    </Button>
                </div>
            </form>
        </section>
    );
}