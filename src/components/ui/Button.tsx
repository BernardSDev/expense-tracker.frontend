import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
                   className = "",
                   ...props
               }: ButtonProps) {
    return (
        <button
            {...props}
            className={`bg-accent px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
    );
}

export default Button;