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
import AuthNavbar from "@/components/navigation/AuthNavbar";
import Modal from "@/components/ui/Modal";
import EditExpenseForm from "@/components/expenses/EditExpenseForm";
import {toast} from "sonner";
import Button from "@/components/ui/Button";

export default function ExpensesPage() {
    const {
        data: expenses = [],
        isLoading,
        error,
        refetch,
    } = useExpensesQuery();

    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    const deleteExpenseMutation = useDeleteExpenseMutation();

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
                    toast.success("Expense deleted successfully.");
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
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <ExpenseHeader />

                        <ExpenseSummary
                            expenses={expenses}
                            isLoading={isLoading}
                        />

                        <ExpenseList
                            expenses={expenses}
                            isLoading={isLoading}
                            error={error}
                            onRetry={refetch}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        <div className="mt-8">
                            <AddExpenseForm />
                        </div>

                        <Modal
                            isOpen={selectedExpense !== null}
                            title="Edit expense"
                            description={
                                selectedExpense
                                    ? `Editing "${selectedExpense.description}"`
                                    : undefined
                            }
                            onClose={() => setSelectedExpense(null)}
                        >
                            {selectedExpense && (
                                <EditExpenseForm
                                    expense={selectedExpense}
                                    onCancel={() => setSelectedExpense(null)}
                                />
                            )}
                        </Modal>

                        <Modal
                            isOpen={expenseToDelete !== null}
                            title="Delete expense"
                            description={
                                expenseToDelete
                                    ? `Are you sure you want to delete "${expenseToDelete.description}"? This action cannot be undone.`
                                    : undefined
                            }
                            onClose={() => {
                                if (!deleteExpenseMutation.isPending) {
                                    setExpenseToDelete(null);
                                }
                            }}
                        >
                            <div className="space-y-6">
                                <p className="text-sm leading-6 text-text-secondary">
                                    This expense will be permanently removed from your
                                    expense history.
                                </p>

                                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => setExpenseToDelete(null)}
                                        disabled={deleteExpenseMutation.isPending}
                                        className="bg-surface text-text-primary hover:bg-surface-muted"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={deleteExpenseMutation.isPending}
                                        className="bg-red-600 text-white hover:bg-red-700"
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