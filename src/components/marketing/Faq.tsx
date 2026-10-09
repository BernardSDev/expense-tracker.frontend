const questions = [
    {
        question: "Do I need to connect my bank or mobile money?",
        answer: "No. You add your expenses yourself, so Sika never needs access to your bank or mobile money accounts.",
    },
    {
        question: "Which currency does Sika use?",
        answer: "Amounts are shown in Ghana cedis (GH₵).",
    },
    {
        question: "Can I use it on my phone?",
        answer: "Yes. Sika works in your phone's browser and is designed for small screens, with swipe actions and a quick add button.",
    },
    {
        question: "Can I create my own categories?",
        answer: "Yes. Add, rename or remove categories whenever you like. Each one gets its own colour across the app.",
    },
    {
        question: "Who can see my expenses?",
        answer: "Your expenses belong to your account, and you need to sign in to see them.",
    },
];

export default function Faq() {
    return (
        <section
            id="faq"
            className="scroll-mt-20 bg-background"
        >
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-28">
                <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                        FAQ
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[44px] sm:leading-[1.1]">
                        Questions, answered.
                    </h2>
                </div>

                <div className="divide-y divide-border rounded-2xl border border-border bg-surface shadow-card">
                    {questions.map((item) => (
                        <details
                            key={item.question}
                            className="group px-5 sm:px-6"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                                {item.question}
                                <span
                                    aria-hidden="true"
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-secondary transition-transform duration-200 group-open:rotate-45"
                                >
                                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M10 4v12M4 10h12" />
                                    </svg>
                                </span>
                            </summary>

                            <p className="-mt-1 pb-5 pr-10 text-[15px] leading-7 text-text-secondary">
                                {item.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
