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

import Modal from "@/components/ui/Modal";

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

    return (
        <div className="space-y-6">
            {/* Category form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label
                        htmlFor="category-name"
                        className="block text-sm font-medium text-text-primary"
                    >
                        {editingCategoryId !== null
                            ? "Edit category"
                            : "Category name"}
                    </label>

                    <div className="mt-2 flex gap-3">
                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Transport"
                            maxLength={100}
                            disabled={isSubmitting}
                            className="min-w-0 flex-1 border border-border bg-surface px-3 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-strong disabled:cursor-not-allowed disabled:bg-surface-muted"
                        />

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !name.trim()
                            }
                            className="shrink-0 bg-dark px-5 py-3 text-sm font-semibold text-text-on-dark transition-colors hover:bg-dark-surface disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : editingCategoryId !== null
                                    ? "Save"
                                    : "Add"}
                        </button>
                    </div>

                    {editingCategoryId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={isSubmitting}
                            className="mt-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed"
                        >
                            Cancel editing
                        </button>
                    )}
                </div>

                {error && !categoryToDelete && (
                    <div
                        role="alert"
                        className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {error}
                    </div>
                )}
            </form>

            {/* Categories */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">
                        Your categories
                    </h3>

                    <span className="text-sm text-text-secondary">
                        {categories.length}
                    </span>
                </div>

                {isLoading && (
                    <div className="space-y-2">
                        <div className="h-12 animate-pulse bg-surface-muted" />
                        <div className="h-12 animate-pulse bg-surface-muted" />
                        <div className="h-12 animate-pulse bg-surface-muted" />
                    </div>
                )}

                {isError && !isLoading && (
                    <div
                        role="alert"
                        className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        Failed to load categories.
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    categories.length === 0 && (
                        <div className="border border-dashed border-border px-5 py-8 text-center">
                            <p className="text-sm font-medium text-text-primary">
                                No categories yet
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                                Create your first category
                                above.
                            </p>
                        </div>
                    )}

                {!isLoading &&
                    !isError &&
                    categories.length > 0 && (
                        <div className="divide-y divide-border overflow-hidden border border-border">
                            {categories.map(
                                (category) => (
                                    <div
                                        key={
                                            category.id
                                        }
                                        className="flex items-center justify-between gap-4 px-4 py-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-category-1" />

                                            <span className="truncate text-sm font-medium text-text-primary">
                                                {
                                                    category.name
                                                }
                                            </span>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        category
                                                    )
                                                }
                                                disabled={
                                                    isSubmitting ||
                                                    deletingCategoryId !==
                                                    null
                                                }
                                                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        category
                                                    )
                                                }
                                                disabled={
                                                    isSubmitting ||
                                                    deletingCategoryId !==
                                                    null
                                                }
                                                className="text-sm font-medium text-red-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingCategoryId ===
                                                category.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
            </div>

            {/* Category delete confirmation */}
            <Modal
                isOpen={categoryToDelete !== null}
                title="Delete category"
                description={
                    categoryToDelete
                        ? `Are you sure you want to delete "${categoryToDelete.name}"?`
                        : undefined
                }
                onClose={() => {
                    if (
                        deletingCategoryId === null
                    ) {
                        setCategoryToDelete(null);
                    }
                }}
            >
                <div className="space-y-6">
                    <div className="rounded-xl bg-surface-muted px-4 py-4">
                        <p className="text-sm leading-6 text-text-secondary">
                            This category will be removed
                            from your categories. If it is
                            being used by an existing expense,
                            it cannot be deleted.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                setCategoryToDelete(
                                    null
                                )
                            }
                            disabled={
                                deletingCategoryId !==
                                null
                            }
                            className="border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={
                                confirmDeleteCategory
                            }
                            disabled={
                                deletingCategoryId !==
                                null
                            }
                            className="bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deletingCategoryId !== null
                                ? "Deleting..."
                                : "Delete category"}
                        </button>
                    </div>
                </div>
            </Modal>

            {onClose && (
                <div className="flex justify-end border-t border-border pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-muted"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
}