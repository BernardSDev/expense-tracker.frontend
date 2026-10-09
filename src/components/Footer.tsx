import Link from "next/link";

const columns = [
    {
        title: "Product",
        links: [
            { href: "/#features", label: "Features" },
            { href: "/#how-it-works", label: "How it works" },
            { href: "/#faq", label: "FAQ" },
        ],
    },
    {
        title: "Account",
        links: [
            { href: "/register", label: "Create account" },
            { href: "/login", label: "Sign in" },
            { href: "/dashboard", label: "Open app" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-surface">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5"
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

                    <p className="mt-4 max-w-xs text-sm leading-6 text-text-secondary">
                        A simple way to track your spending and know where your money goes.
                    </p>
                </div>

                {columns.map((column) => (
                    <nav
                        key={column.title}
                        aria-label={column.title}
                    >
                        <p className="text-[13px] font-semibold text-text-primary">
                            {column.title}
                        </p>
                        <ul className="mt-4 space-y-2.5">
                            {column.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className="border-t border-border">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between lg:px-8">
                    <p>© 2026 Sika. All rights reserved.</p>
                    <p>Made in Ghana.</p>
                </div>
            </div>
        </footer>
    );
}
