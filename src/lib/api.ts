const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USERNAME_KEY = "username";

type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

/**
 * Shared by every request that hits a 401 at the same time, so the
 * refresh endpoint is only called once.
 */
let refreshPromise: Promise<AuthTokens> | null = null;

export class SessionExpiredError extends Error {
    constructor() {
        super("Session expired.");
        this.name = "SessionExpiredError";
    }
}

/**
 * Signs the user out locally. The "storage" event lets ProtectedRoute
 * notice straight away and send the user to the login page.
 */
function clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);

    window.dispatchEvent(new Event("storage"));
}

/** Copies the request options and attaches the given access token, if any. */
function withAuth(
    options: RequestInit,
    accessToken: string | null
): RequestInit {
    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return { ...options, headers };
}

export async function apiRequest(
    url: string,
    options: RequestInit = {}
) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    const response = await fetch(url, withAuth(options, accessToken));

    if (response.status !== 401) {
        return response;
    }

    // Another request may already have refreshed the token while this one
    // was in flight. If so, just retry with the new token.
    const latestAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (latestAccessToken && latestAccessToken !== accessToken) {
        return fetch(url, withAuth(options, latestAccessToken));
    }

    if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    let tokens: AuthTokens;

    try {
        tokens = await refreshPromise;
    } catch {
        clearSession();
        throw new SessionExpiredError();
    }

    // Retry once with the fresh token. If this also returns 401,
    // it's passed back to the caller rather than looping.
    return fetch(url, withAuth(options, tokens.accessToken));
}

export async function refreshAccessToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
        throw new Error("No refresh token available.");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to refresh access token.");
    }

    const data: Partial<AuthTokens> = await response.json();

    if (!data.accessToken || !data.refreshToken) {
        throw new Error("Refresh response did not include new tokens.");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    };
}
