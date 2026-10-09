import {refreshAccessToken} from "./auth";
import {AuthTokens, clearSession, getAccessToken} from "./session";

let refreshPromise: Promise<AuthTokens> | null = null;

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
    const token = getAccessToken();

    const response = await send(url, options, token);

    if (response.status !== 401) {
        return response;
    }

    const freshToken = await getFreshToken(token);

    return send(url, options, freshToken);
}

function send(
    url: string,
    options: RequestInit,
    token: string | null
) {
    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, { ...options, headers });
}

async function getFreshToken(oldToken: string | null) {
    const latestToken = getAccessToken();

    if (latestToken && latestToken !== oldToken) {
        return latestToken;
    }

    if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    try {
        const tokens = await refreshPromise;
        return tokens.accessToken;
    } catch {
        clearSession();
        throw new SessionExpiredError();
    }
}
