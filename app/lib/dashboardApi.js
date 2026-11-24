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

export async function apiGetCafeCustomersPage({
  page = 1,
  search = "",
  status = "all",
  sortBy = "stamps",
} = {}) {
  const query = new URLSearchParams({
    page: String(page),
    search,
    status,
    sortBy,
  });
  const res = await fetch(`${CAFE_BASE}/customers?${query.toString()}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch cafe customers.");
  }
  return {
    customers: data.data?.customers || [],
    pagination: data.data?.pagination,
  };
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

/**
 * Fulfill/confirm a reward redemption by barcode/QR code
 */
export async function apiFulfillRewardRedemption({ code }) {
  const res = await fetch(`${CAFE_BASE}/fulfill-redemption`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fulfill reward redemption.");
  return data;
}

/**
 * Fetch real activity history log for the staff cafe
 */
export async function apiGetCafeActivities() {
  const res = await fetch(`${CAFE_BASE}/activities`, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch activities.");
  return data.data?.activities || [];
}

export async function apiGetDashboardAnalytics({ range = "30d", atRiskDays = 14 } = {}) {
  const query = new URLSearchParams({
    range,
    atRiskDays: String(atRiskDays),
  });
  const res = await fetch(
    `${API_BASE}/api/dashboard/analytics?${query.toString()}`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Unable to load analytics.");
    error.status = res.status;
    throw error;
  }
  return data.data;
}

const NOTIFICATIONS_BASE = `${API_BASE}/api/dashboard/notifications/email`;

async function requestNotificationApi(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: getAuthHeaders(options.headers || {}),
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to connect to the server. Please try again.");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unable to complete the request. Please try again.");
  }
  if (!res.ok) {
    const error = new Error(data.message || "Unable to complete the request.");
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function apiGetNotificationRecipientCount() {
  return requestNotificationApi(`${NOTIFICATIONS_BASE}/recipients`, {
    cache: "no-store",
  });
}

export async function apiGetNotificationCampaigns() {
  return requestNotificationApi(`${NOTIFICATIONS_BASE}/campaigns`, {
    cache: "no-store",
  });
}

export async function apiGetNotificationCampaignStatus(campaignId) {
  return requestNotificationApi(
    `${NOTIFICATIONS_BASE}/campaigns/${encodeURIComponent(campaignId)}`,
    { cache: "no-store" }
  );
}

export async function apiSendNotificationCampaign({ subject, body }) {
  return requestNotificationApi(NOTIFICATIONS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, body }),
  });
}

/**
 * Staff management API endpoints
 */
export async function apiGetCafeStaff() {
  const res = await fetch(`${CAFE_BASE}/staff`, {
    cache: "no-store",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch staff members.");
  return data.data || [];
}

export async function apiCreateCafeStaff(staffData) {
  const res = await fetch(`${CAFE_BASE}/staff`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(staffData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create staff member.");
  return data;
}

export async function apiUpdateCafeStaff(id, updates) {
  const res = await fetch(`${CAFE_BASE}/staff/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update staff member.");
  return data;
}

export async function apiDeleteCafeStaff(id) {
  const res = await fetch(`${CAFE_BASE}/staff/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete staff member.");
  return data;
}
