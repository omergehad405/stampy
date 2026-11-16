import { create } from "zustand";

export const INITIAL_REWARDS = [
  {
    id: "rew-1",
    name: "Free Classic Coffee",
    category: "Coffee & Drinks",
    description: "Any single-origin espresso, Americano, or house batch drip brew of your choice.",
    stampsRequired: 5,
    tag: "Most Popular",
    iconType: "coffee",
  },
  {
    id: "rew-2",
    name: "Fresh Artisan Dessert",
    category: "Bakery & Sweets",
    description: "Flaky almond croissant, warm cinnamon roll, or daily baked pastry slice.",
    stampsRequired: 8,
    tag: "Chef's Pick",
    iconType: "dessert",
  },
  {
    id: "rew-3",
    name: "20% Off Total Bill",
    category: "Special Discount",
    description: "Enjoy 20% off your entire beverage and food order at the cashier.",
    stampsRequired: 10,
    tag: "Best Value",
    iconType: "discount",
  },
  {
    id: "rew-4",
    name: "Signature Specialty Drink",
    category: "Specialty",
    description: "Any large seasonal latte, cold brew tonic, or handcrafted iced blend.",
    stampsRequired: 12,
    tag: "Premium",
    iconType: "specialty",
  },
  {
    id: "rew-5",
    name: "Whole Bean Coffee (250g)",
    category: "Retail Merch",
    description: "A freshly roasted bag of our signature cafe blend to take home.",
    stampsRequired: 15,
    tag: "Exclusive",
    iconType: "beans",
  },
];

export const INITIAL_REDEMPTIONS = [
  {
    id: "rdm-9421",
    code: "STAMPY-RDM-9421",
    rewardId: "rew-1",
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
    rewardId: "rew-3",
    rewardName: "15% Seasonal Discount",
    stampsSpent: 5,
    createdAt: "2026-10-25T11:15:00.000Z",
    formattedDate: "Oct 25, 2026 • 11:15 AM",
    status: "expired",
    branch: "Coffee House • Main Branch",
  },
];

export const useLoyaltyStore = create((set, get) => ({
  // Customer starts with 8 stamps (allowing Free Coffee: 5 and Free Dessert: 8 to be unlocked)
  stampsBalance: 8,
  rewards: INITIAL_REWARDS,
  redemptions: INITIAL_REDEMPTIONS,

  // Redeem a reward
  redeemReward: (rewardId) => {
    const { stampsBalance, rewards, redemptions } = get();
    const targetReward = rewards.find((r) => r.id === rewardId);

    if (!targetReward) {
      return { success: false, error: "Reward not found" };
    }

    if (stampsBalance < targetReward.stampsRequired) {
      return {
        success: false,
        error: `Insufficient stamps. You have ${stampsBalance} stamps, but need ${targetReward.stampsRequired}.`,
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
      status: "pending", // Pending cashier scan
      branch: "Coffee House • Main Branch",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    set({
      stampsBalance: stampsBalance - targetReward.stampsRequired,
      redemptions: [newRedemption, ...redemptions],
    });

    return { success: true, redemption: newRedemption };
  },

  // Simulated cashier scan: mark pending redemption as used
  markRedemptionAsUsed: (redemptionId) => {
    set((state) => ({
      redemptions: state.redemptions.map((item) =>
        item.id === redemptionId
          ? {
              ...item,
              status: "used",
              usedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : item
      ),
    }));
  },

  // Helper for demo purposes: Add stamps to test higher rewards
  addDemoStamps: (amount = 5) => {
    set((state) => ({
      stampsBalance: state.stampsBalance + amount,
    }));
  },

  // Helper for demo purposes: Reset balance to 8
  resetDemoBalance: () => {
    set({ stampsBalance: 8 });
  },
}));
