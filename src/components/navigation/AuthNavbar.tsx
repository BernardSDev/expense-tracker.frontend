"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { clearSession, getUsername } from "@/lib/session";

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
        getUsername,
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
        clearSession();

        router.push("/login");
    }

    const isOverview = pathname === "/dashboard";
    const isExpenses = pathname === "/expenses";
    const activeIndex = isOverview ? 0 : isExpenses ? 1 : -1;

    const avatarLetter = username
        ? username.charAt(0).toUpperCase()
        : "U";

    const accountMenu = (placement: "sidebar" | "above") => (
        <div
            role="menu"
            className={`absolute right-0 z-50 w-60 overflow-hidden rounded-xl border border-border bg-surface shadow-float motion-safe:animate-pop-in ${
                placement === "sidebar"
                    ? "inset-x-0 bottom-[calc(100%+0.5rem)] w-auto"
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
        `relative z-10 flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm transition-colors ${
            active
                ? "font-semibold text-text-primary"
                : "font-medium text-text-secondary hover:bg-surface-muted/60 hover:text-text-primary"
        }`;

    const mobileLinkClass = (active: boolean) =>
        `flex min-h-16 w-full flex-col items-center justify-center gap-1 text-xs transition-colors ${
            active
                ? "font-semibold text-text-primary"
                : "font-medium text-text-secondary"
        }`;

    const mobileIconClass = () =>
        "relative z-10 flex h-8 items-center justify-center px-4";

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
                <div className="flex h-16 items-center px-5">
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
                            Sika
                        </span>
                    </Link>
                </div>

                <nav
                    aria-label="Main"
                    className="flex-1 px-3 pt-4"
                >
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                        Menu
                    </p>

                    <div className="relative flex flex-col gap-0.5">
                        {/* Sliding highlight behind the active item */}
                        <span
                            aria-hidden="true"
                            className={`absolute inset-x-0 top-0 h-10 rounded-[10px] bg-surface-muted transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                                activeIndex === -1 ? "opacity-0" : "opacity-100"
                            }`}
                            style={{
                                transform: `translateY(${Math.max(activeIndex, 0) * 42}px)`,
                            }}
                        />

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
                </nav>

                {/* Desktop account menu */}
                <div
                    ref={desktopAccountRef}
                    className="relative border-t border-border p-3"
                >
                    <button
                        type="button"
                        onClick={() =>
                            setAccountOpen((current) => !current)
                        }
                        aria-expanded={accountOpen}
                        aria-haspopup="menu"
                        className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                            accountOpen
                                ? "bg-surface-muted"
                                : "hover:bg-surface-muted"
                        }`}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-text-primary">
                            {avatarLetter}
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-text-primary">
                                {username || "Account"}
                            </span>
                            <span className="block text-xs text-text-secondary">
                                Personal account
                            </span>
                        </span>

                        <ChevronIcon open={accountOpen} />
                    </button>

                    {accountOpen && accountMenu("sidebar")}
                </div>
            </aside>

            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:hidden">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-dark text-[13px] font-bold text-accent"
                    >
                        ₵
                    </span>

                    <span className="text-base font-semibold tracking-[-0.03em] text-text-primary">
                        Sika
                    </span>
                </Link>
            </header>

            {/* Mobile bottom navigation */}
            <nav
                aria-label="Main"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur lg:hidden"
            >
                <div className="relative grid grid-cols-3 px-2 pb-[env(safe-area-inset-bottom)]">
                    {/* Sliding lime pill behind the active icon */}
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute left-2 top-0 flex h-16 w-[calc((100%-1rem)/3)] items-start justify-center pt-[calc((4rem-3.25rem)/2)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                            activeIndex === -1 ? "opacity-0" : "opacity-100"
                        }`}
                        style={{
                            transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
                        }}
                    >
                        <span className="h-8 w-[3.25rem] rounded-full bg-accent" />
                    </span>

                    <Link
                        href="/dashboard"
                        aria-current={isOverview ? "page" : undefined}
                        className={mobileLinkClass(isOverview)}
                    >
                        <span className={mobileIconClass()}>
                            <HomeIcon active={isOverview} />
                        </span>

                        <span>Overview</span>
                    </Link>

                    <Link
                        href="/expenses"
                        aria-current={isExpenses ? "page" : undefined}
                        className={mobileLinkClass(isExpenses)}
                    >
                        <span className={mobileIconClass()}>
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