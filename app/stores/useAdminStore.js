"use client";

import { create } from "zustand";
import { CAFES_CATALOG, registerCafeCatalogEntry } from "../(customer)/cafe/data/cafesCatalog";
import { INITIAL_CUSTOMERS, INITIAL_DASHBOARD_ACTIVITIES } from "./useDashboardStore";
import { INITIAL_REDEMPTIONS } from "./useLoyaltyStore";
import { useDashboardAuthStore } from "./useDashboardAuthStore";
import {
  apiAdminGetCafes,
  apiAdminCreateCafe,
  apiAdminUpdateCafeStatus,
  apiAdminUpdateCafe,
  apiAdminGetCustomers,
  apiAdminUpdateCustomerStatus,
  apiAdminGetPlans,
  apiAdminGetPlanFeatures,
  apiAdminCreatePlan,
  apiAdminUpdatePlan,
  apiAdminTogglePlanStatus,
  apiAdminAssignPlanToCafe,
  apiAdminDeletePlan,
  apiAdminGetAnnouncements,
  apiAdminCreateAnnouncement,
  apiAdminUpdateAnnouncement,
  apiAdminToggleAnnouncementPublish,
  apiAdminDeleteAnnouncement,
} from "@/app/lib/adminApi";

// ─── Subscription Plans (Loaded dynamically from MongoDB backend) ───────────

export const SUBSCRIPTION_PLANS = [];

// ─── Enriched Cafes (Loaded dynamically from MongoDB backend) ───────────────

export const ADMIN_CAFES = [];

// ─── Global Customers (Loaded dynamically from MongoDB backend) ────────────

export const ADMIN_CUSTOMERS = [];

// ─── Platform-wide Activities ─────────────────────────────────────────────

export const ADMIN_ACTIVITIES = [
  ...INITIAL_DASHBOARD_ACTIVITIES.map((a) => ({ ...a, cafeName: "Coffee House", cafeSlug: "coffee-house" })),
  {
    id: "act-admin-1",
    type: "stamp",
    title: "Stamp Issued (+1)",
    customerName: "Noah Bennett",
    customerId: "cust-glob-2",
    cafeName: "The Roasted Bean & Co.",
    cafeSlug: "the-roasted-bean",
    staffName: "James Whitfield",
    timestamp: "2026-11-18T14:00:00.000Z",
    formattedDate: "Today • 2:00 PM",
    stampsDelta: 1,
    note: "Nitro cold brew visit",
  },
  {
    id: "act-admin-2",
    type: "redemption",
    title: "Reward Redeemed: Fresh Butter Croissant",
    customerName: "Isabelle Martin",
    customerId: "cust-glob-1",
    cafeName: "Bread House & Bakery",
    cafeSlug: "bread-house",
    staffName: "Pierre Moreau",
    timestamp: "2026-11-18T10:30:00.000Z",
    formattedDate: "Today • 10:30 AM",
    stampsDelta: -4,
    note: "Reward redemption: croissant",
  },
  {
    id: "act-admin-3",
    type: "join",
    title: "New Customer Joined",
    customerName: "Fatima Al-Hassan",
    customerId: "cust-glob-3",
    cafeName: "The Roasted Bean & Co.",
    cafeSlug: "the-roasted-bean",
    staffName: "System",
    timestamp: "2026-11-10T09:15:00.000Z",
    formattedDate: "Nov 10 • 9:15 AM",
    stampsDelta: 1,
    note: "Welcome bonus stamp credited",
  },
];

// ─── Announcements (Loaded dynamically from MongoDB backend) ──────────────

export const INITIAL_ANNOUNCEMENTS = [];

// ─── Platform Settings ────────────────────────────────────────────────────

const INITIAL_SETTINGS = {
  platformName: "Stampy",
  platformTagline: "Digital Loyalty Cards for Modern Cafes",
  platformEmail: "support@stampy.app",
  logoUrl: "",
  allowPublicCafeRegistration: true,
  allowPublicCustomerRegistration: true,
  defaultStampTarget: 10,
  defaultWelcomeBonus: true,
  defaultEnforceDailyVisit: true,
  defaultSubscriptionPlanId: "plan-free",
  maintenanceMode: false,
};

// ─── Audit Log ───────────────────────────────────────────────────────────

const INITIAL_AUDIT_LOG = [
  {
    id: "audit-1",
    action: "CAFE_STATUS_CHANGED",
    description: "Cafe 'Urban Grind' status changed from active → suspended",
    adminName: "Platform Admin",
    timestamp: "2026-10-30T14:22:00.000Z",
    metadata: { cafeId: "cafe-suspended-01", from: "active", to: "suspended" },
  },
  {
    id: "audit-2",
    action: "PLAN_ASSIGNED",
    description: "Subscription plan 'Starter' assigned to 'Coffee House'",
    adminName: "Platform Admin",
    timestamp: "2026-01-15T10:00:00.000Z",
    metadata: { cafeId: "cafe-coffee-house", planId: "plan-starter" },
  },
];

// ─── Zustand Store ────────────────────────────────────────────────────────

export const useAdminStore = create((set, get) => ({
  cafes: [],
  isLoadingCafes: false,
  cafesLoaded: false,
  customers: [],
  isLoadingCustomers: false,
  customersLoaded: false,
  activities: ADMIN_ACTIVITIES,
  plans: [],
  availableFeatures: [],
  isLoadingPlans: false,
  plansLoaded: false,
  announcements: [],
  isLoadingAnnouncements: false,
  announcementsLoaded: false,
  settings: INITIAL_SETTINGS,
  auditLog: INITIAL_AUDIT_LOG,

  // ── Computed helpers ──────────────────────────────────────────────────

  getTotalStats: () => {
    const { cafes, customers, activities } = get();
    const totalCafes = cafes.length;
    const activeCafes = cafes.filter((c) => c.status === "active").length;
    const pendingCafes = cafes.filter((c) => c.status === "pending").length;
    const totalCustomers = customers.length;
    const totalStampsIssued = activities
      .filter((a) => a.type === "stamp")
      .reduce((acc, a) => acc + (a.stampsDelta || 0), 0);
    const totalRewardsRedeemed = activities.filter((a) => a.type === "redemption").length;
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const newCafesThisMonth = cafes.filter((c) =>
      c.registrationDate && c.registrationDate.startsWith(thisMonth)
    ).length;
    const newCustomersThisMonth = customers.filter((c) =>
      c.registeredDate && c.registeredDate.startsWith(thisMonth)
    ).length;
    return {
      totalCafes,
      activeCafes,
      pendingCafes,
      totalCustomers,
      totalStampsIssued,
      totalRewardsRedeemed,
      newCafesThisMonth,
      newCustomersThisMonth,
    };
  },

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

  createCafe: async (
    { name, email, password, phone, ownerName = "", subscriptionPlanId },
    adminName = "Platform Admin"
  ) => {
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
        const { cafes, auditLog } = get();

        const newAuditEntry = {
          id: `audit-${Date.now()}`,
          action: "CAFE_CREATED",
          description: `New cafe '${newCafe.name}' registered by ${adminName}. Staff login: ${email}`,
          adminName,
          timestamp: new Date().toISOString(),
          metadata: { cafeId: newCafe.id, email },
        };

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
          auditLog: [newAuditEntry, ...auditLog],
        });

        return { success: true, cafe: newCafe };
      }
      return { success: false, error: res?.message || "Failed to create cafe." };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create cafe." };
    }
  },

  updateCafeStatus: async (cafeId, newStatus, adminName = "Platform Admin") => {
    try {
      await apiAdminUpdateCafeStatus(cafeId, newStatus);
    } catch (err) {
      console.warn("Failed to update status on server:", err.message);
    }

    const { cafes, auditLog } = get();
    const cafe = cafes.find((c) => c.id === cafeId);
    const oldStatus = cafe ? cafe.status : "unknown";
    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      action: "CAFE_STATUS_CHANGED",
      description: `Cafe '${cafe?.name || cafeId}' status changed from ${oldStatus} → ${newStatus}`,
      adminName,
      timestamp: new Date().toISOString(),
      metadata: { cafeId, from: oldStatus, to: newStatus },
    };
    set({
      cafes: cafes.map((c) =>
        c.id === cafeId ? { ...c, status: newStatus, isActive: newStatus === "active" } : c
      ),
      auditLog: [newAuditEntry, ...auditLog],
    });
    return { success: true };
  },

  updateCafeInfo: async (cafeId, updatedData) => {
    try {
      await apiAdminUpdateCafe(cafeId, updatedData);
    } catch (err) {
      console.warn("Failed to update cafe info on server:", err.message);
    }

    const { cafes, auditLog } = get();
    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      action: "CAFE_INFO_UPDATED",
      description: `Cafe info updated for ID ${cafeId}`,
      adminName: "Platform Admin",
      timestamp: new Date().toISOString(),
      metadata: { cafeId },
    };
    set({
      cafes: cafes.map((c) => (c.id === cafeId ? { ...c, ...updatedData } : c)),
      auditLog: [newAuditEntry, ...auditLog],
    });
    return { success: true };
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

    const { cafes, plans, auditLog } = get();
    const plan = plans.find((p) => p.id === planId || p._id === planId);
    const cafe = cafes.find((c) => c.id === cafeId || c._id === cafeId);
    const planName = plan ? plan.name : "Tier";
    const cafeName = cafe ? cafe.name : "Cafe";

    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      action: "PLAN_ASSIGNED",
      description: `Subscription plan '${planName}' assigned to '${cafeName}'`,
      adminName: "Platform Admin",
      timestamp: new Date().toISOString(),
      metadata: { cafeId, planId },
    };
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
      auditLog: [newAuditEntry, ...auditLog],
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
      await apiAdminUpdateCustomerStatus(customerId, newStatus);
    } catch (err) {
      console.warn("Failed to update customer status on server:", err.message);
    }

    const { customers, auditLog } = get();
    const customer = customers.find((c) => c.id === customerId);
    const oldStatus = customer ? customer.status : "unknown";
    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      action: "CUSTOMER_STATUS_CHANGED",
      description: `Customer '${customer?.name || customerId}' status changed from ${oldStatus} → ${newStatus}`,
      adminName: "Platform Admin",
      timestamp: new Date().toISOString(),
      metadata: { customerId, from: oldStatus, to: newStatus },
    };
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
      auditLog: [newAuditEntry, ...auditLog],
    });
    return { success: true };
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
    } catch (err) {
      console.warn("Failed to toggle plan status on server:", err.message);
    }

    // Optimistic fallback
    set({
      plans: plans.map((p) =>
        p.id === planId || p._id === planId ? { ...p, isActive: newActiveState } : p
      ),
    });
    return { success: true };
  },

  deletePlan: async (planId) => {
    try {
      const res = await apiAdminDeletePlan(planId);
      if (res?.success) {
        const { plans, auditLog } = get();
        const deletedPlan = plans.find((p) => p.id === planId || p._id === planId);
        const newAuditEntry = {
          id: `audit-${Date.now()}`,
          action: "PLAN_DELETED",
          description: `Subscription plan '${deletedPlan?.name || planId}' was deleted`,
          adminName: "Platform Admin",
          timestamp: new Date().toISOString(),
          metadata: { planId },
        };
        set({
          plans: plans.filter((p) => p.id !== planId && p._id !== planId),
          auditLog: [newAuditEntry, ...auditLog],
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
    } catch (err) {
      console.warn("Failed to toggle publish status on server:", err.message);
    }

    // Optimistic fallback
    set({
      announcements: announcements.map((a) =>
        a.id === annId || a._id === annId ? { ...a, isPublished: newStatus } : a
      ),
    });
    return { success: true };
  },

  // ── Settings ──────────────────────────────────────────────────────────

  updateSettings: (newSettings) => {
    const { settings } = get();
    set({ settings: { ...settings, ...newSettings } });
    return { success: true };
  },
}));
