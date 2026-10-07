type ExpenseHeaderProps = {
    onAddExpense?: () => void;
};

function ExpenseHeader({onAddExpense}: ExpenseHeaderProps) {
    return (
        <header className="mb-10 flex items-start justify-between gap-6">
            <div className="max-w-2xl">
                <p className="text-sm font-medium text-text-secondary">
                    Expenses
                </p>

                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text-primary">
                    Keep track of where your money goes.
                </h1>

                <p className="mt-3 text-base text-text-secondary">
                    Record your spending and keep your financial
                    activity organized in one place.
                </p>
            </div>

            {onAddExpense && (
                <button
                    type="button"
                    onClick={onAddExpense}
                    className="hidden shrink-0 bg-accent px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-hover sm:block"
                >
                    Add expense
                    <span
                        aria-hidden="true"
                        className="ml-2"
                    >
                        +
                    </span>
                </button>
            )}
        </header>
    );
}

export default ExpenseHeader;