"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AuthNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        router.push("/login");
    }

    const isActive = (path: string) => pathname === path;

    return (
        <header className="border-b border-border bg-surface">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/dashboard"
                    className="text-lg font-semibold tracking-tight text-foreground"
                >
                    Trackk
                </Link>

                <nav className="flex items-center gap-1">
                    <Link
                        href="/dashboard"
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            isActive("/dashboard")
                                ? "bg-surface-muted text-foreground"
                                : "text-text-secondary hover:text-foreground"
                        }`}
                    >
                        Overview
                    </Link>

                    <Link
                        href="/expenses"
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            isActive("/expenses")
                                ? "bg-surface-muted text-foreground"
                                : "text-text-secondary hover:text-foreground"
                        }`}
                    >
                        Expenses
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <span className="hidden text-sm text-text-secondary sm:block">
                        {typeof window !== "undefined"
                            ? localStorage.getItem("username") || "Account"
                            : "Account"}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}