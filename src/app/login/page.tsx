"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type LoginStep = "username" | "password";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState<LoginStep>("username");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const canContinue = username.trim().length >= 3;

    function handleContinue(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canContinue) {
            return;
        }

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
                "http://localhost:5077/api/Auth/login",
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
                {/* Brand */}
                <header className="flex h-20 items-center">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight text-text-primary"
                    >
                        ExpenseTracker
                    </Link>
                </header>

                {/* Authentication */}
                <div className="flex flex-1 items-center justify-center pb-20">
                    <div className="w-full max-w-[520px]">
                        {/* Heading */}
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

                        {/* Username Step */}
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
                                    Continue
                                    <span className="ml-2">→</span>
                                </button>
                            </form>
                        )}

                        {/* Password Step */}
                        {step === "password" && (
                            <form
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >
                                {/* Username */}
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

                                {/* Password */}
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

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-text-secondary underline underline-offset-4 transition hover:text-text-primary"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                {/* Sign In */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !password}
                                    className={`flex h-14 w-full items-center justify-center text-base font-semibold text-text-primary transition ${
                                        isLoading
                                            ? "cursor-not-allowed bg-neutral-300"
                                            : "bg-accent hover:bg-accent-hover disabled:cursor-not-allowed"
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-text-primary/30 border-t-text-primary" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Register */}
                        <p className="mt-10 text-center text-sm text-text-secondary">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-text-primary underline decoration-accent decoration-2 underline-offset-4 transition hover:text-text-secondary"
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