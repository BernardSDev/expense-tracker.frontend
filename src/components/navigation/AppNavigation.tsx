"use client";

import { usePathname } from "next/navigation";

import AuthNavbar from "./AuthNavbar";

const APP_ROUTES = ["/dashboard", "/expenses"];

/**
 * Renders the app navigation once, from the root layout, on signed-in routes.
 * Because it stays mounted between pages, its indicators can slide
 * instead of jumping.
 */
export default function AppNavigation() {
    const pathname = usePathname();

    const isAppRoute = APP_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isAppRoute) {
        return null;
    }

    return <AuthNavbar />;
}
