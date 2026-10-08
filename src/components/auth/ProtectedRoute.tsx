"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export default function ProtectedRoute({
                                           children,
                                       }: ProtectedRouteProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            router.replace("/login");
            return;
        }

        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background">
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