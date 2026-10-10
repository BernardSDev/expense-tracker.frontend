import { addMonths, isSameMonth, startOfMonth } from "@/utils/expenses";

type MonthPickerProps = {
    month: Date;
    onChange: (month: Date) => void;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
        </svg>
    );
}

const ARROW_CLASS =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface";

export default function MonthPicker({ month, onChange }: MonthPickerProps) {
    const currentMonth = startOfMonth(new Date());
    const isCurrentMonth = isSameMonth(month, currentMonth);

    const label = month.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                aria-label="Previous month"
                onClick={() => onChange(addMonths(month, -1))}
                className={ARROW_CLASS}
            >
                <ChevronIcon direction="left" />
            </button>

            <span
                aria-live="polite"
                className="min-w-[120px] text-center text-[13px] font-semibold text-text-primary"
            >
                {label}
            </span>

            <button
                type="button"
                aria-label="Next month"
                onClick={() => onChange(addMonths(month, 1))}
                disabled={isCurrentMonth}
                className={ARROW_CLASS}
            >
                <ChevronIcon direction="right" />
            </button>

            {!isCurrentMonth && (
                <button
                    type="button"
                    onClick={() => onChange(currentMonth)}
                    className="ml-1 h-8 rounded-lg px-2.5 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                >
                    This month
                </button>
            )}
        </div>
    );
}
