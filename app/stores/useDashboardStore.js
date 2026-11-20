"use client";

import { create } from "zustand";
import { CAFES_CATALOG, updateCafeCatalogEntry } from "../(customer)/cafe/data/cafesCatalog";
import { useLoyaltyStore } from "./useLoyaltyStore";
import { DEFAULT_STAFF_MEMBERS } from "../dashboard/data/staffMembers";
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
} from "@/app/lib/dashboardApi";

export const INITIAL_CUSTOMERS = [
  {
    id: "cust-7842",
    code: "STAMPY-7842",
    name: "Omar Hassan",
    email: "omar.hassan@example.com",
    phone: "+44 7700 900456",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    stamps: 6,
    totalStamps: 10,
    lifetimeStamps: 18,
    totalVisits: 8,
    rewardsRedeemedCount: 1,
    status: "active",
    registeredDate: "2026-10-15",
    lastVisitDate: "2026-11-17",
    favoriteItem: "Flat White & Almond Croissant",
    notes: "Prefers oat milk. Regular morning customer.",
  },
  {
    id: "cust-1029",
    code: "STAMPY-1029",
    name: "Maya Lin",
    email: "maya.lin@example.com",
    phone: "+44 7700 900789",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    stamps: 9,
    totalStamps: 10,
    lifetimeStamps: 29,
    totalVisits: 14,
    rewardsRedeemedCount: 2,
    status: "active",
    registeredDate: "2026-08-20",
    lastVisitDate: "2026-11-18",
    favoriteItem: "Single-origin Pour-over (Ethiopia)",
    notes: "1 stamp away from reward!",
  },
  {
    id: "cust-5582",
    code: "STAMPY-5582",
    name: "Amira Patel",
    email: "amira.p@example.com",
    phone: "+44 7700 900334",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    stamps: 10,
    totalStamps: 10,
    lifetimeStamps: 42,
    totalVisits: 22,
    rewardsRedeemedCount: 3,
    status: "active",
    registeredDate: "2026-05-12",
    lastVisitDate: "2026-11-18",
    favoriteItem: "Cold Brew Tonic & Avocado Toast",
    notes: "Card is full! Eligible for 20% discount or specialty drink.",
  },
  {
    id: "cust-3341",
    code: "STAMPY-3341",
    name: "Liam Davies",
    email: "liam.d@example.com",
    phone: "+44 7700 900892",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    stamps: 3,
    totalStamps: 10,
    lifetimeStamps: 3,
    totalVisits: 3,
    rewardsRedeemedCount: 0,
    status: "active",
    registeredDate: "2026-11-01",
    lastVisitDate: "2026-11-16",
    favoriteItem: "Iced Caramel Latte",
    notes: "New neighborhood regular.",
  },
  {
    id: "cust-8902",
    code: "STAMPY-8902",
    name: "Chloe Dupont",
    email: "chloe.dupont@example.com",
    phone: "+44 7700 900129",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    stamps: 5,
    totalStamps: 10,
    lifetimeStamps: 12,
    totalVisits: 7,
    rewardsRedeemedCount: 1,
    status: "active",
    registeredDate: "2026-07-22",
    lastVisitDate: "2026-11-15",
    favoriteItem: "Matcha Latte & Cinnamon Roll",
    notes: "Eligible for Free Classic Coffee reward.",
  },
  {
    id: "cust-7719",
    code: "STAMPY-7719",
    name: "Lucas Rossi",
    email: "lucas.r@example.com",
    phone: "+44 7700 900654",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    stamps: 1,
    totalStamps: 10,
    lifetimeStamps: 1,
    totalVisits: 1,
    rewardsRedeemedCount: 0,
    status: "inactive",
    registeredDate: "2026-09-04",
    lastVisitDate: "2026-09-04",
    favoriteItem: "Espresso Doppio",
    notes: "Has not visited in 60+ days.",
  },
];

export const INITIAL_DASHBOARD_ACTIVITIES = [
  {
    id: "act-dash-1",
    type: "stamp",
    title: "Stamp Issued (+1)",
    customerName: "Amira Patel",
    customerId: "cust-5582",
    staffName: "Marcus Vance",
    timestamp: "2026-11-18T15:42:00.000Z",
    formattedDate: "Today • 3:42 PM",
    stampsDelta: 1,
    note: "Drip coffee purchase",
  },
  {
    id: "act-dash-2",
    type: "stamp",
    title: "Stamp Issued (+1)",
    customerName: "Maya Lin",
    customerId: "cust-1029",
    staffName: "Elena Rostova",
    timestamp: "2026-11-18T12:15:00.000Z",
    formattedDate: "Today • 12:15 PM",
    stampsDelta: 1,
    note: "Ethiopia single-origin",
  },
  {
    id: "act-dash-3",
    type: "redemption",
    title: "Reward Redeemed: Free Classic Coffee",
    customerName: "Omar Hassan",
    customerId: "cust-7842",
    staffName: "Marcus Vance",
    timestamp: "2026-11-17T16:30:00.000Z",
    formattedDate: "Yesterday • 4:30 PM",
    stampsDelta: -5,
    note: "Code STAMPY-RDM-9421 validated",
  },
  {
    id: "act-dash-4",
    type: "stamp",
    title: "Stamp Issued (+1)",
    customerName: "Omar Hassan",
    customerId: "cust-7842",
    staffName: "Sophia Chen",
    timestamp: "2026-11-17T16:28:00.000Z",
    formattedDate: "Yesterday • 4:28 PM",
    stampsDelta: 1,
    note: "Flat white visit",
  },
  {
    id: "act-dash-5",
    type: "stamp",
    title: "Stamp Issued (+1)",
    customerName: "Liam Davies",
    customerId: "cust-3341",
    staffName: "Marcus Vance",
    timestamp: "2026-11-16T11:20:00.000Z",
    formattedDate: "Nov 16 • 11:20 AM",
    stampsDelta: 1,
    note: "Iced Latte",
  },
  {
    id: "act-dash-6",
    type: "join",
    title: "New Customer Joined",
    customerName: "Liam Davies",
    customerId: "cust-3341",
    staffName: "System",
    timestamp: "2026-11-01T10:00:00.000Z",
    formattedDate: "Nov 1 • 10:00 AM",
    stampsDelta: 1,
    note: "Welcome bonus stamp credited",
  },
];

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
  },
  openingHours: {
    timezone: "Europe/London",
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
  activities: INITIAL_DASHBOARD_ACTIVITIES,
  staffMembers: DEFAULT_STAFF_MEMBERS,

  // Settings
  settings: {
    stampTarget: 10,
    enforceDailyVisit: true,
    welcomeBonusStamp: true,
    allowManualOverride: true,
    emailDigests: true,
    instantScanNotification: true,
    autoRewardAlert: true,
    timezone: "Europe/London",
  },

  // === VISITS & STAMPS ACTIONS ===
  recordVisitAndStamps: ({ customerId, stampsCount = 1, note = "", staffName = "Staff Member" }) => {
    const { customers, activities, settings } = get();
    const customer = customers.find((c) => c.id === customerId);

    if (!customer) {
      return { success: false, error: "Customer not found." };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const alreadyVisitedToday = customer.lastVisitDate === todayStr;

    if (alreadyVisitedToday && settings.enforceDailyVisit && !note.includes("[Override]")) {
      return {
        success: false,
        warning: true,
        error: "This customer has already recorded a visit today. Use manager override if this is intentional.",
      };
    }

    const newStamps = Math.min(settings.stampTarget, customer.stamps + stampsCount);
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
      customers: customers.map((c) => (c.id === customerId ? updatedCustomer : c)),
      activities: [newActivity, ...activities],
    });

    // If customer is Omar Hassan, sync with customer-facing loyalty store
    if (customerId === "cust-7842") {
      try {
        const loyaltyStore = useLoyaltyStore.getState();
        if (loyaltyStore?.memberships?.["coffee-house"]) {
          const m = loyaltyStore.memberships["coffee-house"];
          useLoyaltyStore.setState({
            memberships: {
              ...loyaltyStore.memberships,
              "coffee-house": {
                ...m,
                stamps: newStamps,
                lastVisitDate: todayStr,
                history: [
                  {
                    id: `act-${Date.now()}`,
                    type: "stamp",
                    title: `Visit Recorded (+${stampsCount} Stamp)`,
                    date: "Just now",
                    description: "Coffee House • Main Branch",
                    stampsDelta: stampsCount,
                  },
                  ...m.history,
                ],
              },
            },
            stampsBalance: newStamps,
          });
        }
      } catch (err) {
        console.warn("Could not sync customer loyalty store:", err);
      }
    }

    return {
      success: true,
      customer: updatedCustomer,
      newStamps,
      unlockedReward: newStamps >= settings.stampTarget,
    };
  },

  // === REDEEM REWARD ACTION ===
  redeemCustomerReward: ({ customerId, rewardId, staffName = "Staff Member" }) => {
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
      r.id === rewardId ? { ...r, redemptionsCount: (r.redemptionsCount || 0) + 1 } : r
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
      customers: customers.map((c) => (c.id === customerId ? updatedCustomer : c)),
      rewards: updatedRewards,
      activities: [newActivity, ...activities],
    });

    // Sync with Omar Hassan's customer store if applicable
    if (customerId === "cust-7842") {
      try {
        const loyaltyStore = useLoyaltyStore.getState();
        if (loyaltyStore?.memberships?.["coffee-house"]) {
          const m = loyaltyStore.memberships["coffee-house"];
          useLoyaltyStore.setState({
            memberships: {
              ...loyaltyStore.memberships,
              "coffee-house": {
                ...m,
                stamps: newStamps,
                history: [
                  {
                    id: `act-rdm-${Date.now()}`,
                    type: "redemption",
                    title: `Redeemed ${reward.name}`,
                    date: "Just now",
                    description: `Staff confirmed at Coffee House`,
                    stampsDelta: -reward.stampsRequired,
                  },
                  ...m.history,
                ],
              },
            },
            stampsBalance: newStamps,
          });
        }
      } catch (err) {
        console.warn("Could not sync redemption with loyalty store:", err);
      }
    }

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
      return { success: false, error: res.message || "Failed to create reward" };
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
            r.id === rewardId || r._id === rewardId ? updated : r
          ),
        }));
        return { success: true, reward: updated };
      }
      return { success: false, error: res.message || "Failed to update reward" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  deleteReward: async (rewardId) => {
    try {
      const res = await apiDeleteReward(rewardId);
      if (res.success) {
        set((state) => ({
          rewards: state.rewards.filter((r) => r.id !== rewardId && r._id !== rewardId),
        }));
        return { success: true };
      }
      return { success: false, error: res.message || "Failed to delete reward" };
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
            r.id === rewardId || r._id === rewardId ? updated : r
          ),
        }));
        return { success: true, reward: updated };
      }
      return { success: false, error: res.message || "Failed to toggle status" };
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
        tagline: serverCafe.tagline !== undefined ? serverCafe.tagline : state.cafe.tagline,
        category: serverCafe.category || state.cafe.category,
        establishedYear: serverCafe.establishedYear || state.cafe.establishedYear || 2021,
        status: serverCafe.status || state.cafe.status,
        isActive: serverCafe.isActive !== undefined ? serverCafe.isActive : state.cafe.isActive,
        isVerified: serverCafe.isVerified !== undefined ? serverCafe.isVerified : state.cafe.isVerified,
        stampTarget: serverCafe.stampTarget || state.cafe.stampTarget || 10,
        customerCount: serverCafe.customerCount ?? state.cafe.customerCount,
        totalStampsIssued: serverCafe.totalStampsIssued ?? state.cafe.totalStampsIssued,
        totalRewardsRedeemed: serverCafe.totalRewardsRedeemed ?? state.cafe.totalRewardsRedeemed,
        coverImage: serverCafe.coverImage || state.cafe.coverImage,
        coverImageAlt: serverCafe.coverImageAlt !== undefined ? serverCafe.coverImageAlt : state.cafe.coverImageAlt,
        logoImage: serverCafe.logoImage || state.cafe.logoImage,
        logoAlt: serverCafe.logoAlt !== undefined ? serverCafe.logoAlt : state.cafe.logoAlt,
        accentColor: serverCafe.accentColor || state.cafe.accentColor,
        about: {
          ...state.cafe.about,
          ...(serverCafe.about || {}),
          highlights: serverCafe.about?.highlights || state.cafe.about?.highlights || [],
        },
        location: {
          ...state.cafe.location,
          ...(serverCafe.location || {}),
        },
        openingHours: {
          ...state.cafe.openingHours,
          ...(serverCafe.openingHours || {}),
          schedule: serverCafe.openingHours?.schedule || state.cafe.openingHours?.schedule || [],
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
          categories: serverCafe.menuPreview?.categories || state.cafe.menuPreview?.categories || [],
        },
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

  updateCafeProfile: async (updatedFields) => {
    try {
      const data = await apiUpdateCafeProfile(updatedFields);
      if (data.success && data.data?.cafe) {
        get().setCafe(data.data.cafe);
        updateCafeCatalogEntry(data.data.cafe.slug || "coffee-house", data.data.cafe);
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
  createStaff: (staffData) => {
    const { staffMembers } = get();
    const newStaff = {
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "active",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      lastActive: "Never",
      canManageStaff: staffData.roleKey === "owner",
      canEditCafe: staffData.roleKey === "owner" || staffData.roleKey === "manager",
      canManageRewards: staffData.roleKey !== "barista",
      ...staffData,
    };
    set({ staffMembers: [...staffMembers, newStaff] });
    return { success: true, staff: newStaff };
  },

  updateStaff: (staffId, updatedData) => {
    const { staffMembers } = get();
    set({
      staffMembers: staffMembers.map((s) =>
        s.id === staffId ? { ...s, ...updatedData } : s
      ),
    });
    return { success: true };
  },

  deleteStaff: (staffId) => {
    const { staffMembers } = get();
    set({
      staffMembers: staffMembers.filter((s) => s.id !== staffId),
    });
    return { success: true };
  },

  toggleStaffStatus: (staffId) => {
    const { staffMembers } = get();
    set({
      staffMembers: staffMembers.map((s) =>
        s.id === staffId
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      ),
    });
  },

  // === CUSTOMER MANAGEMENT ===
  createCustomer: (customerData) => {
    const { customers, settings } = get();
    const newCustomer = {
      id: `cust-${Math.floor(1000 + Math.random() * 9000)}`,
      code: `STAMPY-${Math.floor(1000 + Math.random() * 9000)}`,
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

  updateCustomer: async (customerId, data) => {
    const { customers } = get();
    set({
      customers: customers.map((c) => (c.id === customerId ? { ...c, ...data } : c)),
    });

    try {
      await apiUpdateCustomerStamps(customerId, data);
    } catch (err) {
      console.warn("[Dashboard Store] Failed to persist customer update:", err.message);
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
