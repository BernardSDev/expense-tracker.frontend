type FormFieldProps = {
    label: string;
    htmlFor: string;
    description?: string;
    error?: string;
    optional?: boolean;
    hint?: React.ReactNode;
    children: React.ReactNode;
};

function FormField({
                      label,
                      htmlFor,
                      description,
                      error,
                      optional,
                      hint,
                      children,
                  }: FormFieldProps) {
    const messageId = `${htmlFor}-message`;

    return (
        <div>
            <div className="flex items-baseline justify-between gap-3">
                <label
                    htmlFor={htmlFor}
                    className="block text-[13px] font-medium text-text-primary"
                >
                    {label}

                    {optional && (
                        <span className="ml-1.5 font-normal text-text-secondary">
                            (optional)
                        </span>
                    )}
                </label>

                {hint && (
                    <span className="text-xs text-text-secondary">
                        {hint}
                    </span>
                )}
            </div>

            <div className="mt-1.5">
                {children}
            </div>

            {error ? (
                <p
                    id={messageId}
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 shrink-0"
                        fill="currentColor"
                    >
                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.75 4.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM10 14.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>
                    {error}
                </p>
            ) : description ? (
                <p
                    id={messageId}
                    className="mt-1.5 text-xs text-text-secondary"
                >
                    {description}
                </p>
            ) : null}
        </div>
    );
}

export default FormField;
