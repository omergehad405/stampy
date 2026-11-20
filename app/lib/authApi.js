/**
 * Client-side Authentication API helper
 * Integrates with Stampy Phase 1 Backend Authentication
 */

import { API_BASE } from "./apiClient";

export async function apiRegister({ name, email, password, registrationType = "customer" }) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Required for HttpOnly cookies
    body: JSON.stringify({
      name,
      email,
      password,
      registrationType,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed. Please check your details.");
  }
  return data;
}

export async function apiLogin({ email, password }) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Required for HttpOnly cookies
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password.");
  }
  return data;
}

export async function apiGetMe() {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Unauthorized session.");
  }
  return data;
}

export async function apiUpdateProfile(updates) {
  const response = await fetch(`${API_BASE}/api/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile.");
  }
  return data;
}

export async function apiLogout() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.warn("Logout error:", error);
    return { success: false };
  }
}

export async function apiGetQrCode() {
  const response = await fetch(`${API_BASE}/api/auth/qr-code`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load customer QR identifier.");
  }
  return data;
}
