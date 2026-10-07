import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-dark text-text-on-dark hover:bg-dark-surface",
    secondary:
        "border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-muted",
    danger:
        "bg-red-600 text-white hover:bg-red-700",
};

function Button({
                   variant = "primary",
                   className = "",
                   ...props
               }: ButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
        />
    );
}

export default Button;
