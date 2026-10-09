import { AuthTokens, getRefreshToken, saveTokens } from "./session";

export async function refreshAccessToken(): Promise<AuthTokens> {
    const refreshToken = getRefreshToken();

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

    const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    };

    saveTokens(tokens);

    return tokens;
}
