"use client";

import React, { useEffect } from "react";
import {
  LuBell,
  LuCoffee,
  LuGift,
  LuSparkles,
  LuX,
  LuCheckCheck,
} from "react-icons/lu";
import { useNotificationStore } from "@/app/stores/useNotificationStore";

export default function NotificationBox({ isOpen, onClose }) {
  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close with Escape key and lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const renderIcon = (type) => {
    switch (type) {
      case "stamp":
        return <LuCoffee className="w-4 h-4 text-(--mainColor)" />;
      case "reward":
        return <LuGift className="w-4 h-4 text-(--mainColor)" />;
      case "promo":
        return <LuSparkles className="w-4 h-4 text-(--mainColor)" />;
      default:
        return <LuBell className="w-4 h-4 text-(--mainColor)" />;
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Notification Panel (Slides in from outside the screen) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-heading"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm sm:max-w-md bg-(--bgColor) text-(--mainColor) shadow-2xl border-l border-(--mainColor)/15 flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-(--mainColor)/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-(--mainColor) flex items-center justify-center text-(--bgColor) shadow-xs">
              <LuBell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="notifications-heading"
                  className="text-base font-bold leading-tight"
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-(--mainColor)">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs opacity-70">Latest updates & stamp alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-2 rounded-full hover:bg-(--mainColor)/10 text-(--mainColor) transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
              >
                <LuCheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Read all</span>
              </button>
            )}

            {/* Close Button ("X" icon) */}
            <button
              type="button"
              aria-label="Close notifications"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-(--mainColor)/10 text-(--mainColor) transition-colors cursor-pointer"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
              <LuBell className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1">We&apos;ll notify you when you earn stamps!</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`rounded-2xl p-3.5 border transition-all cursor-pointer relative bg-(--mainColor) text-(--bgColor) ${item.unread
                  ? "border-(--secondColor) shadow-xs ring-1 ring-(--secondColor)/30"
                  : "border-(--bgColor)/15 opacity-85 hover:opacity-100"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-(--secondColor) text-[#3B2418] flex items-center justify-center shrink-0 mt-0.5">
                    {renderIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-(--bgColor) truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-(--bgColor)/65 shrink-0">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-xs text-(--bgColor)/80 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {item.unread && (
                    <span
                      aria-label="Unread"
                      className="w-2 h-2 rounded-full bg-(--secondColor) ring-2 ring-(--secondColor)/30 shrink-0 mt-1.5"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-(--mainColor)/10 bg-(--mainColor)/5 flex items-center justify-between gap-3 text-xs">
          <span className="opacity-70">
            {unreadCount === 0
              ? "All notifications caught up"
              : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-(--mainColor) text-(--bgColor) font-semibold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </aside>
    </>
  );
}
