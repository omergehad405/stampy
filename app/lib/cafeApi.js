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

export async function apiGetCafeForScan(slug) {
  if (!slug) throw new Error("Cafe slug is required.");
  const res = await fetch(`${BASE}/${encodeURIComponent(slug)}/scan`, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "This cafe is unavailable.");
    error.status = res.status;
    throw error;
  }
  return data.data?.cafe || null;
}

export async function apiSelfScanCafe(slug, { join = false } = {}) {
  if (!slug) throw new Error("Cafe slug is required.");
  const res = await fetch(`${BASE}/${encodeURIComponent(slug)}/scan`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ join }),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Could not record this scan.");
    error.code = data.code || data.result || "";
    error.status = res.status;
    throw error;
  }
  return data;
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

/**
 * Fetch authenticated customer's full activities (visits, stamps, redemptions) for a cafe
 */
export async function apiGetCustomerActivities(slugOrId) {
  if (!slugOrId) return [];
  const res = await fetch(`${BASE}/${encodeURIComponent(slugOrId)}/activities`, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch customer activities.");
  }
  return data.data?.activities || [];
}
