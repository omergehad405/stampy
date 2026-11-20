"use client";

import React, { useState, useEffect } from "react";
import { LuMegaphone, LuX } from "react-icons/lu";
import { apiGetActiveAnnouncements } from "@/app/lib/adminApi";

export default function DashboardAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadActiveAnnouncements() {
      try {
        const res = await apiGetActiveAnnouncements();
        if (isMounted && res?.success && Array.isArray(res?.data?.announcements)) {
          setAnnouncements(res.data.announcements);
        }
      } catch (err) {
        // Silently catch network or auth errors
        console.warn("[Dashboard Announcements] Error loading announcements:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadActiveAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleAnnouncements = announcements.filter(
    (ann) => !dismissedIds.includes(ann.id || ann._id)
  );

  if (isLoading || visibleAnnouncements.length === 0) {
    return null;
  }

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="w-full flex flex-col gap-2 px-4 pt-3 sm:px-6 lg:px-8">
      {visibleAnnouncements.map((ann) => {
        const annId = ann.id || ann._id;
        return (
          <div
            key={annId}
            className="relative flex items-start justify-between gap-3 rounded-2xl border border-(--mainColor)/20 bg-(--secondColor)/25 px-4 py-3 shadow-2xs backdrop-blur-xs transition animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-start gap-3 min-w-0 pr-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor)">
                <LuMegaphone className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-(--mainColor) block text-sm">
                  {ann.title}
                </span>
                <p className="mt-0.5 text-(--mainColor)/80 leading-relaxed break-words whitespace-pre-wrap">
                  {ann.message || ann.body || ann.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(annId)}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-(--mainColor)/60 hover:bg-(--mainColor)/10 hover:text-(--mainColor) transition"
              title="Close notification"
              aria-label="Close notification"
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
