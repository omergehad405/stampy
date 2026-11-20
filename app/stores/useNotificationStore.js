import { create } from "zustand";
import { persist } from "zustand/middleware";

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Stamp Collected!",
    message:
      "You earned 1 stamp at Downtown Branch. Only 4 more to unlock your free specialty coffee!",
    time: "2 hours ago",
    unread: true,
    type: "stamp",
  },
  {
    id: "notif-2",
    title: "Reward Getting Closer 🎉",
    message:
      "You've collected 6 out of 10 stamps! Keep visiting to earn your reward soon.",
    time: "Yesterday",
    unread: true,
    type: "reward",
  },
  {
    id: "notif-3",
    title: "Double Stamp Tuesday!",
    message:
      "Visit any participating branch between 2 PM and 5 PM tomorrow to earn 2 stamps per drink.",
    time: "2 days ago",
    unread: true,
    type: "promo",
  },
  {
    id: "notif-4",
    title: "Welcome to Stampy",
    message:
      "Your digital loyalty card is all set up. Present your personal QR code at checkout every visit.",
    time: "5 days ago",
    unread: false,
    type: "system",
  },
];

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: INITIAL_NOTIFICATIONS,

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
