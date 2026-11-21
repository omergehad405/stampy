/**
 * Client-side API helpers for Cafes
 * Talks to /api/cafes
 */

import { API_BASE, getAuthHeaders } from "./apiClient";

const BASE = `${API_BASE}/api/cafes`;

/**
 * Fetch all public active partner cafes
 */
export async function apiGetCafes() {
  const res = await fetch(BASE, {
    cache: "no-store",
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch cafe '${slugOrId}'.`);
  }
  return data.data?.cafe || null;
}

/**
 * Join a cafe loyalty program
 */
export async function apiJoinCafe(cafeIdOrSlug) {
  if (!cafeIdOrSlug) throw new Error("Cafe identifier is required.");
  const res = await fetch(`${BASE}/${encodeURIComponent(cafeIdOrSlug)}/join`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to join cafe loyalty program.");
  }
  return data;
}

/**
 * Leave a cafe loyalty program
 */
export async function apiLeaveCafe(cafeIdOrSlug) {
  if (!cafeIdOrSlug) throw new Error("Cafe identifier is required.");
  const res = await fetch(`${BASE}/${encodeURIComponent(cafeIdOrSlug)}/leave`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to leave cafe loyalty program.");
  }
  return data;
}

/**
 * Fetch authenticated customer's enrolled cafe memberships
 */
export async function apiGetMyMemberships() {
  const res = await fetch(`${BASE}/my/memberships`, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch memberships.");
  }
  return data.data?.memberships || [];
}

/**
 * Redeem a reward for a cafe
 */
export async function apiRedeemReward({ cafeSlug, cafeId, rewardId }) {
  const identifier = cafeId || cafeSlug;
  if (!identifier || !rewardId) {
    throw new Error("Cafe identifier and reward ID are required.");
  }
  const res = await fetch(`${BASE}/${encodeURIComponent(identifier)}/redeem`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include",
    body: JSON.stringify({ rewardId, cafeSlug, cafeId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to redeem reward.");
  }
  return data;
}

/**
 * Fetch customer's redemptions for a cafe
 */
export async function apiGetMyRedemptions(cafeSlugOrId = "") {
  const url = cafeSlugOrId
    ? `${BASE}/my/redemptions?cafeSlug=${encodeURIComponent(cafeSlugOrId)}`
    : `${BASE}/my/redemptions`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch redemptions.");
  }
  return data.data?.redemptions || [];
}
