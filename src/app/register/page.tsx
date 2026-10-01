"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const canSubmit =
        username.trim().length >= 3 &&
        email.trim().length > 0 &&
        password.length > 0;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canSubmit) return;

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to create your account. Please try again."
                );
                return;
            }

            router.push(`/login?username=${encodeURIComponent(username)}`);
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
                                Create your account.
                            </h1>

                            <p className="mt-5 max-w-md text-base leading-7 text-text-secondary">
                                Start tracking your expenses and take control of your money.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                    placeholder="Choose a username"
                                    className="h-14 w-full border border-border-strong bg-surface px-4 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-text-primary"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setError("");
                                    }}
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    className="h-14 w-full border border-border-strong bg-surface px-4 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                />
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
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            setError("");
                                        }}
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        className="h-14 w-full border border-border-strong bg-surface px-4 pr-14 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-text-primary focus:ring-2 focus:ring-accent/40"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((current) => !current)
                                        }
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center text-text-secondary transition hover:text-text-primary"
                                    >
                                        {showPassword ? "◉" : "○"}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !canSubmit}
                                className={`flex h-14 w-full items-center justify-center text-base font-semibold text-text-primary transition ${
                                    isLoading
                                        ? "cursor-not-allowed bg-neutral-300"
                                        : "bg-accent hover:bg-accent-hover disabled:cursor-not-allowed"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-text-primary/30 border-t-text-primary" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </form>

                        <p className="mt-10 text-center text-sm text-text-secondary">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-text-primary underline decoration-accent decoration-2 underline-offset-4 transition hover:text-text-secondary"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}