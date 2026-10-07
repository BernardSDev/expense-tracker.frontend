import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({
                   className = "",
                   ...props}: InputProps) {
    return (
        <input
            {...props}
            className={`w-full border bg-surface px-3 py-3 text-sm text-text-primary outline-none focus:border-border-strong disabled:cursor-not-allowed ${className}`}
        />
    );
}

export default Input;