"use client";

import { useForm, useWatch } from "react-hook-form";
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
import { getCurrentDate, getCurrentTime } from "@/utils/expenses";

type AddExpenseFormProps = {
    onCancel: () => void;
    onSuccess?: () => void;
};

export default function AddExpenseForm({
                                           onCancel,
                                           onSuccess,
                                       }: AddExpenseFormProps) {
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
            date: `${getCurrentDate()}T${getCurrentTime()}`,
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
                    onSuccess?.();
                },
                onError: () => {
                    toast.error(
                        "We couldn't add the expense. Please try again."
                    );
                },
            }
        );
    }

    const errors = form.formState.errors;
    const description = useWatch({ control: form.control, name: "description" });
    const descriptionLength = description?.length ?? 0;
    const isPending = createExpenseMutation.isPending;

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
        >
            <FormField
                label="Amount"
                htmlFor="amount"
                error={errors.amount?.message}
            >
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-medium text-text-secondary">
                        GH₵
                    </span>

                    <Input
                        id="amount"
                        type="number"
                        inputMode="decimal"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        autoFocus
                        aria-invalid={!!errors.amount}
                        aria-describedby={errors.amount ? "amount-message" : undefined}
                        {...form.register("amount")}
                        className="tabular h-14 pl-[3.75rem] text-2xl font-semibold tracking-[-0.02em] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>
            </FormField>

            <FormField
                label="Description"
                htmlFor="description"
                error={errors.description?.message}
                hint={`${descriptionLength}/250`}
            >
                <Input
                    id="description"
                    type="text"
                    maxLength={250}
                    placeholder="e.g. Lunch at work"
                    autoComplete="off"
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? "description-message" : undefined}
                    {...form.register("description")}
                />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                <FormField
                    label="Date and time"
                    htmlFor="date"
                    error={errors.date?.message}
                >
                    <Input
                        id="date"
                        type="datetime-local"
                        aria-invalid={!!errors.date}
                        aria-describedby={errors.date ? "date-message" : undefined}
                        {...form.register("date")}
                    />
                </FormField>

                <FormField
                    label="Category"
                    htmlFor="category"
                    optional
                    description={
                        categoriesError
                            ? "Categories couldn't be loaded."
                            : undefined
                    }
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
                                    ? "Unavailable"
                                    : "No category"}
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
            </div>

            <div className="-mx-5 flex flex-col-reverse gap-2.5 border-t border-surface-muted px-5 pt-5 sm:-mx-6 sm:flex-row sm:justify-end sm:px-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="sm:min-w-[140px]"
                >
                    {isPending ? (
                        <>
                            <span
                                aria-hidden="true"
                                className="h-4 w-4 animate-spin rounded-full border-2 border-text-on-dark/30 border-t-text-on-dark"
                            />
                            Adding...
                        </>
                    ) : (
                        <>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="h-4 w-4 text-accent"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add expense
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
