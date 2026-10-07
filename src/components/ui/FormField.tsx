type FormFieldProps = {
    label: string;
    htmlFor: string;
    description?: string;
    error?: string;
    children: React.ReactNode;
};

function FormField({
                      label,
                      htmlFor,
                      description,
                      error,
                      children,
                  }: FormFieldProps) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="block text-sm font-medium text-text-primary"
            >
                {label}
            </label>

            <div className="mt-2">
                {children}
            </div>

            {error ? (
                <p className="mt-2 text-xs text-red-600">
                    {error}
                </p>
            ) : description ? (
                <p className="mt-2 text-xs text-text-muted">
                    {description}
                </p>
            ) : null}
        </div>
    );
}

export default FormField;