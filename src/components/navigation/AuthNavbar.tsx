"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function HomeIcon({ active }: { active: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${
                active ? "text-text-primary" : "text-text-secondary"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.5 10.5 12 3l8.5 7.5"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.5 9.5V20h13V9.5M9.5 20v-6h5v6"
            />
        </svg>
    );
}

function ExpensesIcon({ active }: { active: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${
                active ? "text-text-primary" : "text-text-secondary"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 3.5h9l3 3V20.5H6z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.5 3.5v4h3.5M9 11h6M9 14.5h6M9 18h3"
            />
        </svg>
    );
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`h-4 w-4 text-text-secondary transition-transform ${
                open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 7.5 5 5 5-5"
            />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 8l4 4-4 4M18 12H9"
            />
        </svg>
    );
}

function subscribeToStorage(callback: () => void) {
    window.addEventListener("storage", callback);

    return () => window.removeEventListener("storage", callback);
}

export default function AuthNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const username = useSyncExternalStore(
        subscribeToStorage,
        () => localStorage.getItem("username") ?? "",
        () => ""
    );
    const [accountOpen, setAccountOpen] = useState(false);

    const desktopAccountRef = useRef<HTMLDivElement>(null);
    const mobileAccountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            const isInsideMenu =
                desktopAccountRef.current?.contains(target) ||
                mobileAccountRef.current?.contains(target);

            if (!isInsideMenu) {
                setAccountOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setAccountOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleSignOut() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        router.push("/login");
    }

    const isOverview = pathname === "/dashboard";
    const isExpenses = pathname === "/expenses";

    const avatarLetter = username
        ? username.charAt(0).toUpperCase()
        : "U";

    const accountMenu = (placement: "below" | "above") => (
        <div
            role="menu"
            className={`absolute right-0 z-50 w-60 overflow-hidden rounded-xl border border-border bg-surface shadow-float ${
                placement === "below"
                    ? "top-full mt-2"
                    : "bottom-[calc(100%+0.75rem)] right-3"
            }`}
        >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-text-primary">
                    {avatarLetter}
                </span>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                        {username || "Account"}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                        Personal account
                    </p>
                </div>
            </div>

            <div className="p-1.5">
                <button
                    type="button"
                    onClick={handleSignOut}
                    role="menuitem"
                    className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-red-600"
                >
                    <LogoutIcon />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );

    const desktopLinkClass = (active: boolean) =>
        `inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
            active
                ? "bg-surface-muted font-semibold text-text-primary"
                : "font-medium text-text-secondary hover:bg-surface-muted/60 hover:text-text-primary"
        }`;

    const mobileLinkClass = (active: boolean) =>
        `flex min-h-16 w-full flex-col items-center justify-center gap-1 text-xs transition-colors ${
            active
                ? "font-semibold text-text-primary"
                : "font-medium text-text-secondary"
        }`;

    const mobileIconClass = (active: boolean) =>
        `flex h-8 items-center justify-center rounded-full px-4 transition-colors ${
            active ? "bg-accent" : ""
        }`;

    return (
        <>
            {/* Desktop navbar */}
            <nav
                aria-label="Main"
                className="sticky top-0 z-40 hidden border-b border-border bg-surface/90 backdrop-blur sm:block"
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6 lg:px-8">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-lg"
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

                    <div className="flex items-center gap-1">
                        <Link
                            href="/dashboard"
                            aria-current={isOverview ? "page" : undefined}
                            className={desktopLinkClass(isOverview)}
                        >
                            <HomeIcon active={isOverview} />
                            Overview
                        </Link>

                        <Link
                            href="/expenses"
                            aria-current={isExpenses ? "page" : undefined}
                            className={desktopLinkClass(isExpenses)}
                        >
                            <ExpensesIcon active={isExpenses} />
                            Expenses
                        </Link>
                    </div>

                    {/* Desktop account menu */}
                    <div
                        ref={desktopAccountRef}
                        className="relative ml-auto"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setAccountOpen((current) => !current)
                            }
                            aria-expanded={accountOpen}
                            aria-haspopup="menu"
                            className={`flex h-10 items-center gap-2.5 rounded-full border py-1 pl-1 pr-3 transition-colors ${
                                accountOpen
                                    ? "border-border-strong bg-surface-muted"
                                    : "border-border bg-surface hover:border-border-strong"
                            }`}
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-text-primary">
                                {avatarLetter}
                            </span>

                            <span className="max-w-32 truncate text-sm font-medium text-text-primary">
                                {username || "Account"}
                            </span>

                            <ChevronIcon open={accountOpen} />
                        </button>

                        {accountOpen && accountMenu("below")}
                    </div>
                </div>
            </nav>

            {/* Mobile bottom navigation */}
            <nav
                aria-label="Main"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur sm:hidden"
            >
                <div className="grid grid-cols-3 px-2 pb-[env(safe-area-inset-bottom)]">
                    <Link
                        href="/dashboard"
                        aria-current={isOverview ? "page" : undefined}
                        className={mobileLinkClass(isOverview)}
                    >
                        <span className={mobileIconClass(isOverview)}>
                            <HomeIcon active={isOverview} />
                        </span>

                        <span>Overview</span>
                    </Link>

                    <Link
                        href="/expenses"
                        aria-current={isExpenses ? "page" : undefined}
                        className={mobileLinkClass(isExpenses)}
                    >
                        <span className={mobileIconClass(isExpenses)}>
                            <ExpensesIcon active={isExpenses} />
                        </span>

                        <span>Expenses</span>
                    </Link>

                    {/* Mobile account menu */}
                    <div ref={mobileAccountRef} className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setAccountOpen((current) => !current)
                            }
                            aria-expanded={accountOpen}
                            aria-haspopup="menu"
                            className={mobileLinkClass(accountOpen)}
                        >
                            <span
                                className={`flex h-8 items-center justify-center rounded-full px-4 transition-colors ${
                                    accountOpen ? "bg-surface-muted" : ""
                                }`}
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-border text-[11px] font-bold text-text-primary">
                                    {avatarLetter}
                                </span>
                            </span>

                            <span>Account</span>
                        </button>

                        {accountOpen && accountMenu("above")}
                    </div>
                </div>
            </nav>
        </>
    );
}