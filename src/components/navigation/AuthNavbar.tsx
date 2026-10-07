"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

function UserIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <circle cx="12" cy="8" r="3.25" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.5 19.5c.8-3.1 3.1-4.75 6.5-4.75s5.7 1.65 6.5 4.75"
            />
        </svg>
    );
}

export default function AuthNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [username, setUsername] = useState("");
    const [accountOpen, setAccountOpen] = useState(false);

    const accountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                accountRef.current &&
                !accountRef.current.contains(event.target as Node)
            ) {
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

    return (
        <>
            {/* Desktop navbar */}
            <nav className="hidden border-b border-border bg-surface sm:block">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                    <Link
                        href="/dashboard"
                        className="text-lg font-semibold tracking-[-0.03em] text-text-primary"
                    >
                        Trackk
                    </Link>

                    <div className="flex items-center gap-7">
                        <Link
                            href="/dashboard"
                            className={`text-sm transition ${
                                isOverview
                                    ? "font-semibold text-text-primary"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            Overview
                        </Link>

                        <Link
                            href="/expenses"
                            className={`text-sm transition ${
                                isExpenses
                                    ? "font-semibold text-text-primary"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            Expenses
                        </Link>

                        <div className="ml-2 h-5 w-px bg-border" />

                        {/* Desktop account menu */}
                        <div ref={accountRef} className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setAccountOpen((current) => !current)
                                }
                                aria-expanded={accountOpen}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 rounded-md py-1.5 pl-1 pr-1.5 transition hover:bg-surface-muted"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-text-primary">
                                    {avatarLetter}
                                </span>

                                <span className="max-w-32 truncate text-sm font-medium text-text-primary">
                                    {username || "Account"}
                                </span>

                                <ChevronIcon open={accountOpen} />
                            </button>

                            {accountOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                                >
                                    <div className="border-b border-border px-4 py-3">
                                        <p className="truncate text-sm font-medium text-text-primary">
                                            {username || "Account"}
                                        </p>
                                        <p className="mt-0.5 text-xs text-text-secondary">
                                            Personal account
                                        </p>
                                    </div>

                                    <div className="p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            role="menuitem"
                                            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                                        >
                                            <LogoutIcon />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile bottom navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur sm:hidden">
                <div className="grid min-h-16 grid-cols-3 pb-[env(safe-area-inset-bottom)]">
                    <Link
                        href="/dashboard"
                        className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs transition ${
                            isOverview
                                ? "font-semibold text-text-primary"
                                : "text-text-secondary"
                        }`}
                    >
                        {isOverview && (
                            <span
                                aria-hidden="true"
                                className="absolute top-0 h-0.5 w-8 bg-accent"
                            />
                        )}

                        <HomeIcon active={isOverview} />

                        <span>Overview</span>
                    </Link>

                    <Link
                        href="/expenses"
                        className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs transition ${
                            isExpenses
                                ? "font-semibold text-text-primary"
                                : "text-text-secondary"
                        }`}
                    >
                        {isExpenses && (
                            <span
                                aria-hidden="true"
                                className="absolute top-0 h-0.5 w-8 bg-accent"
                            />
                        )}

                        <ExpensesIcon active={isExpenses} />

                        <span>Expenses</span>
                    </Link>

                    {/* Mobile account menu */}
                    <div ref={accountRef} className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setAccountOpen((current) => !current)
                            }
                            aria-expanded={accountOpen}
                            aria-haspopup="menu"
                            className={`flex min-h-16 w-full flex-col items-center justify-center gap-1 text-xs transition ${
                                accountOpen
                                    ? "font-semibold text-text-primary"
                                    : "text-text-secondary"
                            }`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-muted text-[10px] font-semibold text-text-primary">
                                {avatarLetter}
                            </span>

                            <span>Account</span>
                        </button>

                        {accountOpen && (
                            <div
                                role="menu"
                                className="absolute bottom-[calc(100%+0.5rem)] right-3 z-50 w-52 overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                            >
                                <div className="border-b border-border px-4 py-3">
                                    <p className="truncate text-sm font-medium text-text-primary">
                                        {username || "Account"}
                                    </p>
                                    <p className="mt-0.5 text-xs text-text-secondary">
                                        Personal account
                                    </p>
                                </div>

                                <div className="p-1.5">
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        role="menuitem"
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                                    >
                                        <LogoutIcon />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}