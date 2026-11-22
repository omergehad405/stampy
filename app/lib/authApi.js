/**
 * Client-side Authentication API helper
 * Integrates with Stampy Backend Authentication
 */

import { API_BASE, getAuthHeaders, setAuthToken, removeAuthToken } from "./apiClient";

export async function apiRegister({ name, email, password, registrationType = "customer" }) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // For HttpOnly cookie support
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

  // Persist token for cross-origin or non-cookie environments
  if (data?.data?.token) {
    setAuthToken(data.data.token);
  }

  return data;
}

export async function apiLogin({ email, password }) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // For HttpOnly cookie support
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password.");
  }

  // Persist token for cross-origin or non-cookie environments
  if (data?.data?.token) {
    setAuthToken(data.data.token);
  }

  return data;
}

export async function apiGetMe() {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Unauthorized session.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function apiUpdateProfile(updates) {
  const response = await fetch(`${API_BASE}/api/auth/profile`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
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
      headers: getAuthHeaders(),
      credentials: "include",
    });
    removeAuthToken();
    return await response.json();
  } catch (error) {
    removeAuthToken();
    console.warn("Logout error:", error);
    return { success: false };
  }
}

export async function apiGetQrCode() {
  const response = await fetch(`${API_BASE}/api/auth/qr-code`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load customer QR identifier.");
  }
  return data;
}

export async function apiForgotPassword({ email }) {
  const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset email. Please try again.");
  }
  return data;
}

export async function apiResetPassword({ token, password, confirmPassword }) {
  const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ token, password, confirmPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password. Please try again.");
  }
  return data;
}
