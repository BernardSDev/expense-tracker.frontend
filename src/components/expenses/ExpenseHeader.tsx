import PageHeader from "@/components/ui/PageHeader";

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
        <PageHeader
            eyebrow={monthLabel}
            title="Expenses"
            description="Every expense you've recorded, grouped and searchable."
            actions={
                <>
                        {onManageCategories && (
                            <button
                                type="button"
                                onClick={onManageCategories}
                                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted sm:px-4"
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
                                className="hidden h-10 items-center gap-2 rounded-[10px] bg-dark px-4 text-sm font-semibold text-text-on-dark transition-[background-color,transform] duration-150 hover:bg-dark-surface active:scale-[0.98] lg:inline-flex"
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
                </>
            }
        />
    );
}

export default ExpenseHeader;