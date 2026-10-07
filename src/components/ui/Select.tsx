import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function Select({
                   className = "",
                   ...props
               }: SelectProps) {
    return (
        <div className="relative">
            <select
                {...props}
                className={`h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-3.5 pr-10 text-sm text-text-primary outline-none transition-[border-color,box-shadow] hover:border-border-strong focus:border-dark focus:ring-4 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-secondary ${className}`}
            />

            <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m5 7.5 5 5 5-5" />
            </svg>
        </div>
    );
}

export default Select;
