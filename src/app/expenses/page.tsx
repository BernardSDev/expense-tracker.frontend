"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";

import { Expense } from "@/types/expense";

import { useExpensesQuery } from "@/queries/expenses";
import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import AuthNavbar from "@/components/navigation/AuthNavbar";
import Modal from "@/components/ui/Modal";
import EditExpenseForm from "@/components/expenses/EditExpenseForm";

export default function ExpensesPage() {
    const {
        data: expenses = [],
        isLoading,
        error,
        refetch,
    } = useExpensesQuery();

    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    function handleEdit(expense: Expense) {
        setSelectedExpense(expense);
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
                        />

                        <div className="mt-8">
                            <AddExpenseForm />
                        </div>

                        <Modal
                            isOpen={selectedExpense !== null}
                            title="Edit expense"
                            description="Update the details of this expense."
                            onClose={() => setSelectedExpense(null)}
                        >
                            {selectedExpense && (
                                <EditExpenseForm
                                    expense={selectedExpense}
                                    onCancel={() => setSelectedExpense(null)}
                                />
                            )}
                        </Modal>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}