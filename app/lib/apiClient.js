/**
 * Central API client configuration for Stampy.
 *
 * All client-side fetch helpers import `API_BASE` and auth token utilities
 * from here so backend connectivity and session persistence work seamlessly
 * across same-origin and cross-origin environments (e.g. Vercel -> Render).
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

const TOKEN_KEY = "stampy_auth_token";

/**
 * Retrieve saved JWT token from localStorage (browser-only)
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Save JWT token in localStorage (browser-only)
 */
export function setAuthToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.warn("[Auth] Failed to set auth token in storage:", err);
  }
}

/**
 * Remove JWT token from localStorage (browser-only)
 */
export function removeAuthToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn("[Auth] Failed to remove auth token from storage:", err);
  }
}

/**
 * Merge standard headers with Authorization: Bearer <token> if token exists
 */
export function getAuthHeaders(customHeaders = {}) {
  const token = getAuthToken();
  const headers = { ...customHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
