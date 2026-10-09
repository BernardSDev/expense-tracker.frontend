import Link from "next/link";

import Footer from "@/components/Footer";
import ProductFrame from "@/components/marketing/ProductFrame";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#get-started", label: "Get started" },
];

const features = [
    {
        title: "Log in seconds",
        body: "Amount, a note and a category. The date fills itself in, and it shows up straight away.",
    },
    {
        title: "See your month",
        body: "Totals, your daily average and how this month compares with the last, on one screen.",
    },
    {
        title: "Know where it goes",
        body: "Your own categories, each with its own colour, so the breakdown reads at a glance.",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
                <nav
                    aria-label="Main"
                    className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 lg:h-[72px]"
                >
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
                            Sika
                        </span>
                    </Link>

                    <div className="hidden items-center gap-8 text-sm font-medium md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-text-secondary transition-colors hover:text-text-primary"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="hidden h-10 items-center px-3.5 text-sm font-semibold text-text-primary transition-colors hover:text-text-secondary sm:flex"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/register"
                            className="flex h-10 items-center rounded-[10px] bg-dark px-4 text-sm font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                        >
                            Get started
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                {/* Hero */}
                <section className="stagger mx-auto flex max-w-6xl flex-col items-center px-6 pt-16 text-center sm:pt-24">
                    <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-text-secondary">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        Expense tracking, made for cedis
                    </p>

                    <h1 className="mt-6 max-w-[860px] text-balance text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] text-text-primary sm:text-6xl lg:text-[72px]">
                        Know where every cedi goes.
                    </h1>

                    <p className="mt-5 max-w-[560px] text-pretty text-lg leading-8 text-text-secondary sm:text-[19px]">
                        Record what you spend, sort it by category and see your
                        month at a glance. Calm, simple, and made for your phone.
                    </p>

                    <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Link
                            href="/register"
                            className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-dark px-6 text-[15px] font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                        >
                            Create your account
                            <span aria-hidden="true" className="text-accent">→</span>
                        </Link>
                        <Link
                            href="/login"
                            className="flex h-12 items-center justify-center rounded-[10px] border border-border bg-surface px-6 text-[15px] font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted"
                        >
                            Sign in
                        </Link>
                    </div>

                    <p className="mt-[18px] text-[13px] text-text-secondary">
                        No bank connection needed · Works in your phone&apos;s browser
                    </p>
                </section>

                {/* Product */}
                <section className="mx-auto max-w-6xl px-4 pt-14 motion-safe:animate-rise-in [animation-delay:200ms] [animation-fill-mode:both] sm:px-6 sm:pt-16">
                    <ProductFrame />
                </section>

                {/* Features */}
                <section
                    id="features"
                    className="mx-auto max-w-6xl scroll-mt-24 px-6 pt-24 sm:pt-28"
                >
                    <h2 className="sr-only">Features</h2>
                    <div className="grid border-t border-border md:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="border-b border-border py-8 md:border-b-0 md:pr-8"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-base font-semibold text-text-primary">
                                    {index + 1}
                                </span>
                                <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em] text-text-primary">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-[15px] leading-7 text-text-secondary">
                                    {feature.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section
                    id="get-started"
                    className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20 pt-16 sm:pb-28 sm:pt-24"
                >
                    <div className="flex flex-col gap-8 rounded-3xl border border-border bg-surface p-8 sm:p-14 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-[40px]">
                                Start in under a minute.
                            </h2>
                            <p className="mt-2.5 text-[17px] text-text-secondary">
                                Create an account and add your first expense.
                            </p>
                        </div>

                        <Link
                            href="/register"
                            className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-dark px-[26px] text-[15px] font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                        >
                            Create your account
                            <span aria-hidden="true" className="text-accent">→</span>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
