/**
 * Client-side Dashboard API helpers — Rewards
 * Talks to /api/dashboard/rewards
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
