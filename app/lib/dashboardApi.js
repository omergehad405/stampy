/**
 * Client-side Dashboard API helpers — Rewards & Cafe Profile & Customers
 * Talks to /api/dashboard
 */

import { API_BASE, getAuthHeaders } from "./apiClient";

const BASE = `${API_BASE}/api/dashboard/rewards`;

export async function apiGetRewards({ status } = {}) {
  const url = status ? `${BASE}?status=${status}` : BASE;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch rewards.");
  return data;
}

export async function apiCreateReward(rewardData) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(rewardData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create reward.");
  return data;
}

export async function apiUpdateReward(id, updates) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update reward.");
  return data;
}

export async function apiToggleRewardStatus(id) {
  const res = await fetch(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to toggle reward status.");
  return data;
}

export async function apiDeleteReward(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete reward.");
  return data;
}

/**
 * Cafe Profile API endpoints
 * Talks to /api/dashboard/cafe
 */
const CAFE_BASE = `${API_BASE}/api/dashboard/cafe`;

export async function apiGetCafeProfile() {
  const res = await fetch(CAFE_BASE, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch cafe profile.");
  return data;
}

export async function apiUpdateCafeProfile(profileData) {
  const res = await fetch(CAFE_BASE, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update cafe profile.");
  return data;
}

/**
 * Cafe Customers API endpoints
 * Talks to /api/dashboard/cafe/customers
 */
export async function apiGetCafeCustomers(cafeId = null) {
  const url = cafeId
    ? `${CAFE_BASE}/customers?cafeId=${encodeURIComponent(cafeId)}`
    : `${CAFE_BASE}/customers`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch cafe customers.");
  return data.data?.customers || [];
}

/**
 * Manually adjust a customer's stamps from the cafe dashboard
 */
export async function apiUpdateCustomerStamps(customerId, { stamps, lifetimeStamps, reason } = {}) {
  const res = await fetch(`${CAFE_BASE}/customers/${customerId}/stamps`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ stamps, lifetimeStamps, reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update customer stamps.");
  return data;
}

/**
 * Verify scanned customer QR code against the barista's cafe
 */
export async function apiScanCustomer(code) {
  const res = await fetch(`${CAFE_BASE}/scan`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to scan customer code.");
  return data;
}

/**
 * Award stamps to a customer after scanning
 */
export async function apiAwardCustomerStamp({ customerId, stampsCount = 1, note = "" }) {
  const res = await fetch(`${CAFE_BASE}/award-stamp`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ customerId, stampsCount, note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to award stamp.");
  return data;
}
