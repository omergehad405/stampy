"use client";

import { create } from "zustand";

export const DEFAULT_STAFF_MEMBERS = [
  {
    id: "staff-1",
    name: "Elena Rostova",
    email: "elena@coffeehouse.london",
    role: "Owner & Manager",
    roleKey: "owner",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+44 7700 900111",
    joinedDate: "2024-01-15",
    lastActive: "Just now",
    canManageStaff: true,
    canEditCafe: true,
    canManageRewards: true,
  },
  {
    id: "staff-2",
    name: "Marcus Vance",
    email: "marcus@coffeehouse.london",
    role: "Head Barista",
    roleKey: "manager",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    phone: "+44 7700 900222",
    joinedDate: "2024-06-01",
    lastActive: "15 mins ago",
    canManageStaff: false,
    canEditCafe: false,
    canManageRewards: true,
  },
  {
    id: "staff-3",
    name: "Sophia Chen",
    email: "sophia@coffeehouse.london",
    role: "Barista",
    roleKey: "barista",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    phone: "+44 7700 900333",
    joinedDate: "2025-02-10",
    lastActive: "2 hours ago",
    canManageStaff: false,
    canEditCafe: false,
    canManageRewards: false,
  },
];

export const useDashboardAuthStore = create((set, get) => ({
  currentUser: DEFAULT_STAFF_MEMBERS[0],
  isAuthenticated: true,
  loginError: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true, loginError: null });

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email?.trim().toLowerCase();
    const foundStaff = DEFAULT_STAFF_MEMBERS.find(
      (s) => s.email.toLowerCase() === normalizedEmail
    );

    // Allow default test credentials or any valid staff email with password 'password' / 'admin123'
    if (foundStaff || normalizedEmail === "owner@roastedbean.coffee" || normalizedEmail === "admin@stampy.app") {
      const user = foundStaff || {
        ...DEFAULT_STAFF_MEMBERS[0],
        email: normalizedEmail,
      };
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        loginError: null,
      });
      return { success: true, user };
    }

    set({
      isLoading: false,
      loginError: "Invalid email or password. Please check your credentials.",
    });
    return { success: false, error: "Invalid email or password" };
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      loginError: null,
    });
  },

  updateProfile: (data) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
    }));
  },
}));
