"use client";

import { create } from "zustand";
import { apiLogin, apiGetMe, apiLogout } from "@/app/lib/authApi";
import { removeAuthToken } from "@/app/lib/apiClient";
import { useDashboardStore } from "./useDashboardStore";

export const REGISTERED_CAFE_ACCOUNTS = [];

function mapBackendUserToStaff(user) {
  const isOwner = user.role === "cafeOwner" || user.role === "admin";
  const isManager = user.role === "cafeManager";
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    backendRole: user.role,
    role:
      user.role === "cafeOwner"
        ? "Owner & Manager"
        : user.role === "cafeManager"
        ? "Cafe Manager"
        : user.role === "cafeBarista"
        ? "Barista"
        : "Platform Admin",
    roleKey: isOwner ? "owner" : isManager ? "manager" : "barista",
    status: user.isActive ? "active" : "inactive",
    avatar:
      user.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: user.phone || "",
    joinedDate: user.createdAt
      ? new Date(user.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    lastActive: "Just now",
    canManageStaff: isOwner,
    canEditCafe: isOwner,
    canManageRewards: isOwner || isManager,
    cafeId: user.cafeId || null,
  };
}

export const useDashboardAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  loginError: null,
  isLoading: false,
  isCheckingSession: true,

  // Check current session from backend cookie
  checkAuth: async () => {
    set({ isCheckingSession: true });
    try {
      const data = await apiGetMe();
      if (data.success && data.data?.user) {
        const u = data.data.user;
        if (["cafeOwner", "cafeManager", "cafeBarista", "admin"].includes(u.role)) {
          const staffUser = mapBackendUserToStaff(u);
          if (data.data?.cafe) {
            useDashboardStore.getState().setCafe(data.data.cafe);
          }
          set({
            currentUser: staffUser,
            isAuthenticated: true,
            isCheckingSession: false,
            loginError: null,
          });
          return { success: true, user: staffUser, cafe: data.data?.cafe };
        }
      }
    } catch {
      // Session expired or not logged in
      removeAuthToken();
    }
    set({
      currentUser: null,
      isAuthenticated: false,
      isCheckingSession: false,
    });
    return { success: false };
  },

  registerCafeAccount: ({ email, password, cafe, ownerName, phone }) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const staffUser = {
      id: `staff-${Date.now()}`,
      name: ownerName || `${cafe.name} Manager`,
      email: normalizedEmail,
      role: "Owner & Manager",
      roleKey: "owner",
      status: "active",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      phone: phone || "",
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      canManageStaff: true,
      canEditCafe: true,
      canManageRewards: true,
      cafeId: cafe.id,
      cafeSlug: cafe.slug,
    };

    const newAccount = {
      email: normalizedEmail,
      password: password,
      cafe,
      staffUser,
    };

    const existingIdx = REGISTERED_CAFE_ACCOUNTS.findIndex(
      (a) => a.email === normalizedEmail
    );
    if (existingIdx >= 0) {
      REGISTERED_CAFE_ACCOUNTS[existingIdx] = newAccount;
    } else {
      REGISTERED_CAFE_ACCOUNTS.push(newAccount);
    }

    return { success: true, account: newAccount };
  },

  login: async (email, password) => {
    set({ isLoading: true, loginError: null });

    const normalizedEmail = email?.trim().toLowerCase();

    // Authenticate against server API
    try {
      const res = await apiLogin({ email: normalizedEmail, password });
      if (res.success && res.data?.user) {
        const user = res.data.user;

        // Verify that account is staff, owner, or admin
        if (user.role === "user") {
          const err =
            "This portal is reserved for cafe staff and owners. Please use the customer app.";
          set({ isLoading: false, loginError: err, isAuthenticated: false });
          return { success: false, error: err };
        }

        const staffUser = mapBackendUserToStaff(user);

        if (res.data?.cafe) {
          useDashboardStore.getState().setCafe(res.data.cafe);
        }

        set({
          currentUser: staffUser,
          isAuthenticated: true,
          isLoading: false,
          loginError: null,
          isCheckingSession: false,
        });

        return { success: true, user: staffUser, cafe: res.data?.cafe };
      }

      throw new Error(res.message || "Login failed");
    } catch (apiErr) {
      const message =
        apiErr.message || "Invalid email or password. Please check your credentials.";
      set({
        isLoading: false,
        loginError: message,
        isAuthenticated: false,
        isCheckingSession: false,
      });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    set({
      currentUser: null,
      isAuthenticated: false,
      loginError: null,
      isCheckingSession: false,
    });
  },

  updateProfile: (data) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
    }));
  },
}));
