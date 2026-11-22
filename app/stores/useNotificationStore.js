import { create } from "zustand";
import { persist } from "zustand/middleware";

export const INITIAL_NOTIFICATIONS = [];

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],

      // Add a new notification dynamically to the top of the box
      addNotification: ({ title, message, type = "reward" }) =>
        set((state) => ({
          notifications: [
            {
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              title,
              message,
              time: "Just now",
              unread: true,
              type,
            },
            ...state.notifications,
          ],
        })),

      // Mark all notifications as read
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        })),

      // Mark a single notification as read
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, unread: false } : n
          ),
        })),

      // Remove a notification
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: "stampy_notifications_store",
    }
  )
);
