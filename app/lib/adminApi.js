/**
 * Client-side Admin API helper
 * Integrates with Stampy Admin Backend Endpoints
 */

import { API_BASE } from "./apiClient";

export async function apiAdminGetCafes() {
  const response = await fetch(`${API_BASE}/api/admin/cafes`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch cafes.");
  }
  return data;
}

export async function apiAdminCreateCafe({
  name,
  ownerName,
  email,
  password,
  phone,
  subscriptionPlanId,
}) {
  const response = await fetch(`${API_BASE}/api/admin/cafes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      ownerName,
      email,
      password,
      phone,
      subscriptionPlanId,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create cafe.");
  }
  return data;
}

export async function apiAdminUpdateCafeStatus(cafeId, status) {
  const response = await fetch(`${API_BASE}/api/admin/cafes/${cafeId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update cafe status.");
  }
  return data;
}

export async function apiAdminUpdateCafe(cafeId, updates) {
  const response = await fetch(`${API_BASE}/api/admin/cafes/${cafeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update cafe.");
  }
  return data;
}

export async function apiAdminGetCustomers() {
  const response = await fetch(`${API_BASE}/api/admin/customers`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch customers.");
  }
  return data;
}

export async function apiAdminUpdateCustomerStatus(customerId, status) {
  const response = await fetch(`${API_BASE}/api/admin/customers/${customerId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update customer status.");
  }
  return data;
}

export async function apiAdminGetPlans() {
  const response = await fetch(`${API_BASE}/api/admin/plans`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch subscription plans.");
  }
  return data;
}

export async function apiAdminGetPlanFeatures() {
  const response = await fetch(`${API_BASE}/api/admin/plans/features`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch plan features.");
  }
  return data;
}

export async function apiAdminCreatePlan(planData) {
  const response = await fetch(`${API_BASE}/api/admin/plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(planData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create subscription plan.");
  }
  return data;
}

export async function apiAdminUpdatePlan(planId, updates) {
  const response = await fetch(`${API_BASE}/api/admin/plans/${planId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update subscription plan.");
  }
  return data;
}

export async function apiAdminTogglePlanStatus(planId, isActive) {
  const response = await fetch(`${API_BASE}/api/admin/plans/${planId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ isActive }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle plan status.");
  }
  return data;
}

export async function apiAdminAssignPlanToCafe({ cafeId, planId }) {
  const response = await fetch(`${API_BASE}/api/admin/plans/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ cafeId, planId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to assign plan to cafe.");
  }
  return data;
}

export async function apiAdminDeletePlan(planId) {
  const response = await fetch(`${API_BASE}/api/admin/plans/${planId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete subscription plan.");
  }
  return data;
}

// ─── Announcement APIs ──────────────────────────────────────────────────────

export async function apiAdminGetAnnouncements() {
  const response = await fetch(`${API_BASE}/api/admin/announcements`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch announcements.");
  }
  return data;
}

export async function apiAdminCreateAnnouncement(payload) {
  const response = await fetch(`${API_BASE}/api/admin/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create announcement.");
  }
  return data;
}

export async function apiAdminUpdateAnnouncement(id, payload) {
  const response = await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update announcement.");
  }
  return data;
}

export async function apiAdminToggleAnnouncementPublish(id, isPublished) {
  const response = await fetch(`${API_BASE}/api/admin/announcements/${id}/publish`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ isPublished }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle announcement publish status.");
  }
  return data;
}

export async function apiAdminDeleteAnnouncement(id) {
  const response = await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete announcement.");
  }
  return data;
}

export async function apiGetActiveAnnouncements() {
  const response = await fetch(`${API_BASE}/api/announcements/active`, {
    method: "GET",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch active announcements.");
  }
  return data;
}
