const steps = [
    {
        title: "Create your account",
        description: "Pick a username and password. It takes under a minute.",
    },
    {
        title: "Add what you spend",
        description: "Record each expense as it happens, with a category if you want one.",
    },
    {
        title: "See where it goes",
        description: "Your dashboard turns your expenses into totals, trends and a breakdown by category.",
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="scroll-mt-20 border-y border-border bg-surface"
        >
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
                <div className="max-w-2xl">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                        How it works
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[44px] sm:leading-[1.1]">
                        Up and running in three steps.
                    </h2>
                </div>

                <ol className="mt-12 grid gap-4 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <li
                            key={step.title}
                            className="relative rounded-2xl border border-border bg-background p-6 sm:p-7"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dark text-sm font-semibold text-accent">
                                {index + 1}
                            </span>

                            <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-text-primary">
                                {step.title}
                            </h3>

                            <p className="mt-1.5 text-[15px] leading-7 text-text-secondary">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
