import type { ReactNode } from "react";

type PageHeaderProps = {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
};

export default function PageHeader({
                                       eyebrow,
                                       title,
                                       description,
                                       actions,
                                   }: PageHeaderProps) {
    return (
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-[13px] font-medium text-text-secondary">
                        {eyebrow}
                    </p>
                )}

                <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.025em] text-text-primary sm:text-[30px]">
                    {title}
                </h1>

                {description && (
                    <p className="mt-1.5 max-w-xl text-sm leading-6 text-text-secondary">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
                    {actions}
                </div>
            )}
        </header>
    );
}
