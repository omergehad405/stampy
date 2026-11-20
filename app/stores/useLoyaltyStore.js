import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCafeBySlug } from "../(customer)/cafe/data/cafesCatalog";
import { apiGetMe, apiUpdateProfile } from "@/app/lib/authApi";
import { apiJoinCafe, apiLeaveCafe } from "@/app/lib/cafeApi";
import { getAuthToken, removeAuthToken } from "@/app/lib/apiClient";
import { useNotificationStore } from "./useNotificationStore";

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

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      user: EMPTY_USER,
      isAuthenticated: false,
      isLoadingUser: false,

      // Map of joined cafe memberships: { [cafeSlug]: { ... } }
      memberships: {},

      // Active customer state
      stampsBalance: 0,
      rewards: [],
      redemptions: [],

      // Fetch real authenticated customer data from backend
      fetchCurrentUser: async () => {
        const token = getAuthToken();
        // Skip API roundtrip if user has no stored token and is not authenticated
        if (!token && !get().isAuthenticated) {
          return { success: false };
        }

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

            // Parse joined cafes from MongoDB response
            const newMemberships = {};
            if (Array.isArray(u.cafes) && u.cafes.length > 0) {
              u.cafes.forEach((c) => {
                const slug = c.slug || c.cafeSlug || c.cafeId;
                if (slug) {
                  newMemberships[slug] = {
                    cafeId: c.cafeId,
                    cafeSlug: slug,
                    name: c.name || slug,
                    logoImage: c.logoImage || "",
                    coverImage: c.coverImage || "",
                    category: c.category || "Coffee & Bakery",
                    stamps: c.stamps || 0,
                    totalStamps: c.totalStamps || 10,
                    totalVisits: c.totalVisits || 0,
                    lifetimeStamps: c.lifetimeStamps || c.stamps || 0,
                    joinedAt: c.joinedAt || new Date().toISOString(),
                    lastVisitDate: c.lastVisitDate || null,
                    history: [
                      {
                        id: `act-joined-${slug}`,
                        type: "join",
                        title: "Joined Loyalty Program",
                        date: c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "Recently",
                        description: `Enrolled in ${c.name || slug}`,
                        stampsDelta: 0,
                      },
                    ],
                    redemptions: [],
                  };
                }
              });
            }

            set({
              user: updatedUser,
              isAuthenticated: true,
              isLoadingUser: false,
              stampsBalance: updatedUser.totalStamps,
              memberships: {
                ...get().memberships,
                ...newMemberships,
              },
            });

            return { success: true, user: updatedUser };
          }
        } catch (err) {
          // If session is expired or invalid (401), clear local session
          if (
            err?.status === 401 ||
            err?.message?.toLowerCase().includes("unauthorized") ||
            err?.message?.toLowerCase().includes("not authorized")
          ) {
            get().logout();
          }
          // On network errors, keep the persisted state intact
        } finally {
          set({ isLoadingUser: false });
        }
        return { success: false };
      },

      // Set user directly (e.g. upon login or registration)
      setUser: (u) => {
        if (!u) {
          get().logout();
          return;
        }

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
          role: u.role || "user",
          memberCode: u.qrCode || u.memberCode || "STAMPY-MEMBER",
          qrCode: u.qrCode || "",
          totalStamps: Number(u.totalStamps) || 0,
          availableRewards: Number(u.availableRewards) || 0,
          joinedCafes: Number(u.joinedCafes) || 0,
          redeemedRewards: Number(u.redeemedRewards) || 0,
          joinedDate: u.joinedDate || formattedDate,
          notificationsEnabled: u.notificationsEnabled ?? true,
          biometricsEnabled: u.biometricsEnabled ?? true,
        };

        const newMemberships = {};
        if (Array.isArray(u.cafes) && u.cafes.length > 0) {
          u.cafes.forEach((c) => {
            const slug = c.slug || c.cafeSlug || c.cafeId;
            if (slug) {
              newMemberships[slug] = {
                cafeId: c.cafeId,
                cafeSlug: slug,
                name: c.name || slug,
                logoImage: c.logoImage || "",
                coverImage: c.coverImage || "",
                category: c.category || "Coffee & Bakery",
                stamps: c.stamps || 0,
                totalStamps: c.totalStamps || 10,
                totalVisits: c.totalVisits || 0,
                lifetimeStamps: c.lifetimeStamps || c.stamps || 0,
                joinedAt: c.joinedAt || new Date().toISOString(),
                lastVisitDate: c.lastVisitDate || null,
                history: [
                  {
                    id: `act-joined-${slug}`,
                    type: "join",
                    title: "Joined Loyalty Program",
                    date: c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "Recently",
                    description: `Enrolled in ${c.name || slug}`,
                    stampsDelta: 0,
                  },
                ],
                redemptions: [],
              };
            }
          });
        }

        set((state) => ({
          user: updatedUser,
          isAuthenticated: true,
          stampsBalance: updatedUser.totalStamps,
          memberships: {
            ...state.memberships,
            ...newMemberships,
          },
        }));
      },

      // Reset store upon logout
      logout: () => {
        removeAuthToken();
        set({
          user: EMPTY_USER,
          isAuthenticated: false,
          isLoadingUser: false,
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
            if (!cafeInfo) {
              return {
                id: membership.cafeId || slug,
                slug: membership.cafeSlug || slug,
                name: membership.name || slug,
                logoImage: membership.logoImage || "",
                coverImage: membership.coverImage || "",
                category: membership.category || "Coffee & Bakery",
                stampTarget: membership.totalStamps || 10,
                rewards: [],
                membership,
                currentStamps: membership.stamps || 0,
                totalStamps: membership.totalStamps || 10,
                nextReward: null,
              };
            }

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
      joinCafe: async (cafeSlugOrId) => {
        const cafe = getCafeBySlug(cafeSlugOrId);
        const cafeId = cafe?.id || cafe?._id || cafeSlugOrId;
        const cafeSlug = cafe?.slug || cafeSlugOrId;

        try {
          const res = await apiJoinCafe(cafeId);
          if (res?.success) {
            const backendMem = res.data?.membership;
            const slug = res.data?.cafeSlug || cafeSlug;

            const initialStamps = backendMem?.stamps ?? 1;
            const newMembership = {
              cafeId: res.data?.cafeId || cafeId,
              cafeSlug: slug,
              name: res.data?.cafeName || cafe?.name || slug,
              joinedAt: backendMem?.joinedAt || new Date().toISOString(),
              stamps: initialStamps,
              totalStamps: backendMem?.totalStamps || cafe?.stampTarget || 10,
              totalVisits: backendMem?.totalVisits || 1,
              lifetimeStamps: backendMem?.lifetimeStamps || initialStamps,
              lastVisitDate: backendMem?.lastVisitDate || new Date().toISOString(),
              history: [
                {
                  id: `act-join-${Date.now()}`,
                  type: "stamp",
                  title: "Welcome Bonus (+1 Stamp)",
                  date: "Just now",
                  description: `Joined ${res.data?.cafeName || cafe?.name || slug}`,
                  stampsDelta: 1,
                },
              ],
              redemptions: [],
            };

            set((state) => {
              const updatedMemberships = {
                ...state.memberships,
                [slug]: newMembership,
              };
              const joinedCount = Object.keys(updatedMemberships).length;
              const newTotalStamps = Object.values(updatedMemberships).reduce(
                (sum, m) => sum + (m.stamps || 0),
                0
              );
              return {
                memberships: updatedMemberships,
                stampsBalance: newTotalStamps,
                user: {
                  ...state.user,
                  joinedCafes: joinedCount,
                  totalStamps: newTotalStamps,
                },
              };
            });

            try {
              useNotificationStore.getState().addNotification({
                title: "Welcome Bonus Stamp!",
                message: `You collected your 1st stamp for joining ${res.data?.cafeName || cafe?.name || slug}!`,
                type: "stamp",
              });
            } catch (notifErr) {
              console.warn("Could not dispatch welcome notification:", notifErr);
            }

            return { success: true, membership: newMembership, cafeSlug: slug };
          }
          return { success: false, error: res?.message || "Failed to join cafe" };
        } catch (err) {
          console.warn("[Loyalty Store] joinCafe error:", err.message);

          // Fallback local join if offline/guest
          const fallbackMembership = {
            cafeSlug,
            joinedAt: new Date().toISOString(),
            stamps: 0,
            totalStamps: cafe?.stampTarget || 10,
            lastVisitDate: null,
            history: [
              {
                id: `act-join-${Date.now()}`,
                type: "join",
                title: "Joined Loyalty Program",
                date: "Just now",
                description: `Joined ${cafe?.name || cafeSlug}`,
                stampsDelta: 0,
              },
            ],
            redemptions: [],
          };

          set((state) => {
            const updatedMemberships = {
              ...state.memberships,
              [cafeSlug]: fallbackMembership,
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

          return { success: true, membership: fallbackMembership, cafeSlug };
        }
      },

      // Leave a cafe loyalty program
      leaveCafe: async (cafeSlugOrId) => {
        const { memberships } = get();
        const mem =
          memberships[cafeSlugOrId] ||
          Object.values(memberships).find((m) => m.cafeId === cafeSlugOrId);
        const cafeId = mem?.cafeId || cafeSlugOrId;
        const targetSlug = mem?.cafeSlug || cafeSlugOrId;

        try {
          await apiLeaveCafe(cafeId);
        } catch (err) {
          console.warn("[Loyalty Store] leaveCafe error:", err.message);
        }

        set((state) => {
          const updated = { ...state.memberships };
          delete updated[targetSlug];
          delete updated[cafeSlugOrId];
          const joinedCount = Object.keys(updated).length;
          return {
            memberships: updated,
            user: {
              ...state.user,
              joinedCafes: joinedCount,
            },
          };
        });

        return { success: true };
      },

      // Record a stamp visit
      recordVisit: (cafeSlug, stampsDelta = 1) => {
        const membership = get().getMembership(cafeSlug);
        if (!membership) return { success: false, error: "Not a member of this cafe" };

        const delta = Math.max(1, Number(stampsDelta) || 1);
        const cafe = getCafeBySlug(cafeSlug);
        const cafeName = cafe?.name || membership?.name || "Café";
        const updatedStamps = (membership.stamps || 0) + delta;

        const newActivity = {
          id: `act-${Date.now()}`,
          type: "stamp",
          title: `Visit Recorded (+${delta} Stamp${delta > 1 ? "s" : ""})`,
          date: "Just now",
          description: `${cafeName} • Stamp earned`,
          stampsDelta: delta,
        };

        set((state) => {
          const currentMem = state.memberships[cafeSlug];
          const updatedMem = {
            ...currentMem,
            stamps: updatedStamps,
            totalVisits: (currentMem?.totalVisits || 0) + 1,
            lifetimeStamps: (currentMem?.lifetimeStamps || currentMem?.stamps || 0) + delta,
            lastVisitDate: new Date().toISOString(),
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
            stampsBalance: totalStamps,
            user: {
              ...state.user,
              totalStamps,
            },
          };
        });

        try {
          useNotificationStore.getState().addNotification({
            title: "Stamp Collected!",
            message: `You earned +${delta} stamp${delta > 1 ? "s" : ""} at ${cafeName}! Total: ${updatedStamps} stamps.`,
            type: "stamp",
          });
        } catch (e) {
          console.warn("Could not dispatch notification:", e);
        }

        return { success: true };
      },

      // Redeem a specific reward for a specific cafe
      redeemCafeReward: (cafeSlug, rewardId) => {
        const membership = get().getMembership(cafeSlug);
        if (!membership) {
          return {
            success: false,
            error: "You haven't joined this cafe's loyalty program.",
          };
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
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          ),
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
                  usedAt: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
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
    }),
    {
      name: "stampy_loyalty_store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        memberships: state.memberships,
        stampsBalance: state.stampsBalance,
      }),
    }
  )
);
