const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USERNAME_KEY = "username";

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUsername() {
    return localStorage.getItem(USERNAME_KEY) ?? "";
}

export function saveTokens(tokens: AuthTokens) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function saveSession(tokens: AuthTokens, username: string) {
    saveTokens(tokens);
    localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);

    window.dispatchEvent(new Event("storage"));
}
