/**
 * Central API client configuration for Stampy.
 *
 * All client-side fetch helpers import `API_BASE` from here so the backend
 * URL is defined in one place and driven by the NEXT_PUBLIC_API_URL env var.
 *
 * In development this resolves to http://localhost:5000.
 * In production set NEXT_PUBLIC_API_URL to your deployed backend URL.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
