/**
 * Client-side API helpers for Cafes
 * Talks to /api/cafes
 */

import { API_BASE } from "./apiClient";

const BASE = `${API_BASE}/api/cafes`;

/**
 * Fetch all public active partner cafes
 */
export async function apiGetCafes() {
  const res = await fetch(BASE, {
    cache: "no-store",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch cafes.");
  }
  return data.data?.cafes || [];
}

/**
 * Fetch single cafe by slug or ID
 */
export async function apiGetCafeBySlug(slugOrId) {
  if (!slugOrId) return null;
  const res = await fetch(`${BASE}/${encodeURIComponent(slugOrId)}`, {
    cache: "no-store",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch cafe '${slugOrId}'.`);
  }
  return data.data?.cafe || null;
}
