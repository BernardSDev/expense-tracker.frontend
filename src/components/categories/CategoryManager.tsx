"use client";

import { useState } from "react";

import {
    useCategoriesQuery,
} from "@/queries/categories";

import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "@/mutations/categories";

import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import { getCategoryStyles } from "@/components/expenses/categoryStyles";

type CategoryManagerProps = {
    onClose?: () => void;
};

type Category = {
    id: number;
    name: string;
};

export default function CategoryManager({
                                            onClose,
                                        }: CategoryManagerProps) {
    const [name, setName] = useState("");

    const [editingCategoryId, setEditingCategoryId] =
        useState<number | null>(null);

    const [deletingCategoryId, setDeletingCategoryId] =
        useState<number | null>(null);

    const [categoryToDelete, setCategoryToDelete] =
        useState<Category | null>(null);

    const [error, setError] = useState("");

    const {
        data: categories = [],
        isLoading,
        isError,
    } = useCategoriesQuery();

    const createCategoryMutation =
        useCreateCategoryMutation();

    const updateCategoryMutation =
        useUpdateCategoryMutation();

    const deleteCategoryMutation =
        useDeleteCategoryMutation();

    const isSubmitting =
        createCategoryMutation.isPending ||
        updateCategoryMutation.isPending;

    function resetForm() {
        setName("");
        setEditingCategoryId(null);
        setError("");
    }

    function handleEdit(category: Category) {
        setEditingCategoryId(category.id);
        setName(category.name);
        setError("");
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Category name is required.");
            return;
        }

        setError("");

        try {
            if (editingCategoryId !== null) {
                const response =
                    await updateCategoryMutation.mutateAsync(
                        {
                            id: editingCategoryId,
                            data: {
                                name: trimmedName,
                            },
                        }
                    );

                if (!response.ok) {
                    const data = await response
                        .json()
                        .catch(() => null);

                    throw new Error(
                        data?.details ||
                        data?.message ||
                        "Failed to update category."
                    );
                }
            } else {
                const response =
                    await createCategoryMutation.mutateAsync(
                        {
                            name: trimmedName,
                        }
                    );

                if (!response.ok) {
                    const data = await response
                        .json()
                        .catch(() => null);

                    throw new Error(
                        data?.details ||
                        data?.message ||
                        "Failed to create category."
                    );
                }
            }

            resetForm();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        }
    }

    function handleDelete(category: Category) {
        setError("");
        setCategoryToDelete(category);
    }

    async function confirmDeleteCategory() {
        if (!categoryToDelete) {
            return;
        }

        const categoryId = categoryToDelete.id;

        setError("");
        setDeletingCategoryId(categoryId);

        try {
            const response =
                await deleteCategoryMutation.mutateAsync(
                    categoryId
                );

            if (!response.ok) {
                const data = await response
                    .json()
                    .catch(() => null);

                throw new Error(
                    data?.details ||
                    data?.message ||
                    "Failed to delete category."
                );
            }

            if (editingCategoryId === categoryId) {
                resetForm();
            }

            setCategoryToDelete(null);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setDeletingCategoryId(null);
        }
    }

    const isEditing = editingCategoryId !== null;
    const isBusy = isSubmitting || deletingCategoryId !== null;

    return (
        <div className="space-y-6">
            {/* Category form */}
            <form
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="flex items-baseline justify-between gap-3">
                    <label
                        htmlFor="category-name"
                        className="block text-[13px] font-medium text-text-primary"
                    >
                        {isEditing ? "Rename category" : "New category"}
                    </label>

                    <span className="text-xs text-text-secondary">
                        {name.length}/100
                    </span>
                </div>

                <div className="mt-1.5 flex gap-2">
                    <Input
                        id="category-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="e.g. Transport"
                        maxLength={100}
                        autoComplete="off"
                        disabled={isSubmitting}
                        aria-invalid={!!error && !categoryToDelete}
                        className="min-w-0 flex-1"
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting || !name.trim()}
                        className="shrink-0 px-4"
                    >
                        {isSubmitting ? (
                            <span
                                aria-hidden="true"
                                className="h-4 w-4 animate-spin rounded-full border-2 border-text-on-dark/30 border-t-text-on-dark"
                            />
                        ) : !isEditing ? (
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
                        ) : null}

                        {isSubmitting
                            ? "Saving"
                            : isEditing
                                ? "Save"
                                : "Add"}
                    </Button>
                </div>

                {isEditing && (
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-[10px] bg-surface-muted px-3 py-2 motion-safe:animate-pop-in">
                        <p className="min-w-0 truncate text-[13px] text-text-secondary">
                            Renaming{" "}
                            <span className="font-medium text-text-primary">
                                {categories.find((category) => category.id === editingCategoryId)?.name}
                            </span>
                        </p>

                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={isSubmitting}
                            className="h-8 shrink-0 rounded-lg px-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {error && !categoryToDelete && (
                    <p
                        role="alert"
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-negative"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5 shrink-0"
                            fill="currentColor"
                        >
                            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.75 4.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM10 14.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                        </svg>
                        {error}
                    </p>
                )}
            </form>

            {/* Categories */}
            <div>
                <div className="mb-2 flex items-center justify-between px-1">
                    <h3 className="text-[13px] font-semibold text-text-primary">
                        Your categories
                    </h3>

                    {!isLoading && !isError && (
                        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
                            {categories.length}
                        </span>
                    )}
                </div>

                {isLoading && (
                    <div className="divide-y divide-surface-muted overflow-hidden rounded-2xl border border-border">
                        {[0, 1, 2].map((item) => (
                            <div
                                key={item}
                                className="shimmer flex items-center gap-3 px-3.5 py-3"
                            >
                                <div className="h-9 w-9 rounded-[10px] bg-surface-muted" />
                                <div className="h-4 w-28 rounded bg-surface-muted" />
                            </div>
                        ))}
                    </div>
                )}

                {isError && !isLoading && (
                    <div
                        role="alert"
                        className="rounded-xl border border-negative/20 bg-negative-soft px-4 py-3 text-sm text-negative"
                    >
                        We couldn&apos;t load your categories.
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    categories.length === 0 && (
                        <EmptyState
                            icon="pie"
                            title="No categories yet"
                            description="Add one above, like Groceries or Transport, to start organising your expenses."
                        />
                    )}

                {!isLoading &&
                    !isError &&
                    categories.length > 0 && (
                        <ul className="divide-y divide-surface-muted overflow-hidden rounded-2xl border border-border">
                            {categories.map((category) => {
                                const styles = getCategoryStyles(category.name, category.id);
                                const isBeingEdited = editingCategoryId === category.id;
                                const isConfirmingDelete = categoryToDelete?.id === category.id;
                                const isDeleting = deletingCategoryId === category.id;

                                if (isConfirmingDelete) {
                                    return (
                                        <li
                                            key={category.id}
                                            className="bg-negative-soft/60 px-3.5 py-3.5 motion-safe:animate-pop-in"
                                        >
                                            <p className="text-sm font-medium text-text-primary">
                                                Delete &ldquo;{category.name}&rdquo;?
                                            </p>

                                            <p className="mt-0.5 text-[13px] leading-5 text-text-secondary">
                                                Categories used by an expense can&apos;t be deleted.
                                            </p>

                                            {error && (
                                                <p
                                                    role="alert"
                                                    className="mt-2 text-xs font-medium text-negative"
                                                >
                                                    {error}
                                                </p>
                                            )}

                                            <div className="mt-3 flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setCategoryToDelete(null);
                                                        setError("");
                                                    }}
                                                    disabled={isDeleting}
                                                    className="h-10 flex-1 sm:flex-none"
                                                >
                                                    Cancel
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    onClick={confirmDeleteCategory}
                                                    disabled={isDeleting}
                                                    className="h-10 flex-1 sm:flex-none"
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li
                                        key={category.id}
                                        className={`flex items-center gap-3 py-2 pl-3.5 pr-1.5 transition-colors ${
                                            isBeingEdited ? "bg-surface-muted" : ""
                                        }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-semibold ${styles.background} ${styles.color}`}
                                        >
                                            {category.name.charAt(0).toUpperCase()}
                                        </span>

                                        <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-text-primary">
                                            {category.name}
                                        </span>

                                        <div className="flex shrink-0 items-center">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(category)}
                                                disabled={isBusy}
                                                aria-label={`Rename ${category.name}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 24 24"
                                                    className="h-[18px] w-[18px]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
                                                    <path d="M13.5 6.5l3 3" />
                                                </svg>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(category)}
                                                disabled={isBusy}
                                                aria-label={`Delete ${category.name}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-negative-soft hover:text-negative disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 24 24"
                                                    className="h-[18px] w-[18px]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            </div>

            {onClose && (
                <div className="-mx-5 flex border-t border-surface-muted px-5 pt-5 sm:-mx-6 sm:justify-end sm:px-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Done
                    </Button>
                </div>
            )}
        </div>
    );
}