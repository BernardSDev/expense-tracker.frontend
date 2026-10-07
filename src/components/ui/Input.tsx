import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({
                   className = "",
                   ...props}: InputProps) {
    return (
        <input
            {...props}
            className={`h-11 w-full rounded-[10px] border border-border bg-surface px-3.5 text-sm text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-secondary hover:border-border-strong focus:border-dark focus:ring-4 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-surface-muted aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-100 ${className}`}
        />
    );
}

export default Input;
