import Link from "next/link";
import TrackOrganizeUnderstand from "@/components/marketing/TrackOrganizeUnderstand";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <main className="min-h-screen">
                <header className="border-b border-border">
                    <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5"
                        >
                            <span
                                aria-hidden="true"
                                className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-dark text-[15px] font-bold text-accent"
                            >
                                ₵
                            </span>

                            <span className="text-[17px] font-semibold tracking-[-0.03em] text-text-primary">
                                Trackk
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="hidden px-4 py-2 text-sm font-medium text-text-secondary transition hover:text-text-primary sm:block"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex h-10 items-center rounded-[10px] bg-dark px-4 text-sm font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                            >
                                Get started
                            </Link>
                        </div>
                    </nav>
                </header>

                <section className="mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
                    <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
                        {/* Hero copy */}
                        <div>
                            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-text-secondary">
                                Simple expense management
                            </p>

                            <h1 className="max-w-3xl text-6xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                                Take control of
                                <br />
                                your{" "}
                                <span className="relative inline-block">
                                money.
                                <span className="absolute -bottom-1 left-0 -z-10 h-4 w-full bg-accent sm:h-5" />
                            </span>
                            </h1>

                            <p className="mt-8 max-w-xl text-lg leading-8 text-text-secondary">
                                Track your expenses, understand where your
                                money goes, and stay in control without the
                                complexity.
                            </p>

                            <div className="mt-9 flex flex-wrap items-center gap-4">
                                <Link
                                    href="/register"
                                    className="inline-flex h-12 items-center justify-center rounded-[10px] bg-dark px-6 text-[15px] font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                                >
                                    Start tracking
                                    <span className="ml-2">→</span>
                                </Link>

                                <Link
                                    href="/login"
                                    className="inline-flex h-12 items-center justify-center rounded-[10px] border border-border bg-surface px-6 text-[15px] font-semibold text-text-primary shadow-card transition-colors hover:border-border-strong hover:bg-surface-muted"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>

                        {/* Product preview */}
                        <div className="relative">
                            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/20 blur-3xl" />

                            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
                                {/* Preview header */}
                                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                                            Overview
                                        </p>

                                        <p className="mt-1 text-sm font-semibold">
                                            September 2026
                                        </p>
                                    </div>

                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold">
                                        B
                                    </div>
                                </div>

                                {/* Spending summary */}
                                <div className="p-6 sm:p-8">
                                    <p className="text-sm text-text-secondary">
                                        Total spending
                                    </p>

                                    <p className="mt-2 text-4xl font-semibold tracking-tight">
                                        GH₵ 4,250.50
                                    </p>

                                    <div className="mt-8 space-y-6">
                                        <SpendingRow
                                            category="Food"
                                            amount="GH₵ 1,245"
                                            percentage="29%"
                                            width="72%"
                                        />

                                        <SpendingRow
                                            category="Utilities"
                                            amount="GH₵ 920"
                                            percentage="22%"
                                            width="55%"
                                        />

                                        <SpendingRow
                                            category="Transport"
                                            amount="GH₵ 540"
                                            percentage="13%"
                                            width="40%"
                                        />

                                        <SpendingRow
                                            category="Entertainment"
                                            amount="GH₵ 320"
                                            percentage="8%"
                                            width="28%"
                                        />
                                    </div>
                                </div>

                                {/* Preview footer */}
                                <div className="flex items-center justify-between border-t border-border bg-surface-muted px-6 py-4 text-sm">
                                <span className="text-text-secondary">
                                    18 expenses
                                </span>

                                    <span className="font-medium">
                                    5 categories
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-dark text-text-on-dark">
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
                        <div className="max-w-4xl">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-on-dark/60">
                                Built for clarity
                            </p>

                            <h2 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                                Your money.
                                <br />
                                <span className="text-accent">Your picture.</span>
                            </h2>

                            <p className="mt-8 max-w-2xl text-lg leading-8 text-text-on-dark/70">
                                Everything you need to understand your spending,
                                organized in one simple place.
                            </p>
                        </div>
                    </div>
                </section>

                <TrackOrganizeUnderstand />
                <FinalCTA />
            </main>

            <Footer />
        </>
    );
}

function SpendingRow({
                         category,
                         amount,
                         percentage,
                         width,
                     }: {
    category: string;
    amount: string;
    percentage: string;
    width: string;
}) {
    return (
        <div>
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category}</span>

                <div className="flex items-center gap-3">
                    <span className="text-text-muted">
                        {percentage}
                    </span>

                    <span className="font-medium">{amount}</span>
                </div>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                    className="h-full rounded-full bg-accent"
                    style={{ width }}
                />
            </div>
        </div>
    );
}