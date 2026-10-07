"use client";

import type { FormEvent } from "react";

type AddExpenseFormProps = {
    amount: string;
    description: string;
    date: string;
    time: string;
    isSubmitting: boolean;
    error: string;
    success: string;
    onAmountChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onTimeChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AddExpenseForm({
                                           amount,
                                           description,
                                           date,
                                           time,
                                           isSubmitting,
                                           error,
                                           success,
                                           onAmountChange,
                                           onDescriptionChange,
                                           onDateChange,
                                           onTimeChange,
                                           onSubmit,
                                       }: AddExpenseFormProps) {
    return (
        <section className="order-1 h-fit border border-border bg-surface lg:order-2">
            <div className="border-b border-border px-6 py-6 sm:px-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                            New expense
                        </p>

                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-text-primary">
                            Add expense
                        </h2>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                            Record something you spent money on.
                        </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent text-lg font-medium text-text-primary">
                        +
                    </div>
                </div>
            </div>

            <form
                onSubmit={onSubmit}
                className="space-y-6 p-6 sm:p-7"
            >
                {/* Amount */}
                <div>
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium text-text-primary"
                    >
                        Amount
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                            GH₵
                        </span>

                        <input
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(event) =>
                                onAmountChange(event.target.value)
                            }
                            className="h-13 w-full border border-border-strong bg-surface pl-14 pr-4 text-lg font-medium text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-text-primary"
                    >
                        Description
                    </label>

                    <input
                        id="description"
                        type="text"
                        placeholder="What did you spend on?"
                        value={description}
                        onChange={(event) =>
                            onDescriptionChange(event.target.value)
                        }
                        className="h-12 w-full border border-border-strong bg-surface px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                    />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label
                            htmlFor="date"
                            className="mb-2 block text-sm font-medium text-text-primary"
                        >
                            Date
                        </label>

                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(event) =>
                                onDateChange(event.target.value)
                            }
                            className="h-12 w-full border border-border-strong bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="time"
                            className="mb-2 block text-sm font-medium text-text-primary"
                        >
                            Time
                        </label>

                        <input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(event) =>
                                onTimeChange(event.target.value)
                            }
                            className="h-12 w-full border border-border-strong bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                        />
                    </div>
                </div>

                {/* Feedback */}
                {error && (
                    <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
                        <span className="mt-0.5 text-sm text-red-600">
                            !
                        </span>

                        <p className="text-sm leading-5 text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {success && (
                    <div className="flex items-start gap-3 border border-green-200 bg-green-50 px-4 py-3">
                        <span className="mt-0.5 text-sm text-green-600">
                            ✓
                        </span>

                        <p className="text-sm leading-5 text-green-700">
                            {success}
                        </p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-text-primary transition ${
                        isSubmitting
                            ? "cursor-not-allowed bg-neutral-300"
                            : "bg-accent hover:bg-accent-hover"
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-primary/30 border-t-text-primary" />
                            Adding expense...
                        </>
                    ) : (
                        <>
                            Add expense

                            <span
                                aria-hidden="true"
                                className="text-base"
                            >
                                →
                            </span>
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-text-muted">
                    Your expense will be added to your activity.
                </p>
            </form>
        </section>
    );
}