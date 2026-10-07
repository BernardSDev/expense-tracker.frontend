"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthNavbar from "@/components/AuthNavbar";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";

import { useExpensesQuery } from "@/queries/expenses";

export default function ExpensesPage() {
    const {
        data: expenses = [],
        isLoading,
        error,
        refetch,
    } = useExpensesQuery();

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
                        />
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}