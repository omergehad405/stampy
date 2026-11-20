"use client";

import { create } from "zustand";
import { apiLogin, apiGetMe, apiLogout, apiUpdateProfile } from "@/app/lib/authApi";

export const useAdminAuthStore = create((set, get) => ({
  currentAdmin: null,
  isAuthenticated: false,
  loginError: null,
  isLoading: false,

  // Check current session from backend cookie
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
          avatar:
            user.avatar ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          joinedDate: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "2026-01-01",
          lastActive: "Just now",
        };
        set({ currentAdmin: adminObj, isAuthenticated: true });
        return { success: true, admin: adminObj };
      }
    } catch {
      // Session expired or not logged in
    }
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
          set({
            isLoading: false,
            loginError: "Access denied. Only Super Admins can access this area.",
          });
          return {
            success: false,
            error: "Access denied. Only Super Admins can access this area.",
          };
        }

        const adminObj = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: "Super Admin",
          roleKey: "SUPER_ADMIN",
          avatar:
            user.avatar ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          joinedDate: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "2026-01-01",
          lastActive: "Just now",
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
    } catch (err) {
      console.warn("Failed to update admin profile in MongoDB:", err);
    }
    // Fallback optimistic update
    set((state) => ({
      currentAdmin: state.currentAdmin
        ? { ...state.currentAdmin, ...data }
        : null,
    }));
    return { success: true };
  },

  clearError: () => set({ loginError: null }),
}));
