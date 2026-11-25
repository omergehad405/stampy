"use client";

import { create } from "zustand";
import { registerCafeCatalogEntry } from "../(customer)/cafe/data/cafesCatalog";
import { useDashboardAuthStore } from "./useDashboardAuthStore";
import {
  apiAdminGetCafes,
  apiAdminDeleteCafe,
  apiAdminCreateCafe,
  apiAdminUpdateCafeStatus,
  apiAdminUpdateCafe,
  apiAdminGetCustomers,
  apiAdminDeleteCustomer,
  apiAdminUpdateCustomerStatus,
  apiAdminGetPlans,
  apiAdminGetPlanFeatures,
  apiAdminCreatePlan,
  apiAdminUpdatePlan,
  apiAdminTogglePlanStatus,
  apiAdminAssignPlanToCafe,
  apiAdminDeletePlan,
  apiAdminGetAnnouncements,
  apiAdminGetSettings,
  apiAdminUpdateSettings,
  apiAdminCreateAnnouncement,
  apiAdminUpdateAnnouncement,
  apiAdminToggleAnnouncementPublish,
  apiAdminDeleteAnnouncement,
} from "@/app/lib/adminApi";

// ─── Platform Settings ────────────────────────────────────────────────────

const INITIAL_SETTINGS = {
  platformName: "Notch",
  platformTagline: "Digital Loyalty Cards for Modern Cafes",
  platformEmail: "support@notch.app",
  logoUrl: "",
  allowPublicCafeRegistration: true,
  allowPublicCustomerRegistration: true,
  defaultStampTarget: 10,
  defaultWelcomeBonus: true,
  defaultEnforceDailyVisit: true,
  defaultSubscriptionPlanId: "plan-free",
  maintenanceMode: false,
};

// ─── Zustand Store ────────────────────────────────────────────────────────

export const useAdminStore = create((set, get) => ({
  cafes: [],
  isLoadingCafes: false,
  cafesLoaded: false,
  customers: [],
  isLoadingCustomers: false,
  customersLoaded: false,
  plans: [],
  availableFeatures: [],
  isLoadingPlans: false,
  plansLoaded: false,
  announcements: [],
  isLoadingAnnouncements: false,
  announcementsLoaded: false,
  settings: INITIAL_SETTINGS,
  isLoadingSettings: false,
  settingsLoaded: false,

  // ── Cafe Actions ──────────────────────────────────────────────────────

  fetchCafes: async () => {
    set({ isLoadingCafes: true });
    try {
      const res = await apiAdminGetCafes();
      if (res?.success && Array.isArray(res?.data?.cafes)) {
        set({
          cafes: res.data.cafes,
          isLoadingCafes: false,
          cafesLoaded: true,
        });
        return { success: true, cafes: res.data.cafes };
      }
    } catch (err) {
      console.warn("[Admin Store] Failed to load cafes from server:", err.message);
      set({ isLoadingCafes: false });
      return { success: false, error: err.message };
    }
    set({ isLoadingCafes: false });
    return { success: false };
  },

  createCafe: async ({ name, email, password, phone, ownerName = "", subscriptionPlanId }) => {
    try {
      const res = await apiAdminCreateCafe({
        name,
        email,
        password,
        phone,
        ownerName,
        subscriptionPlanId,
      });

      if (res?.success && res?.data?.cafe) {
        const newCafe = res.data.cafe;
        const { cafes } = get();

        try {
          registerCafeCatalogEntry(newCafe.slug, newCafe);
        } catch (e) {
          console.warn("Could not register in catalog:", e);
        }

        try {
          useDashboardAuthStore.getState().registerCafeAccount({
            email: email.trim().toLowerCase(),
            password: password,
            cafe: newCafe,
            ownerName: ownerName?.trim() || `${name} Manager`,
            phone: phone?.trim() || "",
          });
        } catch (e) {
          console.warn("Could not register in dashboard auth:", e);
        }

        set({
          cafes: [newCafe, ...cafes.filter((c) => c.id !== newCafe.id)],
        });

        return { success: true, cafe: newCafe };
      }
      return { success: false, error: res?.message || "Failed to create cafe." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create cafe." };
    }
  },

  updateCafeStatus: async (cafeId, newStatus) => {
    try {
      const res = await apiAdminUpdateCafeStatus(cafeId, newStatus);
      if (!res?.success) {
        return { success: false, error: res?.message || "Failed to update cafe status." };
      }
    } catch (err) {
      return { success: false, error: err.message || "Failed to update cafe status." };
    }

    const { cafes } = get();
    set({
      cafes: cafes.map((c) =>
        c.id === cafeId ? { ...c, status: newStatus, isActive: newStatus === "active" } : c
      ),
    });
    return { success: true };
  },

  updateCafeInfo: async (cafeId, updatedData) => {
    try {
      const res = await apiAdminUpdateCafe(cafeId, updatedData);
      if (!res?.success) {
        return { success: false, error: res?.message || "Failed to update cafe information." };
      }
    } catch (err) {
      return { success: false, error: err.message || "Failed to update cafe information." };
    }

    const { cafes } = get();
    set({
      cafes: cafes.map((c) => (c.id === cafeId ? { ...c, ...updatedData } : c)),
    });
    return { success: true };
  },

  deleteCafe: async (cafeId) => {
    try {
      const res = await apiAdminDeleteCafe(cafeId);
      if (!res?.success) {
        return { success: false, error: res?.message || "Failed to delete cafe." };
      }

      const { cafes } = get();
      set({
        cafes: cafes.filter((item) => item.id !== cafeId && item._id !== cafeId),
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete cafe." };
    }
  },

  assignPlanToCafe: async (cafeId, planId) => {
    try {
      const res = await apiAdminAssignPlanToCafe({ cafeId, planId });
      if (!res?.success) {
        return { success: false, error: res?.message || "Failed to assign plan." };
      }
    } catch (err) {
      console.warn("Failed to assign plan on server:", err.message);
      return { success: false, error: err.message };
    }

    const { cafes } = get();
    set({
      cafes: cafes.map((c) =>
        c.id === cafeId || c._id === cafeId
          ? {
            ...c,
            subscriptionPlanId: planId,
            subscriptionStatus: "active",
            subscriptionStart: new Date().toISOString().split("T")[0],
            subscriptionExpiry: null,
          }
          : c
      ),
    });
    return { success: true };
  },

  // ── Customer Actions ──────────────────────────────────────────────────

  fetchCustomers: async () => {
    set({ isLoadingCustomers: true });
    try {
      const res = await apiAdminGetCustomers();
      if (res?.success && Array.isArray(res?.data?.customers)) {
        set({
          customers: res.data.customers,
          isLoadingCustomers: false,
          customersLoaded: true,
        });
        return { success: true, customers: res.data.customers };
      }
    } catch (err) {
      console.warn("[Admin Store] Failed to load customers from server:", err.message);
      set({ isLoadingCustomers: false });
      return { success: false, error: err.message };
    }
    set({ isLoadingCustomers: false });
    return { success: false };
  },

  updateCustomerStatus: async (customerId, newStatus) => {
    try {
      const res = await apiAdminUpdateCustomerStatus(customerId, newStatus);
      if (!res?.success) {
        return { success: false, error: res?.message || "Failed to update customer status." };
      }
    } catch (err) {
      return { success: false, error: err.message || "Failed to update customer status." };
    }

    const { customers } = get();
    set({
      customers: customers.map((c) =>
        c.id === customerId
          ? {
            ...c,
            status: newStatus,
            isActive: newStatus === "active",
          }
          : c
      ),
    });
    return { success: true };
  },

  deleteCustomer: async (customerId) => {
    try {
      const res = await apiAdminDeleteCustomer(customerId);
      if (!res?.success) {
        return { success: false, error: res?.message || "Failed to delete customer." };
      }

      const { customers } = get();
      set({
        customers: customers.filter(
          (item) => item.id !== customerId && item._id !== customerId
        ),
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete customer." };
    }
  },

  // ── Plan Actions ──────────────────────────────────────────────────────

  fetchPlans: async () => {
    set({ isLoadingPlans: true });
    try {
      const res = await apiAdminGetPlans();
      if (res?.success && Array.isArray(res?.data?.plans)) {
        set({
          plans: res.data.plans,
          availableFeatures: res.data.availableFeatures || [],
          isLoadingPlans: false,
          plansLoaded: true,
        });
        return { success: true, plans: res.data.plans };
      }
    } catch (err) {
      console.warn("[Admin Store] Failed to load plans from server:", err.message);
      set({ isLoadingPlans: false });
      return { success: false, error: err.message };
    }
    set({ isLoadingPlans: false });
    return { success: false };
  },

  createPlan: async (planData) => {
    try {
      const res = await apiAdminCreatePlan(planData);
      if (res?.success && res?.data?.plan) {
        const newPlan = res.data.plan;
        const { plans } = get();
        set({ plans: [...plans, newPlan] });
        return { success: true, plan: newPlan };
      }
      return { success: false, error: res?.message || "Failed to create plan." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create plan." };
    }
  },

  updatePlan: async (planId, updatedData) => {
    try {
      const res = await apiAdminUpdatePlan(planId, updatedData);
      if (res?.success && res?.data?.plan) {
        const updated = res.data.plan;
        const { plans } = get();
        set({
          plans: plans.map((p) => (p.id === planId || p._id === planId ? updated : p)),
        });
        return { success: true, plan: updated };
      }
      return { success: false, error: res?.message || "Failed to update plan." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to update plan." };
    }
  },

  togglePlanStatus: async (planId) => {
    const { plans } = get();
    const current = plans.find((p) => p.id === planId || p._id === planId);
    const newActiveState = current ? !current.isActive : true;

    try {
      const res = await apiAdminTogglePlanStatus(planId, newActiveState);
      if (res?.success && res?.data?.plan) {
        const updated = res.data.plan;
        set({
          plans: plans.map((p) => (p.id === planId || p._id === planId ? updated : p)),
        });
        return { success: true, plan: updated };
      }
      return { success: false, error: res?.message || "Failed to toggle plan status." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to toggle plan status." };
    }
  },

  deletePlan: async (planId) => {
    try {
      const res = await apiAdminDeletePlan(planId);
      if (res?.success) {
        const { plans } = get();
        set({
          plans: plans.filter((p) => p.id !== planId && p._id !== planId),
        });
        return { success: true };
      }
      return { success: false, error: res?.message || "Failed to delete plan." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete plan." };
    }
  },

  // ── Announcement Actions ──────────────────────────────────────────────

  fetchAnnouncements: async () => {
    set({ isLoadingAnnouncements: true });
    try {
      const res = await apiAdminGetAnnouncements();
      if (res?.success && Array.isArray(res?.data?.announcements)) {
        set({
          announcements: res.data.announcements,
          isLoadingAnnouncements: false,
          announcementsLoaded: true,
        });
        return { success: true, announcements: res.data.announcements };
      }
    } catch (err) {
      console.warn("[Admin Store] Failed to load announcements from server:", err.message);
      set({ isLoadingAnnouncements: false });
      return { success: false, error: err.message };
    }
    set({ isLoadingAnnouncements: false });
    return { success: false };
  },

  createAnnouncement: async (data) => {
    try {
      const res = await apiAdminCreateAnnouncement(data);
      if (res?.success && res?.data?.announcement) {
        const newAnn = res.data.announcement;
        const { announcements } = get();
        set({ announcements: [newAnn, ...announcements] });
        return { success: true, announcement: newAnn };
      }
      return { success: false, error: res?.message || "Failed to create announcement." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create announcement." };
    }
  },

  updateAnnouncement: async (annId, updatedData) => {
    try {
      const res = await apiAdminUpdateAnnouncement(annId, updatedData);
      if (res?.success && res?.data?.announcement) {
        const updated = res.data.announcement;
        const { announcements } = get();
        set({
          announcements: announcements.map((a) =>
            a.id === annId || a._id === annId ? updated : a
          ),
        });
        return { success: true, announcement: updated };
      }
      return { success: false, error: res?.message || "Failed to update announcement." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to update announcement." };
    }
  },

  deleteAnnouncement: async (annId) => {
    try {
      const res = await apiAdminDeleteAnnouncement(annId);
      if (res?.success) {
        const { announcements } = get();
        set({
          announcements: announcements.filter((a) => a.id !== annId && a._id !== annId),
        });
        return { success: true };
      }
      return { success: false, error: res?.message || "Failed to delete announcement." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete announcement." };
    }
  },

  toggleAnnouncementPublished: async (annId) => {
    const { announcements } = get();
    const current = announcements.find((a) => a.id === annId || a._id === annId);
    const newStatus = current ? !current.isPublished : true;

    try {
      const res = await apiAdminToggleAnnouncementPublish(annId, newStatus);
      if (res?.success && res?.data?.announcement) {
        const updated = res.data.announcement;
        set({
          announcements: announcements.map((a) =>
            a.id === annId || a._id === annId ? updated : a
          ),
        });
        return { success: true, announcement: updated };
      }
      return {
        success: false,
        error: res?.message || "Failed to toggle announcement publish status.",
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to toggle announcement publish status.",
      };
    }
  },

  // ── Settings ──────────────────────────────────────────────────────────

  fetchSettings: async () => {
    set({ isLoadingSettings: true });
    try {
      const res = await apiAdminGetSettings();
      if (res?.success && res?.data?.settings) {
        set({
          settings: { ...INITIAL_SETTINGS, ...res.data.settings },
          isLoadingSettings: false,
          settingsLoaded: true,
        });
        return { success: true, settings: res.data.settings };
      }
      throw new Error(res?.message || "Platform settings were not returned.");
    } catch (err) {
      set({ isLoadingSettings: false });
      return { success: false, error: err.message || "Failed to load platform settings." };
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const res = await apiAdminUpdateSettings(newSettings);
      if (!res?.success || !res?.data?.settings) {
        return { success: false, error: res?.message || "Failed to save platform settings." };
      }
      set({ settings: { ...INITIAL_SETTINGS, ...res.data.settings } });
      return { success: true, settings: res.data.settings };
    } catch (err) {
      return { success: false, error: err.message || "Failed to save platform settings." };
    }
  },
}));
