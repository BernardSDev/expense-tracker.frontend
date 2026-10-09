"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

import { saveSession } from "@/lib/session";

const INPUT_CLASS =
    "h-12 w-full rounded-[10px] border border-border bg-surface px-3.5 text-[15px] text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-secondary hover:border-border-strong focus:border-dark focus:ring-4 focus:ring-accent/40";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Set when arriving straight from registration
    const registeredUsername = searchParams.get("username") ?? "";

    const [username, setUsername] = useState(registeredUsername);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const canSubmit = username.trim().length >= 3 && password.length > 0;

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!username.trim()) {
            setError("Please enter your username.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to sign in. Please check your credentials."
                );
                return;
            }

            saveSession(data, username);

            router.push("/dashboard");
        } catch {
            setError(
                "Something went wrong. Please check your connection and try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-8">
                <header className="flex h-16 items-center sm:h-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
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
                </header>

                <div className="flex flex-1 items-start justify-center pb-16 pt-4 sm:items-center sm:pt-0">
                    <div className="w-full max-w-[440px] rounded-2xl border border-border bg-surface p-6 shadow-card motion-safe:animate-rise-in sm:p-8">
                        <div className="mb-7">
                            <h1 className="text-[26px] font-semibold tracking-[-0.025em] text-text-primary sm:text-[30px]">
                                {registeredUsername ? "You're all set." : "Welcome back."}
                            </h1>

                            <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                                {registeredUsername
                                    ? "Your account is ready. Enter your password to sign in."
                                    : "Sign in to continue managing your expenses."}
                            </p>
                        </div>

                        <form
                            onSubmit={handleLogin}
                            noValidate
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-1.5 block text-[13px] font-medium text-text-primary"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                        setError("");
                                    }}
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    autoFocus={!registeredUsername}
                                    placeholder="Enter your username"
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-[13px] font-medium text-text-primary"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            setError("");
                                        }}
                                        autoComplete="current-password"
                                        autoFocus={!!registeredUsername}
                                        placeholder="Enter your password"
                                        className={`${INPUT_CLASS} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((current) => !current)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        aria-pressed={showPassword}
                                        className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                                    >
                                        {showPassword ? (
                                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c5 0 8.5 4.5 9.5 7a12 12 0 0 1-2.6 3.7M6.6 6.6A12.3 12.3 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7a9.6 9.6 0 0 0 4.4-1.1" />
                                                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                                            </svg>
                                        ) : (
                                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2.5 12C3.5 9.5 7 5 12 5s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7s-8.5-4.5-9.5-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-[10px] border border-negative/20 bg-negative-soft px-3.5 py-2.5 text-sm text-negative"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !canSubmit}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-dark text-[15px] font-semibold text-text-on-dark transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-dark-surface hover:shadow-float active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <span
                                            aria-hidden="true"
                                            className="h-4 w-4 animate-spin rounded-full border-2 border-text-on-dark/30 border-t-text-on-dark"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <span
                                            aria-hidden="true"
                                            className="text-accent"
                                        >
                                            →
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-6 border-t border-surface-muted pt-5 text-center text-sm text-text-secondary">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-text-primary underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-text-secondary"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginPageContent />
        </Suspense>
    );
}
