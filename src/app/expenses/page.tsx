"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";

import { Expense } from "@/types/expense";
import { useDeleteExpenseMutation } from "@/mutations/expenses";

import { useExpensesQuery } from "@/queries/expenses";

import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import EditExpenseForm from "@/components/expenses/EditExpenseForm";
import CategoryManager from "@/components/categories/CategoryManager";

import AuthNavbar from "@/components/navigation/AuthNavbar";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { toast } from "sonner";

export default function ExpensesPage() {
    const {
        data: expenses = [],
        isLoading,
        error,
        refetch,
    } = useExpensesQuery();

    const [isAddOpen, setIsAddOpen] =
        useState(false);

    const [isCategoryManagerOpen, setIsCategoryManagerOpen] =
        useState(false);

    const [selectedExpense, setSelectedExpense] =
        useState<Expense | null>(null);

    const [expenseToDelete, setExpenseToDelete] =
        useState<Expense | null>(null);

    const deleteExpenseMutation =
        useDeleteExpenseMutation();

    function handleAddExpense() {
        setIsAddOpen(true);
    }

    function handleManageCategories() {
        setIsCategoryManagerOpen(true);
    }

    function handleCloseCategoryManager() {
        setIsCategoryManagerOpen(false);
    }

    function handleEdit(expense: Expense) {
        setSelectedExpense(expense);
    }

    function handleDelete(expense: Expense) {
        setExpenseToDelete(expense);
    }

    function confirmDelete() {
        if (!expenseToDelete) {
            return;
        }

        deleteExpenseMutation.mutate(
            {
                id: expenseToDelete.id,
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Expense deleted successfully."
                    );

                    setExpenseToDelete(null);
                },

                onError: () => {
                    toast.error(
                        "We couldn't delete the expense. Please try again."
                    );
                },
            }
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <AuthNavbar />

                <main>
                    <div className="mx-auto max-w-7xl px-4 pb-44 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
                        <ExpenseHeader
                            onAddExpense={
                                handleAddExpense
                            }
                            onManageCategories={
                                handleManageCategories
                            }
                        />

                        <ExpenseSummary
                            expenses={expenses}
                            isLoading={isLoading}
                        />

                        <ExpenseList
                            expenses={expenses}
                            isLoading={isLoading}
                            error={error}
                            onRetry={refetch}
                            onAddExpense={
                                handleAddExpense
                            }
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        {/* Add expense */}
                        <Modal
                            isOpen={isAddOpen}
                            title="Add expense"
                            description="Record a new expense and keep your spending organized."
                            onClose={() =>
                                setIsAddOpen(false)
                            }
                        >
                            <AddExpenseForm
                                onCancel={() =>
                                    setIsAddOpen(false)
                                }
                                onSuccess={() =>
                                    setIsAddOpen(false)
                                }
                            />
                        </Modal>

                        {/* Manage categories */}
                        <Modal
                            isOpen={
                                isCategoryManagerOpen
                            }
                            title="Manage categories"
                            description="Create and manage the categories you use for your expenses."
                            onClose={
                                handleCloseCategoryManager
                            }
                        >
                            <CategoryManager
                                onClose={
                                    handleCloseCategoryManager
                                }
                            />
                        </Modal>

                        {/* Mobile floating add button */}
                        <button
                            type="button"
                            onClick={handleAddExpense}
                            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+1.25rem)] right-5 z-40 inline-flex h-[52px] items-center gap-2 rounded-2xl bg-dark pl-4 pr-5 text-[15px] font-semibold text-text-on-dark shadow-float transition-colors hover:bg-dark-surface sm:hidden"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="h-[18px] w-[18px] text-accent"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>

                            Add expense
                        </button>

                        {/* Edit expense */}
                        <Modal
                            isOpen={
                                selectedExpense !== null
                            }
                            title="Edit expense"
                            description={
                                selectedExpense
                                    ? `Editing "${selectedExpense.description}"`
                                    : undefined
                            }
                            onClose={() =>
                                setSelectedExpense(null)
                            }
                        >
                            {selectedExpense && (
                                <EditExpenseForm
                                    expense={
                                        selectedExpense
                                    }
                                    onCancel={() =>
                                        setSelectedExpense(
                                            null
                                        )
                                    }
                                />
                            )}
                        </Modal>

                        {/* Delete expense */}
                        <Modal
                            isOpen={
                                expenseToDelete !== null
                            }
                            title="Delete expense"
                            description={
                                expenseToDelete
                                    ? `Are you sure you want to delete "${expenseToDelete.description}"? This action cannot be undone.`
                                    : undefined
                            }
                            onClose={() => {
                                if (
                                    !deleteExpenseMutation.isPending
                                ) {
                                    setExpenseToDelete(
                                        null
                                    );
                                }
                            }}
                        >
                            <div className="space-y-6">
                                <p className="text-sm leading-6 text-text-secondary">
                                    This expense will be
                                    permanently removed from
                                    your expense history.
                                </p>

                                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setExpenseToDelete(
                                                null
                                            )
                                        }
                                        variant="secondary"
                                        disabled={
                                            deleteExpenseMutation.isPending
                                        }
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={
                                            confirmDelete
                                        }
                                        variant="danger"
                                        disabled={
                                            deleteExpenseMutation.isPending
                                        }
                                    >
                                        {deleteExpenseMutation.isPending
                                            ? "Deleting..."
                                            : "Delete expense"}
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}