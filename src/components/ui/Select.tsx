import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function Select({
                   className = "",
                   ...props
               }: SelectProps) {
    return (
        <select
            {...props}
            className={`w-full border border-border bg-surface px-3 py-3 text-sm text-text-primary outline-none disabled:cursor-not-allowed ${className}`}
        />
    );
}

export default Select;