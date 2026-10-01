"use client";

import React, { useState } from "react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const response = await fetch("http://localhost:5077/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        console.log(data);
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold">Login</h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full border p-2"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border p-2"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white p-2"
                >
                    Login
                </button>
            </form>
        </main>
    );
}