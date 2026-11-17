import { create } from "zustand";
import { CAFES_CATALOG, getCafeBySlug } from "../features/cafe/cafesCatalog";

export const INITIAL_USER = {
  id: "cust-7842",
  name: "Omar Hassan",
  email: "omar.hassan@example.com",
  phone: "+44 7700 900456",
  memberCode: "STAMPY-7842",
  joinedDate: "October 2026",
  notificationsEnabled: true,
  biometricsEnabled: true,
};

export const INITIAL_REDEMPTIONS = [
  {
    id: "rdm-9421",
    code: "STAMPY-RDM-9421",
    rewardId: "rew-ch-1",
    rewardName: "Free Classic Coffee",
    stampsSpent: 5,
    createdAt: "2026-11-12T14:32:00.000Z",
    formattedDate: "Nov 12, 2026 • 2:32 PM",
    status: "used",
    branch: "Coffee House • Main Branch",
  },
  {
    id: "rdm-8834",
    code: "STAMPY-RDM-8834",
    rewardId: "rew-ch-3",
    rewardName: "20% Off Total Bill",
    stampsSpent: 10,
    createdAt: "2026-10-25T11:15:00.000Z",
    formattedDate: "Oct 25, 2026 • 11:15 AM",
    status: "expired",
    branch: "Coffee House • Main Branch",
  },
];

export const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    type: "stamp",
    title: "Visit Recorded (+1 Stamp)",
    date: "Yesterday • 4:15 PM",
    description: "Coffee House • Main Branch",
    stampsDelta: 1,
  },
  {
    id: "act-2",
    type: "stamp",
    title: "Visit Recorded (+1 Stamp)",
    date: "Nov 14, 2026 • 2:32 PM",
    description: "Coffee House • Main Branch",
    stampsDelta: 1,
  },
  {
    id: "act-3",
    type: "redemption",
    title: "Redeemed Free Classic Coffee",
    date: "Nov 12, 2026 • 2:32 PM",
    description: "Code STAMPY-RDM-9421",
    stampsDelta: -5,
  },
  {
    id: "act-4",
    type: "stamp",
    title: "Visit Recorded (+1 Stamp)",
    date: "Nov 08, 2026 • 11:10 AM",
    description: "Coffee House • Main Branch",
    stampsDelta: 1,
  },
  {
    id: "act-5",
    type: "stamp",
    title: "Visit Recorded (+1 Stamp)",
    date: "Nov 03, 2026 • 9:45 AM",
    description: "Coffee House • Main Branch",
    stampsDelta: 1,
  },
];

export const useLoyaltyStore = create((set, get) => ({
  user: INITIAL_USER,

  // Map of joined cafe memberships: { [cafeSlug]: { ... } }
  memberships: {
    "coffee-house": {
      cafeSlug: "coffee-house",
      joinedAt: "2026-10-15T10:00:00.000Z",
      stamps: 6,
      totalStamps: 10,
      lastVisitDate: "2026-11-17", // YYYY-MM-DD for one visit per calendar day check
      history: INITIAL_ACTIVITIES,
      redemptions: INITIAL_REDEMPTIONS,
    },
  },

  // Backwards-compatible legacy properties for Coffee House
  stampsBalance: 6,
  rewards: CAFES_CATALOG["coffee-house"].rewards,
  redemptions: INITIAL_REDEMPTIONS,

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

  // Join a cafe loyalty program
  joinCafe: (cafeSlug) => {
    const { memberships } = get();
    if (memberships[cafeSlug]) {
      return { success: true, alreadyJoined: true };
    }

    const cafe = getCafeBySlug(cafeSlug);
    if (!cafe) {
      return { success: false, error: "Cafe not found" };
    }

    const newMembership = {
      cafeSlug,
      joinedAt: new Date().toISOString(),
      stamps: 1, // Welcome stamp for joining!
      totalStamps: cafe.stampTarget || 10,
      lastVisitDate: new Date().toISOString().split("T")[0],
      history: [
        {
          id: `act-join-${Date.now()}`,
          type: "stamp",
          title: "Welcome Bonus (+1 Stamp)",
          date: "Just now",
          description: `Joined ${cafe.name} Loyalty Program`,
          stampsDelta: 1,
        },
      ],
      redemptions: [],
    };

    set((state) => ({
      memberships: {
        ...state.memberships,
        [cafeSlug]: newMembership,
      },
    }));

    return { success: true, alreadyJoined: false, membership: newMembership };
  },

  // Leave a cafe (useful for testing empty states and user management)
  leaveCafe: (cafeSlug) => {
    set((state) => {
      const updated = { ...state.memberships };
      delete updated[cafeSlug];
      return { memberships: updated };
    });
  },

  // Record a visit / collect a stamp for a cafe (enforces 1 visit per day)
  recordVisit: (cafeSlug) => {
    const { memberships } = get();
    const membership = memberships[cafeSlug];
    if (!membership) {
      return { success: false, error: "Not a member of this cafe" };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (membership.lastVisitDate === todayStr) {
      return {
        success: false,
        error: "Daily stamp limit: You have already collected a stamp today for this cafe.",
      };
    }

    const cafe = getCafeBySlug(cafeSlug);
    const target = membership.totalStamps || cafe?.stampTarget || 10;
    const nextStamps = Math.min(membership.stamps + 1, target);

    const newActivity = {
      id: `act-${Date.now()}`,
      type: "stamp",
      title: `Visit Recorded (+1 Stamp #${nextStamps})`,
      date: "Just now",
      description: `${cafe?.name || "Cafe"} • In-store visit`,
      stampsDelta: 1,
    };

    set((state) => {
      const updatedMembership = {
        ...membership,
        stamps: nextStamps,
        lastVisitDate: todayStr,
        history: [newActivity, ...membership.history],
      };

      const newState = {
        memberships: {
          ...state.memberships,
          [cafeSlug]: updatedMembership,
        },
      };

      if (cafeSlug === "coffee-house") {
        newState.stampsBalance = nextStamps;
      }

      return newState;
    });

    return { success: true, newStamps: nextStamps };
  },

  // Redeem a reward for a specific cafe
  redeemCafeReward: (cafeSlug, rewardId) => {
    const { memberships } = get();
    const membership = memberships[cafeSlug];
    if (!membership) {
      return { success: false, error: "Not a member of this cafe" };
    }

    const cafe = getCafeBySlug(cafeSlug);
    const rewardsList = cafe?.rewards || [];
    const targetReward = rewardsList.find((r) => r.id === rewardId);

    if (!targetReward) {
      return { success: false, error: "Reward not found" };
    }

    if (membership.stamps < targetReward.stampsRequired) {
      return {
        success: false,
        error: `Insufficient stamps. You have ${membership.stamps} stamps, but need ${targetReward.stampsRequired}.`,
      };
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRedemption = {
      id: `rdm-${Date.now().toString().slice(-6)}`,
      code: `STAMPY-RDM-${randomNum}`,
      rewardId: targetReward.id,
      rewardName: targetReward.name,
      stampsSpent: targetReward.stampsRequired,
      createdAt: new Date().toISOString(),
      formattedDate: "Just now",
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
        redemptions: [newRedemption, ...membership.redemptions],
        history: [newActivity, ...membership.history],
      };

      const newState = {
        memberships: {
          ...state.memberships,
          [cafeSlug]: updatedMembership,
        },
      };

      if (cafeSlug === "coffee-house") {
        newState.stampsBalance = updatedStamps;
        newState.redemptions = updatedMembership.redemptions;
      }

      return newState;
    });

    return { success: true, redemption: newRedemption };
  },

  // Mark a pending redemption as used
  markCafeRedemptionAsUsed: (cafeSlug, redemptionId) => {
    set((state) => {
      const membership = state.memberships[cafeSlug];
      if (!membership) return state;

      const updatedRedemptions = membership.redemptions.map((item) =>
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

      const newState = {
        memberships: {
          ...state.memberships,
          [cafeSlug]: updatedMembership,
        },
      };

      if (cafeSlug === "coffee-house") {
        newState.redemptions = updatedRedemptions;
      }

      return newState;
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

  // Update user profile info
  updateUserProfile: (updates) => {
    set((state) => ({
      user: {
        ...state.user,
        ...updates,
      },
    }));
  },
}));
