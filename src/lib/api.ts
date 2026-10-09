let refreshPromise: Promise<unknown> | null = null;

export class SessionExpiredError extends Error {
    constructor() {
        super("Session expired.");
        this.name = "SessionExpiredError";
    }
}

export async function apiRequest(
    url: string,
    options: RequestInit = {}
) {
    const accessToken = localStorage.getItem("accessToken");

    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set(
            "Authorization",
            `Bearer ${accessToken}`
        );
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {

        if (!refreshPromise) {
            refreshPromise = refreshAccessToken();
        }

        const currentRefreshPromise = refreshPromise;

        try {
            await currentRefreshPromise;
        } catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            throw new SessionExpiredError();
        } finally {
            if (refreshPromise === currentRefreshPromise) {
                refreshPromise = null;
            }
        }

        const newAccessToken = localStorage.getItem("accessToken");

        const retryHeaders = new Headers(options.headers);

        if (newAccessToken) {
            retryHeaders.set(
                "Authorization",
                `Bearer ${newAccessToken}`
            );
        }

        const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
        });

        return retryResponse;
    }

    return response;
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to refresh access token.");
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
}