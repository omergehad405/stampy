import { create } from "zustand";
import { getCafeBySlug } from "../(customer)/cafe/data/cafesCatalog";
import { apiGetMe, apiUpdateProfile } from "@/app/lib/authApi";

export const EMPTY_USER = {
  id: "",
  name: "Stampy Patron",
  email: "",
  phone: "",
  memberCode: "",
  qrCode: "",
  totalStamps: 0,
  availableRewards: 0,
  joinedCafes: 0,
  redeemedRewards: 0,
  joinedDate: "Recently",
  notificationsEnabled: true,
  biometricsEnabled: true,
};

// Re-export for backward compatibility
export const INITIAL_USER = EMPTY_USER;
export const INITIAL_REDEMPTIONS = [];
export const INITIAL_ACTIVITIES = [];

export const useLoyaltyStore = create((set, get) => ({
  user: EMPTY_USER,
  isAuthenticated: false,
  isLoadingUser: false,

  // Map of joined cafe memberships: { [cafeSlug]: { ... } }
  // Defaults to empty for newly registered users
  memberships: {},

  // Active customer state
  stampsBalance: 0,
  rewards: [],
  redemptions: [],

  // Fetch real authenticated customer data from backend
  fetchCurrentUser: async () => {
    set({ isLoadingUser: true });
    try {
      const res = await apiGetMe();
      if (res.success && res.data?.user) {
        const u = res.data.user;
        const formattedDate = u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "Recently";

        const updatedUser = {
          id: u.id || u._id,
          name: u.name || "Customer",
          email: u.email || "",
          phone: u.phone || "",
          role: u.role,
          memberCode: u.qrCode || "STAMPY-MEMBER",
          qrCode: u.qrCode || "",
          totalStamps: Number(u.totalStamps) || 0,
          availableRewards: Number(u.availableRewards) || 0,
          joinedCafes: Number(u.joinedCafes) || 0,
          redeemedRewards: Number(u.redeemedRewards) || 0,
          joinedDate: formattedDate,
          notificationsEnabled: u.notificationsEnabled ?? true,
          biometricsEnabled: u.biometricsEnabled ?? true,
        };

        set({
          user: updatedUser,
          isAuthenticated: true,
          isLoadingUser: false,
          stampsBalance: updatedUser.totalStamps,
        });

        return { success: true, user: updatedUser };
      }
    } catch {
      // User is not authenticated or token expired
    }
    set({ isLoadingUser: false });
    return { success: false };
  },

  // Set user directly (e.g. upon login or registration)
  setUser: (u) => {
    if (!u) {
      set({ user: EMPTY_USER, isAuthenticated: false });
      return;
    }
    set((state) => ({
      user: {
        ...state.user,
        ...u,
        totalStamps: u.totalStamps ?? state.user?.totalStamps ?? 0,
        availableRewards: u.availableRewards ?? state.user?.availableRewards ?? 0,
        joinedCafes: u.joinedCafes ?? state.user?.joinedCafes ?? 0,
        redeemedRewards: u.redeemedRewards ?? state.user?.redeemedRewards ?? 0,
        memberCode: u.qrCode || u.memberCode || state.user?.memberCode || "STAMPY-MEMBER",
      },
      isAuthenticated: true,
      stampsBalance: u.totalStamps ?? state.user?.totalStamps ?? 0,
    }));
  },

  // Reset store upon logout
  logout: () => {
    set({
      user: EMPTY_USER,
      isAuthenticated: false,
      memberships: {},
      stampsBalance: 0,
      rewards: [],
      redemptions: [],
    });
  },

  // Check if a cafe is joined
  isCafeJoined: (cafeSlug) => {
    const { memberships } = get();
    return Boolean(memberships[cafeSlug]);
  },

  // Get specific membership data
  getMembership: (cafeSlug) => {
    const { memberships } = get();
    return memberships[cafeSlug] || null;
  },

  // Get all cafes the customer has joined, enriched with catalog metadata
  getJoinedCafes: () => {
    const { memberships } = get();
    return Object.entries(memberships)
      .map(([slug, membership]) => {
        const cafeInfo = getCafeBySlug(slug);
        if (!cafeInfo) return null;

        // Calculate next reward
        const lockedRewards = (cafeInfo.rewards || []).filter(
          (r) => membership.stamps < r.stampsRequired
        );
        const nextReward =
          lockedRewards.length > 0
            ? lockedRewards[0]
            : cafeInfo.rewards?.[cafeInfo.rewards.length - 1] || null;

        return {
          ...cafeInfo,
          membership,
          currentStamps: membership.stamps,
          totalStamps: membership.totalStamps || cafeInfo.stampTarget,
          nextReward,
        };
      })
      .filter(Boolean);
  },

  // Join a new cafe loyalty program
  joinCafe: (cafeSlug) => {
    const cafe = getCafeBySlug(cafeSlug);
    if (!cafe) return { success: false, error: "Cafe not found" };

    const { memberships } = get();
    if (memberships[cafeSlug]) {
      return { success: false, error: "Already joined this cafe" };
    }

    const newMembership = {
      cafeSlug,
      joinedAt: new Date().toISOString(),
      stamps: 0,
      totalStamps: cafe.stampTarget || 10,
      lastVisitDate: null,
      history: [
        {
          id: `act-join-${Date.now()}`,
          type: "join",
          title: "Joined Loyalty Program",
          date: "Just now",
          description: `Joined ${cafe.name}`,
          stampsDelta: 0,
        },
      ],
      redemptions: [],
    };

    set((state) => {
      const updatedMemberships = {
        ...state.memberships,
        [cafeSlug]: newMembership,
      };
      const joinedCount = Object.keys(updatedMemberships).length;
      return {
        memberships: updatedMemberships,
        user: {
          ...state.user,
          joinedCafes: joinedCount,
        },
      };
    });

    return { success: true, membership: newMembership };
  },

  // Leave a cafe loyalty program
  leaveCafe: (cafeSlug) => {
    set((state) => {
      const updated = { ...state.memberships };
      delete updated[cafeSlug];
      const joinedCount = Object.keys(updated).length;
      return {
        memberships: updated,
        user: {
          ...state.user,
          joinedCafes: joinedCount,
        },
      };
    });
  },

  // Record a stamp visit
  recordVisit: (cafeSlug) => {
    const membership = get().getMembership(cafeSlug);
    if (!membership) return { success: false, error: "Not a member of this cafe" };

    const cafe = getCafeBySlug(cafeSlug);
    const updatedStamps = membership.stamps + 1;

    const newActivity = {
      id: `act-${Date.now()}`,
      type: "stamp",
      title: "Visit Recorded (+1 Stamp)",
      date: "Just now",
      description: `${cafe?.name || "Café"} • Stamp earned`,
      stampsDelta: 1,
    };

    set((state) => {
      const currentMem = state.memberships[cafeSlug];
      const updatedMem = {
        ...currentMem,
        stamps: updatedStamps,
        history: [newActivity, ...(currentMem?.history || [])],
      };
      const totalStamps = Object.values({
        ...state.memberships,
        [cafeSlug]: updatedMem,
      }).reduce((acc, m) => acc + (m.stamps || 0), 0);

      return {
        memberships: {
          ...state.memberships,
          [cafeSlug]: updatedMem,
        },
        user: {
          ...state.user,
          totalStamps,
        },
      };
    });

    return { success: true };
  },

  // Redeem a specific reward for a specific cafe
  redeemCafeReward: (cafeSlug, rewardId) => {
    const membership = get().getMembership(cafeSlug);
    if (!membership) {
      return { success: false, error: "You haven't joined this cafe's loyalty program." };
    }

    const cafe = getCafeBySlug(cafeSlug);
    const targetReward = cafe?.rewards?.find((r) => r.id === rewardId);

    if (!targetReward) {
      return { success: false, error: "Reward not found." };
    }

    if (membership.stamps < targetReward.stampsRequired) {
      return {
        success: false,
        error: `Insufficient stamps. You need ${targetReward.stampsRequired} stamps for this reward.`,
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRedemption = {
      id: `rdm-${Date.now()}`,
      code: `STAMPY-RDM-${randomSuffix}`,
      rewardId: targetReward.id,
      rewardName: targetReward.name,
      stampsSpent: targetReward.stampsRequired,
      createdAt: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "pending",
      branch: `${cafe?.name || "Cafe"} • Main Branch`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const newActivity = {
      id: `act-rdm-${Date.now()}`,
      type: "redemption",
      title: `Redeemed ${targetReward.name}`,
      date: "Just now",
      description: `Code ${newRedemption.code}`,
      stampsDelta: -targetReward.stampsRequired,
    };

    const updatedStamps = membership.stamps - targetReward.stampsRequired;

    set((state) => {
      const updatedMembership = {
        ...membership,
        stamps: updatedStamps,
        redemptions: [newRedemption, ...(membership.redemptions || [])],
        history: [newActivity, ...(membership.history || [])],
      };

      const allMemberships = {
        ...state.memberships,
        [cafeSlug]: updatedMembership,
      };

      const redeemedCount = (state.user?.redeemedRewards || 0) + 1;

      return {
        memberships: allMemberships,
        user: {
          ...state.user,
          redeemedRewards: redeemedCount,
        },
      };
    });

    return { success: true, redemption: newRedemption };
  },

  // Mark a pending redemption as used
  markCafeRedemptionAsUsed: (cafeSlug, redemptionId) => {
    set((state) => {
      const membership = state.memberships[cafeSlug];
      if (!membership) return state;

      const updatedRedemptions = (membership.redemptions || []).map((item) =>
        item.id === redemptionId
          ? {
              ...item,
              status: "used",
              usedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : item
      );

      const updatedMembership = {
        ...membership,
        redemptions: updatedRedemptions,
      };

      return {
        memberships: {
          ...state.memberships,
          [cafeSlug]: updatedMembership,
        },
      };
    });
  },

  // Legacy fallback redeemReward
  redeemReward: (rewardId) => {
    return get().redeemCafeReward("coffee-house", rewardId);
  },

  // Legacy fallback markRedemptionAsUsed
  markRedemptionAsUsed: (redemptionId) => {
    get().markCafeRedemptionAsUsed("coffee-house", redemptionId);
  },

  // Update user profile info & persist to backend database
  updateUserProfile: async (updates) => {
    // 1. Optimistic update in client memory
    set((state) => ({
      user: {
        ...state.user,
        ...updates,
      },
    }));

    // 2. Persist update to MongoDB via /api/auth/profile
    try {
      const res = await apiUpdateProfile(updates);
      if (res.success && res.data?.user) {
        const u = res.data.user;
        const formattedDate = u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "Recently";

        set((state) => ({
          user: {
            ...state.user,
            id: u.id || u._id,
            name: u.name,
            email: u.email,
            phone: u.phone || "",
            avatar: u.avatar || "",
            role: u.role,
            totalStamps: Number(u.totalStamps) || 0,
            availableRewards: Number(u.availableRewards) || 0,
            joinedCafes: Number(u.joinedCafes) || 0,
            redeemedRewards: Number(u.redeemedRewards) || 0,
            joinedDate: formattedDate,
            notificationsEnabled: u.notificationsEnabled ?? true,
            biometricsEnabled: u.biometricsEnabled ?? true,
            memberCode: u.qrCode || state.user?.memberCode || "STAMPY-MEMBER",
            qrCode: u.qrCode || state.user?.qrCode || "",
          },
        }));
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      console.warn("[LoyaltyStore] Could not persist profile to backend:", err);
      return { success: false, error: err.message };
    }
  },
}));
