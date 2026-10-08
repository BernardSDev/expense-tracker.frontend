type ExpenseHeaderProps = {
    onAddExpense?: () => void;
    onManageCategories?: () => void;
};

function ExpenseHeader({
                           onAddExpense,
                           onManageCategories,
                       }: ExpenseHeaderProps) {
    const monthLabel = new Date().toLocaleDateString(
        "en-GB",
        {
            month: "long",
            year: "numeric",
        }
    );

    return (
        <header className="mb-[18px] flex items-end justify-between gap-4 sm:mb-6">
            <div className="min-w-0">
                <p className="text-[13px] font-medium text-text-secondary">
                    {monthLabel}
                </p>

                <h1 className="mt-0.5 text-[26px] font-semibold tracking-[-0.02em] text-text-primary sm:mt-1 sm:text-[30px]">
                    Expenses
                </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {onManageCategories && (
                    <button
                        type="button"
                        onClick={onManageCategories}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted sm:px-4"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-text-secondary"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.2 7.2a1 1 0 0 1 0 1.4l-8.1 8.1a1 1 0 0 1-1.4 0l-7.2-7.2a1 1 0 0 1-.3-.7z" />
                            <circle cx="8" cy="8" r="1.4" />
                        </svg>

                        <span className="sm:hidden">Categories</span>
                        <span className="hidden sm:inline">Manage categories</span>
                    </button>
                )}

                {onAddExpense && (
                    <button
                        type="button"
                        onClick={onAddExpense}
                        className="hidden h-10 items-center gap-2 rounded-xl bg-dark px-4 text-sm font-semibold text-text-on-dark transition-colors hover:bg-dark-surface sm:inline-flex"
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
            </div>
        </header>
    );
}

export default ExpenseHeader;