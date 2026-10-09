import Link from "next/link";

import Footer from "@/components/Footer";
import Faq from "@/components/marketing/Faq";
import Features from "@/components/marketing/Features";
import FinalCTA from "@/components/marketing/FinalCTA";
import HowItWorks from "@/components/marketing/HowItWorks";
import ProductPreview from "@/components/marketing/ProductPreview";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
];

export default function Home() {
    return (
        <>
            <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
                <nav
                    aria-label="Main"
                    className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8"
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

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="hidden h-10 items-center rounded-[10px] px-3.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-muted sm:inline-flex"
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

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]"
                    />

                    <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
                        <div className="stagger">
                            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary shadow-card">
                                <span className="h-2 w-2 rounded-full bg-accent ring-4 ring-accent/30" />
                                Expense tracking, made for cedis
                            </p>

                            <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-[68px]">
                                Know where every{" "}
                                <span className="relative whitespace-nowrap">
                                    <span className="relative z-10">cedi goes.</span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-accent sm:bottom-2 sm:h-4"
                                    />
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
                                Sika is a calm, simple way to record what you spend,
                                organise it by category and see your month at a glance.
                            </p>

                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/register"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-dark px-6 text-[15px] font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98]"
                                >
                                    Create your account
                                    <span aria-hidden="true" className="text-accent">→</span>
                                </Link>

                                <a
                                    href="#features"
                                    className="inline-flex h-12 items-center justify-center rounded-[10px] border border-border bg-surface px-6 text-[15px] font-semibold text-text-primary shadow-card transition-colors hover:border-border-strong hover:bg-surface-muted"
                                >
                                    See how it works
                                </a>
                            </div>

                            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-text-secondary">
                                {["No bank connection needed", "Works on your phone", "Your own categories"].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-2"
                                    >
                                        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-positive" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 10.5l3.2 3L15 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="motion-safe:animate-rise-in [animation-delay:150ms] [animation-fill-mode:both] lg:pl-4">
                            <ProductPreview />
                        </div>
                    </div>
                </section>

                <Features />
                <HowItWorks />
                <Faq />
                <FinalCTA />
            </main>

            <Footer />
        </>
    );
}
