type ExpenseHeaderProps = {
    onAddExpense?: () => void;
};

function ExpenseHeader({onAddExpense}: ExpenseHeaderProps) {
    const monthLabel = new Date().toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });

    return (
        <header className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
            <div className="min-w-0">
                <p className="text-sm font-medium text-text-secondary">
                    {monthLabel}
                </p>

                <h1 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.03em] text-text-primary sm:text-3xl">
                    Expenses
                </h1>

                <p className="mt-1 hidden text-sm text-text-secondary sm:block">
                    Record your spending and keep your financial
                    activity organized in one place.
                </p>
            </div>

            {onAddExpense && (
                <button
                    type="button"
                    onClick={onAddExpense}
                    className="hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-dark px-4 text-sm font-semibold text-text-on-dark transition-colors hover:bg-dark-surface sm:inline-flex"
                >
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
                </button>
            )}
        </header>
    );
}

export default ExpenseHeader;
