import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {Toaster} from "sonner";

import QueryProvider from "@/providers/QueryProvider";
import AppNavigation from "@/components/navigation/AppNavigation";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Sika · Expense tracker",
        template: "%s · Sika",
    },
    description: "Track your spending, organise it by category and see where your money goes.",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="flex min-h-full flex-col">
            <QueryProvider>
                <AppNavigation />
                {children}
            </QueryProvider>

            <Toaster
                position="top-right"
                gap={10}
                toastOptions={{
                    style: {
                        background: "var(--surface)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: "14px",
                        boxShadow: "var(--shadow-float)",
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: "14px",
                    },
                }}
            />
        </body>
        </html>
    );
}