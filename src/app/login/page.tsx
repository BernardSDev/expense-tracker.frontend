"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

type LoginStep = "username" | "password";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const registeredUsername = searchParams.get("username") ?? "";

    const [username, setUsername] = useState(registeredUsername);
    const [password, setPassword] = useState("");
    const [step, setStep] = useState<LoginStep>(
        registeredUsername ? "password" : "username"
    );

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const canContinue = username.trim().length >= 3;

    function handleContinue(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canContinue) return;

        setError("");
        setStep("password");
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

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

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("username", username);

            router.push("/expenses");
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
                <header className="flex h-20 items-center">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight text-text-primary"
                    >
                        ExpenseTracker
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center pb-20">
                    <div className="w-full max-w-[520px]">
                        <div className="mb-10">
                            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-text-primary sm:text-5xl">
                                Welcome back.
                            </h1>

                            {step === "username" && (
                                <p className="mt-5 max-w-md text-base leading-7 text-text-secondary">
                                    Sign in to continue managing your expenses.
                                </p>
                            )}
                        </div>

                        {step === "username" && (
                            <form
                                onSubmit={handleContinue}
                                className="space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-medium text-text-primary"
                                    >
                                        Username
                                    </label>

                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(event) => {
                                            setUsername(event.target.value);
                                            setError("");
                                        }}
                                        autoComplete="username"
                                        autoFocus
                                        placeholder="Enter your username"
                                        className="h-14 w-full border border-border-strong bg-surface px-4 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canContinue}
                                    className="h-14 w-full bg-accent text-base font-semibold text-text-primary transition hover:bg-accent-hover disabled:cursor-not-allowed"
                                >
                                    Continue <span className="ml-2">→</span>
                                </button>
                            </form>
                        )}

                        {step === "password" && (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-medium text-text-primary"
                                    >
                                        Username
                                    </label>

                                    <div className="flex h-14 w-full items-center border border-border bg-surface px-4 text-base text-text-primary">
                                        {username}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-text-primary"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                                setError("");
                                            }}
                                            autoComplete="current-password"
                                            autoFocus
                                            placeholder="Enter your password"
                                            className="h-14 w-full border border-border-strong bg-surface px-4 pr-14 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (current) => !current
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center text-text-secondary transition hover:text-text-primary"
                                        >
                                            {showPassword ? "◉" : "○"}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-text-secondary underline underline-offset-4 transition hover:text-text-primary"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !password}
                                    className="h-14 w-full bg-accent text-base font-semibold text-text-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-700" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <>
                                            Sign in{" "}
                                            <span className="ml-2">→</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <p className="mt-8 text-center text-sm text-text-secondary">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-text-primary underline underline-offset-4"
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