"use client";

import { create } from "zustand";
import {
  CAFES_CATALOG,
  updateCafeCatalogEntry,
} from "../(customer)/cafe/data/cafesCatalog";
import { useLoyaltyStore } from "./useLoyaltyStore";
import {
  apiGetRewards,
  apiCreateReward,
  apiUpdateReward,
  apiToggleRewardStatus,
  apiDeleteReward,
  apiGetCafeProfile,
  apiUpdateCafeProfile,
  apiGetCafeCustomers,
  apiUpdateCustomerStamps,
  apiGetCafeActivities,
  apiGetCafeStaff,
  apiCreateCafeStaff,
  apiUpdateCafeStaff,
  apiDeleteCafeStaff,
} from "@/app/lib/dashboardApi";

const EMPTY_CAFE = {
  id: "",
  slug: "",
  name: "",
  tagline: "",
  category: "Coffee & Bakery",
  establishedYear: 2021,
  status: "active",
  isActive: true,
  isVerified: true,
  stampTarget: 10,
  customerCount: 0,
  totalStampsIssued: 0,
  totalRewardsRedeemed: 0,
  coverImage:
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
  coverImageAlt: "",
  logoImage:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
  logoAlt: "",
  accentColor: "#3B2418",
  about: {
    shortDescription: "",
    fullDescription: "",
    highlights: [],
  },
  location: {
    address: "",
    district: "",
    city: "",
    postcode: "",
    fullAddress: "",
    directionsHint: "",
    googleMapsUrl: "",
    googleMapsReviewUrl: "",
  },
  openingHours: {
    timezone: "Africa/Cairo",
    holidayNotice: "",
    schedule: [
      { day: "Monday", open: "07:30", close: "19:00", isClosed: false },
      { day: "Tuesday", open: "07:30", close: "19:00", isClosed: false },
      { day: "Wednesday", open: "07:30", close: "19:00", isClosed: false },
      { day: "Thursday", open: "07:30", close: "20:00", isClosed: false },
      { day: "Friday", open: "07:30", close: "21:00", isClosed: false },
      { day: "Saturday", open: "08:30", close: "21:00", isClosed: false },
      { day: "Sunday", open: "08:30", close: "18:00", isClosed: false },
    ],
  },
  contact: {
    phone: "",
    displayPhone: "",
    email: "",
  },
  website: {
    url: "",
    displayUrl: "",
  },
  socialMedia: {
    instagram: { handle: "", url: "", followersCount: "" },
    facebook: { handle: "", url: "" },
    tiktok: { handle: "", url: "" },
    whatsapp: { handle: "", url: "" },
  },
  menuPreview: {
    isAvailable: true,
    note: "",
    categories: [],
  },
};

export const useDashboardStore = create((set, get) => ({
  // Core Cafe Profile State
  cafe: EMPTY_CAFE,
  isLoadingCafe: false,
  cafeError: null,

  // Program & Customers State (Loaded from MongoDB via /api/dashboard/cafe/customers)
  customers: [],
  isLoadingCustomers: false,
  customersLoaded: false,
  rewards: [],
  isLoadingRewards: false,
  rewardsError: null,
  activities: [],
  isLoadingActivities: false,
  activitiesLoaded: false,
  staffMembers: [],

  // Settings
  settings: {
    stampTarget: 10,
    enforceDailyVisit: true,
    welcomeBonusStamp: true,
    allowManualOverride: true,
    emailDigests: true,
    instantScanNotification: true,
    autoRewardAlert: true,
    timezone: "Africa/Cairo",
  },

  // === VISITS & STAMPS ACTIONS ===
  recordVisitAndStamps: ({
    customerId,
    stampsCount = 1,
    note = "",
    staffName = "Staff Member",
  }) => {
    const { customers, activities, settings } = get();
    const customer = customers.find((c) => c.id === customerId);

    if (!customer) {
      return { success: false, error: "Customer not found." };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const alreadyVisitedToday = customer.lastVisitDate === todayStr;

    if (
      alreadyVisitedToday &&
      settings.enforceDailyVisit &&
      !note.includes("[Override]")
    ) {
      return {
        success: false,
        warning: true,
        error:
          "This customer has already recorded a visit today. Use manager override if this is intentional.",
      };
    }

    const newStamps = Math.min(
      settings.stampTarget,
      customer.stamps + stampsCount,
    );
    const updatedCustomer = {
      ...customer,
      stamps: newStamps,
      lifetimeStamps: customer.lifetimeStamps + stampsCount,
      totalVisits: customer.totalVisits + 1,
      lastVisitDate: todayStr,
      status: "active",
    };

    const newActivity = {
      id: `act-dash-${Date.now()}`,
      type: "stamp",
      title: `Stamp Issued (+${stampsCount})`,
      customerName: customer.name,
      customerId: customer.id,
      staffName,
      timestamp: new Date().toISOString(),
      formattedDate: "Just now",
      stampsDelta: stampsCount,
      note: note || "Visit recorded via QR scan",
    };

    set({
      customers: customers.map((c) =>
        c.id === customerId ? updatedCustomer : c,
      ),
      activities: [newActivity, ...activities],
    });

    return {
      success: true,
      customer: updatedCustomer,
      newStamps,
      unlockedReward: newStamps >= settings.stampTarget,
    };
  },

  // === REDEEM REWARD ACTION ===
  redeemCustomerReward: ({
    customerId,
    rewardId,
    staffName = "Staff Member",
  }) => {
    const { customers, rewards, activities } = get();
    const customer = customers.find((c) => c.id === customerId);
    const reward = rewards.find((r) => r.id === rewardId);

    if (!customer) return { success: false, error: "Customer not found." };
    if (!reward) return { success: false, error: "Reward not found." };

    if (customer.stamps < reward.stampsRequired) {
      return {
        success: false,
        error: `Insufficient stamps. Customer has ${customer.stamps}/${reward.stampsRequired} required stamps.`,
      };
    }

    const newStamps = customer.stamps - reward.stampsRequired;
    const updatedCustomer = {
      ...customer,
      stamps: newStamps,
      rewardsRedeemedCount: (customer.rewardsRedeemedCount || 0) + 1,
    };

    const updatedRewards = rewards.map((r) =>
      r.id === rewardId
        ? { ...r, redemptionsCount: (r.redemptionsCount || 0) + 1 }
        : r,
    );

    const newActivity = {
      id: `act-dash-${Date.now()}`,
      type: "redemption",
      title: `Reward Redeemed: ${reward.name}`,
      customerName: customer.name,
      customerId: customer.id,
      staffName,
      timestamp: new Date().toISOString(),
      formattedDate: "Just now",
      stampsDelta: -reward.stampsRequired,
      note: `Redeemed ${reward.name} (${reward.stampsRequired} stamps spent)`,
    };

    set({
      customers: customers.map((c) =>
        c.id === customerId ? updatedCustomer : c,
      ),
      rewards: updatedRewards,
      activities: [newActivity, ...activities],
    });

    return { success: true, customer: updatedCustomer, reward };
  },

  // === REWARDS MANAGEMENT ===
  fetchRewards: async (status) => {
    set({ isLoadingRewards: true, rewardsError: null });
    try {
      const res = await apiGetRewards({ status });
      if (res.success && res.data?.rewards) {
        set({ rewards: res.data.rewards, isLoadingRewards: false });
        return { success: true, rewards: res.data.rewards };
      }
      set({ isLoadingRewards: false });
      return { success: true, rewards: [] };
    } catch (err) {
      console.warn("fetchRewards error:", err.message);
      set({ isLoadingRewards: false, rewardsError: err.message });
      return { success: false, error: err.message };
    }
  },

  createReward: async (newReward) => {
    try {
      const res = await apiCreateReward(newReward);
      if (res.success && res.data?.reward) {
        const reward = res.data.reward;
        set((state) => ({ rewards: [reward, ...state.rewards] }));
        return { success: true, reward };
      }
      return {
        success: false,
        error: res.message || "Failed to create reward",
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateReward: async (rewardId, updatedData) => {
    try {
      const res = await apiUpdateReward(rewardId, updatedData);
      if (res.success && res.data?.reward) {
        const updated = res.data.reward;
        set((state) => ({
          rewards: state.rewards.map((r) =>
            r.id === rewardId || r._id === rewardId ? updated : r,
          ),
        }));
        return { success: true, reward: updated };
      }
      return {
        success: false,
        error: res.message || "Failed to update reward",
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  deleteReward: async (rewardId) => {
    try {
      const res = await apiDeleteReward(rewardId);
      if (res.success) {
        set((state) => ({
          rewards: state.rewards.filter(
            (r) => r.id !== rewardId && r._id !== rewardId,
          ),
        }));
        return { success: true };
      }
      return {
        success: false,
        error: res.message || "Failed to delete reward",
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  toggleRewardStatus: async (rewardId) => {
    try {
      const res = await apiToggleRewardStatus(rewardId);
      if (res.success && res.data?.reward) {
        const updated = res.data.reward;
        set((state) => ({
          rewards: state.rewards.map((r) =>
            r.id === rewardId || r._id === rewardId ? updated : r,
          ),
        }));
        return { success: true, reward: updated };
      }
      return {
        success: false,
        error: res.message || "Failed to toggle status",
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // === CAFE PROFILE MANAGEMENT ===
  fetchCafeProfile: async () => {
    set({ isLoadingCafe: true, cafeError: null });
    try {
      const data = await apiGetCafeProfile();
      if (data.success && data.data?.cafe) {
        get().setCafe(data.data.cafe);
        set({ isLoadingCafe: false });
        return { success: true, cafe: data.data.cafe };
      }
      set({ isLoadingCafe: false });
      return { success: false };
    } catch (err) {
      set({ isLoadingCafe: false, cafeError: err.message });
      return { success: false, error: err.message };
    }
  },

  setCafe: (serverCafe) => {
    if (!serverCafe) return;
    set((state) => {
      const merged = {
        ...state.cafe,
        ...serverCafe,
        id: serverCafe.id || serverCafe._id || state.cafe.id,
        name: serverCafe.name || state.cafe.name,
        slug: serverCafe.slug || state.cafe.slug,
        tagline:
          serverCafe.tagline !== undefined
            ? serverCafe.tagline
            : state.cafe.tagline,
        category: serverCafe.category || state.cafe.category,
        establishedYear:
          serverCafe.establishedYear || state.cafe.establishedYear || 2021,
        status: serverCafe.status || state.cafe.status,
        isActive:
          serverCafe.isActive !== undefined
            ? serverCafe.isActive
            : state.cafe.isActive,
        isVerified:
          serverCafe.isVerified !== undefined
            ? serverCafe.isVerified
            : state.cafe.isVerified,
        stampTarget: serverCafe.stampTarget || state.cafe.stampTarget || 10,
        customerCount: serverCafe.customerCount ?? state.cafe.customerCount,
        totalStampsIssued:
          serverCafe.totalStampsIssued ?? state.cafe.totalStampsIssued,
        totalRewardsRedeemed:
          serverCafe.totalRewardsRedeemed ?? state.cafe.totalRewardsRedeemed,
        coverImage: serverCafe.coverImage || state.cafe.coverImage,
        coverImageAlt:
          serverCafe.coverImageAlt !== undefined
            ? serverCafe.coverImageAlt
            : state.cafe.coverImageAlt,
        logoImage: serverCafe.logoImage || state.cafe.logoImage,
        logoAlt:
          serverCafe.logoAlt !== undefined
            ? serverCafe.logoAlt
            : state.cafe.logoAlt,
        accentColor: serverCafe.accentColor || state.cafe.accentColor,
        about: {
          ...state.cafe.about,
          ...(serverCafe.about || {}),
          highlights:
            serverCafe.about?.highlights || state.cafe.about?.highlights || [],
        },
        location: {
          ...state.cafe.location,
          ...(serverCafe.location || {}),
        },
        openingHours: {
          ...state.cafe.openingHours,
          ...(serverCafe.openingHours || {}),
          schedule:
            serverCafe.openingHours?.schedule ||
            state.cafe.openingHours?.schedule ||
            [],
        },
        contact: {
          ...state.cafe.contact,
          ...(serverCafe.contact || {}),
        },
        website: {
          ...state.cafe.website,
          ...(serverCafe.website || {}),
        },
        socialMedia: {
          ...state.cafe.socialMedia,
          ...(serverCafe.socialMedia || {}),
        },
        menuPreview: {
          ...state.cafe.menuPreview,
          ...(serverCafe.menuPreview || {}),
          categories:
            serverCafe.menuPreview?.categories ||
            state.cafe.menuPreview?.categories ||
            [],
        },
        currentPlan:
          serverCafe.currentPlan !== undefined
            ? serverCafe.currentPlan
            : state.cafe.currentPlan,
      };

      return {
        cafe: merged,
        settings: {
          ...state.settings,
          stampTarget: serverCafe.stampTarget || state.settings.stampTarget,
        },
      };
    });
  },

  hasFeature: (featureKey) => {
    const { cafe } = get();
    const plan = cafe?.currentPlan;
    if (!plan) return true; // optimistic default during hydration
    if (!Array.isArray(plan.features)) return false;
    const target = featureKey.toLowerCase().replace(/[-_]/g, " ");
    return plan.features.some((f) => {
      const normalized = f.toLowerCase().replace(/[-_]/g, " ");
      return (
        normalized === target ||
        normalized.includes(target) ||
        target.includes(normalized)
      );
    });
  },

  getPlanLimits: () => {
    const { cafe, customers, rewards, staffMembers } = get();
    const plan = cafe?.currentPlan;

    const joiningDate =
      cafe?.createdAt || cafe?.joiningDate || cafe?.subscriptionStart || null;
    const subscriptionStart =
      cafe?.subscriptionStart || cafe?.createdAt || null;
    const billingPeriod = plan?.billingPeriod || "month";

    // Calculate or resolve expiry date
    let subscriptionExpiry = cafe?.subscriptionExpiry || null;
    if (!subscriptionExpiry && subscriptionStart) {
      const start = new Date(subscriptionStart);
      if (!isNaN(start.getTime())) {
        let cycleEnd = new Date(start);
        if (billingPeriod === "week") {
          cycleEnd.setDate(cycleEnd.getDate() + 7);
        } else if (billingPeriod === "year") {
          cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);
        } else {
          cycleEnd.setMonth(cycleEnd.getMonth() + 1);
        }
        subscriptionExpiry = cycleEnd.toISOString();
      }
    }

    let daysRemaining = null;
    if (subscriptionExpiry) {
      const exp = new Date(subscriptionExpiry);
      if (!isNaN(exp.getTime())) {
        const now = new Date();
        const diffMs = exp.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      }
    }

    const isExpiringSoon =
      daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;
    const isExpired =
      (daysRemaining !== null && daysRemaining < 0) ||
      cafe?.subscriptionStatus === "past_due";

    if (!plan) {
      return {
        planName: "Active Plan",
        billingPeriod,
        joiningDate,
        subscriptionStart,
        subscriptionExpiry,
        daysRemaining,
        isExpiringSoon,
        isExpired,
        maxCustomers: null,
        isUnlimitedCustomers: true,
        maxRewards: null,
        isUnlimitedRewards: true,
        maxStaff: 5,
        customersCount: customers.length,
        rewardsCount: rewards.length,
        staffCount: staffMembers.length,
        isCustomersLimitReached: false,
        isRewardsLimitReached: false,
        isStaffLimitReached: false,
        subscriptionStatus: cafe?.subscriptionStatus || "active",
      };
    }

    const isUnlimitedCustomers =
      Boolean(plan.isUnlimitedCustomers) ||
      plan.features?.some(
        (f) =>
          f.toLowerCase().includes("unlimited_customers") ||
          f.toLowerCase().includes("unlimited customers"),
      );
    const isUnlimitedRewards =
      Boolean(plan.isUnlimitedRewards) ||
      plan.features?.some(
        (f) =>
          f.toLowerCase().includes("unlimited_rewards") ||
          f.toLowerCase().includes("unlimited rewards"),
      );

    const maxCustomers = isUnlimitedCustomers
      ? null
      : (plan.maxCustomers ?? 50);
    const maxRewards = isUnlimitedRewards ? null : (plan.maxRewards ?? 3);
    const maxStaff = plan.maxStaff ?? 1;

    const customersCount = customers.length;
    const rewardsCount = rewards.length;
    const staffCount = staffMembers.length;

    return {
      planName: plan.name || "Subscription Plan",
      billingPeriod,
      joiningDate,
      subscriptionStart,
      subscriptionExpiry,
      daysRemaining,
      isExpiringSoon,
      isExpired,
      maxCustomers,
      isUnlimitedCustomers,
      maxRewards,
      isUnlimitedRewards,
      maxStaff,
      customersCount,
      rewardsCount,
      staffCount,
      isCustomersLimitReached:
        !isUnlimitedCustomers &&
        maxCustomers !== null &&
        customersCount >= maxCustomers,
      isRewardsLimitReached:
        !isUnlimitedRewards &&
        maxRewards !== null &&
        rewardsCount >= maxRewards,
      isStaffLimitReached: maxStaff !== null && staffCount >= maxStaff,
      subscriptionStatus: cafe?.subscriptionStatus || "active",
    };
  },

  updateCafeProfile: async (updatedFields) => {
    try {
      const data = await apiUpdateCafeProfile(updatedFields);
      if (data.success && data.data?.cafe) {
        get().setCafe(data.data.cafe);
        updateCafeCatalogEntry(
          data.data.cafe.slug || "coffee-house",
          data.data.cafe,
        );
        return { success: true, cafe: data.data.cafe };
      }
      throw new Error(data.message || "Failed to update cafe profile.");
    } catch (err) {
      // Fallback local update
      set((state) => ({ cafe: { ...state.cafe, ...updatedFields } }));
      throw err;
    }
  },

  // === STAFF MANAGEMENT ===
  fetchStaff: async () => {
    try {
      const staffList = await apiGetCafeStaff();
      if (Array.isArray(staffList)) {
        set({
          staffMembers: staffList.map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            phone: s.phone || "",
            role: s.roleLabel || s.role,
            roleKey: s.roleKey,
            status: s.isActive ? "active" : "inactive",
            joinedDate: s.createdAt
              ? new Date(s.createdAt).toISOString().split("T")[0]
              : "Recently",
            avatar:
              s.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            canManageStaff: s.roleKey === "owner",
            canEditCafe: s.roleKey === "owner" || s.roleKey === "manager",
            canManageRewards: s.roleKey !== "barista",
          })),
        });
      }
    } catch (e) {
      console.warn(
        "[Dashboard Store] Could not fetch server staff list:",
        e.message,
      );
    }
  },

  createStaff: async (staffData) => {
    try {
      const res = await apiCreateCafeStaff({
        name: staffData.name,
        email: staffData.email,
        password: staffData.password || "Password123!",
        role: staffData.roleKey === "manager" ? "cafeManager" : "cafeBarista",
        phone: staffData.phone,
      });

      if (res.success && res.data) {
        const s = res.data;
        const newStaff = {
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone || "",
          role: s.roleLabel || s.role,
          roleKey: s.roleKey,
          status: s.isActive ? "active" : "inactive",
          joinedDate: new Date().toISOString().split("T")[0],
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          canManageStaff: s.roleKey === "owner",
          canEditCafe: s.roleKey === "owner" || s.roleKey === "manager",
          canManageRewards: s.roleKey !== "barista",
        };
        const { staffMembers } = get();
        set({ staffMembers: [newStaff, ...staffMembers] });
        return { success: true, staff: newStaff };
      }
    } catch (err) {
      console.warn(
        "[Dashboard Store] createStaff server error, using local fallback:",
        err.message,
      );
    }

    const { staffMembers } = get();
    const newStaff = {
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "active",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      lastActive: "Never",
      canManageStaff: staffData.roleKey === "owner",
      canEditCafe:
        staffData.roleKey === "owner" || staffData.roleKey === "manager",
      canManageRewards: staffData.roleKey !== "barista",
      ...staffData,
    };
    set({ staffMembers: [newStaff, ...staffMembers] });
    return { success: true, staff: newStaff };
  },

  updateStaff: async (staffId, updatedData) => {
    try {
      await apiUpdateCafeStaff(staffId, {
        name: updatedData.name,
        phone: updatedData.phone,
        role:
          updatedData.roleKey === "manager"
            ? "cafeManager"
            : updatedData.roleKey === "barista"
              ? "cafeBarista"
              : undefined,
        isActive: updatedData.status === "active",
        password: updatedData.password || undefined,
      });
    } catch (e) {
      console.warn(
        "[Dashboard Store] updateStaff server error, using local fallback:",
        e.message,
      );
    }

    const { staffMembers } = get();
    set({
      staffMembers: staffMembers.map((s) =>
        s.id === staffId ? { ...s, ...updatedData } : s,
      ),
    });
    return { success: true };
  },

  deleteStaff: async (staffId) => {
    try {
      await apiDeleteCafeStaff(staffId);
    } catch (e) {
      console.warn(
        "[Dashboard Store] deleteStaff server error, using local fallback:",
        e.message,
      );
    }

    const { staffMembers } = get();
    set({
      staffMembers: staffMembers.filter((s) => s.id !== staffId),
    });
    return { success: true };
  },

  toggleStaffStatus: async (staffId) => {
    const { staffMembers } = get();
    const staff = staffMembers.find((s) => s.id === staffId);
    if (!staff) return;

    const nextStatus = staff.status === "active" ? "inactive" : "active";
    try {
      await apiUpdateCafeStaff(staffId, { isActive: nextStatus === "active" });
    } catch (e) {
      console.warn(
        "[Dashboard Store] toggleStaffStatus server error:",
        e.message,
      );
    }

    set({
      staffMembers: staffMembers.map((s) =>
        s.id === staffId ? { ...s, status: nextStatus } : s,
      ),
    });
  },

  // === CUSTOMER MANAGEMENT ===
  createCustomer: (customerData) => {
    const { customers, settings } = get();
    const newCustomer = {
      id: `cust-${Math.floor(1000 + Math.random() * 9000)}`,
      code: `Notch-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredDate: new Date().toISOString().split("T")[0],
      status: "active",
      stamps: settings.welcomeBonusStamp ? 1 : 0,
      totalStamps: settings.stampTarget,
      lifetimeStamps: settings.welcomeBonusStamp ? 1 : 0,
      totalVisits: 1,
      rewardsRedeemedCount: 0,
      lastVisitDate: new Date().toISOString().split("T")[0],
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      ...customerData,
    };
    set({ customers: [newCustomer, ...customers] });
    return { success: true, customer: newCustomer };
  },

  fetchCustomers: async () => {
    set({ isLoadingCustomers: true });
    try {
      const customers = await apiGetCafeCustomers();
      set({ customers, isLoadingCustomers: false, customersLoaded: true });
      return { success: true, customers };
    } catch (err) {
      console.warn("[Dashboard Store] Failed to fetch customers:", err.message);
      set({ isLoadingCustomers: false });
      return { success: false, error: err.message };
    }
  },

  fetchActivities: async () => {
    set({ isLoadingActivities: true });
    try {
      const activities = await apiGetCafeActivities();
      set({ activities, isLoadingActivities: false, activitiesLoaded: true });
      return { success: true, activities };
    } catch (err) {
      console.warn(
        "[Dashboard Store] Failed to fetch activities:",
        err.message,
      );
      set({ isLoadingActivities: false });
      return { success: false, error: err.message };
    }
  },

  updateCustomer: async (customerId, data) => {
    const { customers } = get();
    set({
      customers: customers.map((c) =>
        c.id === customerId ? { ...c, ...data } : c,
      ),
    });

    try {
      await apiUpdateCustomerStamps(customerId, data);
    } catch (err) {
      console.warn(
        "[Dashboard Store] Failed to persist customer update:",
        err.message,
      );
    }

    return { success: true };
  },

  // === SETTINGS ===
  updateSettings: (newSettings) => {
    const { settings } = get();
    set({ settings: { ...settings, ...newSettings } });
    return { success: true };
  },
}));
