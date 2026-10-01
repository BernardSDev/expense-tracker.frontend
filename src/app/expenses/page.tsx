"use client";

import React, { useState } from "react";
import {apiRequest, refreshAccessToken} from "@/lib/api";

type Expense = {
    id: number;
    amount: number;
    description: string;
    date: string;
    userId: string;
};

export default function ExpensesPage() {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const [expenses, setExpenses] = useState<Expense[]>([]);

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const response = await apiRequest(
            "http://localhost:5077/api/Expenses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    description,
                    date,
                }),
            }
        );

        const data = await response.json();

        setExpenses((currentExpenses) => [
            ...currentExpenses,
            data,
        ]);
    }

    async function getExpenses() {
        const response = await apiRequest("http://localhost:5077/api/Expenses");

        console.log("Status:", response.status);
        console.log("OK:", response.ok);

        const data = await response.json();

        setExpenses(data.expenses);

        console.log(data);
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="mt-8 w-full max-w-sm space-y-3">
                <h2 className="text-xl font-bold">My Expenses</h2>

                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="border p-3"
                    >
                        <p>{expense.description}</p>
                        <p>GH₵{expense.amount}</p>
                        <p>{expense.date}</p>
                    </div>
                ))}
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold">Create Expense</h1>

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="w-full border p-2"
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    className="w-full border p-2"
                />

                <input
                    type="datetime-local"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full border p-2"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white p-2"
                >
                    Create Expense
                </button>

                <button
                    type="button"
                    onClick={getExpenses}
                    className="w-full bg-blue-600 text-white p-2"
                >
                    Get Expenses
                </button>
            </form>
        </main>
    );
}