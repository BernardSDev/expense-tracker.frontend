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
                <p className="text-sm text-text-secondary">
                    Loading...
                </p>
            </main>
        );
    }

    return <>{children}</>;
}