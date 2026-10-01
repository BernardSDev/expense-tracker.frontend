"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    function handleSignOut() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        router.push("/login");
    }

    const isOverview = pathname === "/dashboard";
    const isExpenses = pathname === "/expenses";

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

                        <span className="text-sm font-medium text-text-primary">
                            {username}
                        </span>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-sm text-text-secondary transition hover:text-text-primary"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile bottom navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur sm:hidden">
                <div className="grid h-16 grid-cols-3">
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center justify-center gap-1 text-xs transition ${
                            isOverview
                                ? "font-semibold text-text-primary"
                                : "text-text-secondary"
                        }`}
                    >
                        <span className="text-base leading-none">⌂</span>
                        <span>Overview</span>
                    </Link>

                    <Link
                        href="/expenses"
                        className={`flex flex-col items-center justify-center gap-1 text-xs transition ${
                            isExpenses
                                ? "font-semibold text-text-primary"
                                : "text-text-secondary"
                        }`}
                    >
                        <span className="text-base leading-none">≡</span>
                        <span>Expenses</span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex flex-col items-center justify-center gap-1 text-xs text-text-secondary transition"
                    >
                        <span className="flex h-5 w-5 items-center justify-center bg-surface-muted text-[10px] font-semibold text-text-primary">
                            {username
                                ? username.charAt(0).toUpperCase()
                                : "U"}
                        </span>

                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
}