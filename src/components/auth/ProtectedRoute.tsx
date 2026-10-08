"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

function subscribeToStorage(callback: () => void) {
    window.addEventListener("storage", callback);

    return () => window.removeEventListener("storage", callback);
}

function getHasToken() {
    return Boolean(localStorage.getItem("accessToken"));
}

// On the server we can't see localStorage, so we don't know yet.
function getServerHasToken() {
    return null;
}

export default function ProtectedRoute({
                                           children,
                                       }: ProtectedRouteProps) {
    const router = useRouter();

    const hasToken = useSyncExternalStore<boolean | null>(
        subscribeToStorage,
        getHasToken,
        getServerHasToken
    );

    useEffect(() => {
        if (hasToken === false) {
            router.replace("/login");
        }
    }, [hasToken, router]);

    const isChecking = hasToken !== true;

    if (isChecking) {
        return (
            <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-background lg:min-h-screen lg:pl-60">
                <div
                    role="status"
                    className="flex flex-col items-center gap-3"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-dark text-lg font-bold text-accent"
                    >
                        ₵
                    </span>

                    <p className="text-sm text-text-secondary">
                        Loading your workspace…
                    </p>
                </div>
            </main>
        );
    }

    return <>{children}</>;
}