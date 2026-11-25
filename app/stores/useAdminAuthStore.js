"use client";

import { create } from "zustand";
import { apiLogin, apiGetMe, apiLogout, apiUpdateProfile } from "@/app/lib/authApi";
import { setAuthToken, removeAuthToken } from "@/app/lib/apiClient";

export const useAdminAuthStore = create((set, get) => ({
  currentAdmin: null,
  isAuthenticated: false,
  loginError: null,
  isLoading: false,

  // Check current session from backend using Bearer token / cookie
  checkAuth: async () => {
    try {
      const data = await apiGetMe();
      if (data.success && data.data?.user?.role === "admin") {
        const user = data.data.user;
        const adminObj = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: "Super Admin",
          roleKey: "SUPER_ADMIN",
          avatar: user.avatar || "",
          joinedDate: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "",
        };
        set({ currentAdmin: adminObj, isAuthenticated: true, loginError: null });
        return { success: true, admin: adminObj };
      }
    } catch (err) {
      // Session expired or not logged in
    }
    set({ currentAdmin: null, isAuthenticated: false });
    return { success: false };
  },

  login: async (email, password) => {
    set({ isLoading: true, loginError: null });

    try {
      const res = await apiLogin({ email, password });
      if (res.success && res.data?.user) {
        const user = res.data.user;

        // Verify that this account is an administrator
        if (user.role !== "admin") {
          removeAuthToken();
          set({
            isLoading: false,
            loginError: "Access denied. Only Super Admins can access this area.",
            isAuthenticated: false,
            currentAdmin: null,
          });
          return {
            success: false,
            error: "Access denied. Only Super Admins can access this area.",
          };
        }

        if (res.data?.token) {
          setAuthToken(res.data.token);
        }

        const adminObj = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: "Super Admin",
          roleKey: "SUPER_ADMIN",
          avatar: user.avatar || "",
          joinedDate: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "",
        };

        set({
          currentAdmin: adminObj,
          isAuthenticated: true,
          isLoading: false,
          loginError: null,
        });

        return { success: true, admin: adminObj };
      }
    } catch (err) {
      const errorMessage =
        err.message || "Invalid credentials or insufficient permissions.";
      set({
        isLoading: false,
        loginError: errorMessage,
        isAuthenticated: false,
        currentAdmin: null,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  logout: async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    removeAuthToken();
    set({
      currentAdmin: null,
      isAuthenticated: false,
      loginError: null,
    });
  },

  updateProfile: async (data) => {
    try {
      const res = await apiUpdateProfile(data);
      if (res?.success && res?.data?.user) {
        const user = res.data.user;
        set((state) => ({
          currentAdmin: state.currentAdmin
            ? {
                ...state.currentAdmin,
                name: user.name,
                email: user.email,
                avatar: user.avatar || state.currentAdmin.avatar,
              }
            : null,
        }));
        return { success: true };
      }
      return { success: false, error: res?.message || "Failed to update profile." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to update profile." };
    }
  },

  clearError: () => set({ loginError: null }),
}));
