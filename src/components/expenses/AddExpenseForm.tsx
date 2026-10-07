"use client";

import {useState} from "react";

import {toast} from "sonner";

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

    const createExpenseMutation = useCreateExpenseMutation();

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        createExpenseMutation.mutate(
            {
                amount: Number(amount),
                description,
                date: new Date(date).toISOString(),
                ...(categoryId
                    ? { categoryId: Number(categoryId) }
                    : {}),
            },
            {
                onSuccess: () => {
                    toast.success("Expense added successfully.");
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
                onSubmit={handleSubmit}
                className="space-y-6 px-6 py-6"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                        label="Amount"
                        htmlFor="amount"
                    >
                        <div className="flex border border-border bg-surface">
                            <span className="flex items-center border-r border-border px-3 text-sm text-text-secondary">
                                GH₵
                            </span>

                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                                className="focus:border-0"
                            />
                        </div>
                    </FormField>

                    <FormField
                        label="Date"
                        htmlFor="date"
                    >
                        <Input
                            id="date"
                            name="date"
                            type="datetime-local"
                            value={date}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                        />
                    </FormField>
                </div>

                <FormField
                    label="Description"
                    htmlFor="description"
                >
                    <Input
                        id="description"
                        name="description"
                        type="text"
                        maxLength={250}
                        placeholder="e.g. Lunch at work"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />
                </FormField>

                <FormField
                    label="Category"
                    htmlFor="category"
                    description="Category is optional."
                >
                    <Select
                        id="category"
                        name="categoryId"
                        value={categoryId}
                        onChange={(event) =>
                            setCategoryId(event.target.value)
                        }
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