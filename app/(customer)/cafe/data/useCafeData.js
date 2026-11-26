"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { getCafeBySlug, registerCafeCatalogEntry } from "./cafesCatalog";
import { apiGetCafeBySlug } from "@/app/lib/cafeApi";

// Stable external store for client-side time
let currentTimeSnapshot = typeof window !== "undefined" ? Date.now() : null;
const listeners = new Set();

if (typeof window !== "undefined") {
  setInterval(() => {
    currentTimeSnapshot = Date.now();
    listeners.forEach((listener) => listener());
  }, 60000);
}

function subscribeTime(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getClientTime() {
  return currentTimeSnapshot;
}

function getServerTime() {
  return null;
}

/**
 * Calculates whether the cafe is currently open, and returns formatted status.
 * Safely handles missing or irregular schedule data.
 */
function computeOpenStatus(schedule, timestamp, timezone = "Africa/Cairo") {
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0 || !timestamp) {
    return {
      isOpenNow: null,
      statusLabel: "Hours not available",
      statusColor: "neutral",
      todaySchedule: null,
      todayDayName: "",
    };
  }

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp));
  const currentDayName = dateParts.find((part) => part.type === "weekday").value;
  const currentHours = Number(dateParts.find((part) => part.type === "hour").value);
  const currentMinutes = Number(dateParts.find((part) => part.type === "minute").value);
  const currentTimeNumber = currentHours * 60 + currentMinutes;

  const today = schedule.find(
    (item) => item.day.toLowerCase() === currentDayName.toLowerCase()
  );

  if (!today || today.isClosed) {
    return {
      isOpenNow: false,
      statusLabel: "Closed Today",
      statusColor: "rose",
      todaySchedule: today || { day: currentDayName, isClosed: true },
      todayDayName: currentDayName,
    };
  }

  // Parse "HH:MM"
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const openTime = parseTime(today.open);
  const closeTime = parseTime(today.close);

  // Format 24h to 12h AM/PM
  const format12h = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const adjustedH = h % 12 || 12;
    const formattedM = m > 0 ? `:${m.toString().padStart(2, "0")}` : "";
    return `${adjustedH}${formattedM} ${period}`;
  };

  if (currentTimeNumber >= openTime && currentTimeNumber < closeTime) {
    return {
      isOpenNow: true,
      statusLabel: `Open Now • Closes at ${format12h(today.close)}`,
      statusColor: "emerald",
      todaySchedule: today,
      todayDayName: currentDayName,
      formattedClose: format12h(today.close),
      formattedOpen: format12h(today.open),
    };
  } else if (currentTimeNumber < openTime) {
    return {
      isOpenNow: false,
      statusLabel: `Closed • Opens at ${format12h(today.open)}`,
      statusColor: "amber",
      todaySchedule: today,
      todayDayName: currentDayName,
      formattedClose: format12h(today.close),
      formattedOpen: format12h(today.open),
    };
  } else {
    return {
      isOpenNow: false,
      statusLabel: `Closed for today`,
      statusColor: "rose",
      todaySchedule: today,
      todayDayName: currentDayName,
      formattedClose: format12h(today.close),
      formattedOpen: format12h(today.open),
    };
  }
}

/**
 * Custom hook to retrieve live cafe data from API and computed helpers.
 * Can be called with a cafe slug or cafe object, or with no params for default.
 */
export function useCafeData(slugOrCafe = null) {
  const [fetchedCafe, setFetchedCafe] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(slugOrCafe && typeof slugOrCafe === "string"));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!slugOrCafe || typeof slugOrCafe !== "string") return;

    let isCancelled = false;
    async function fetchCafe() {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await apiGetCafeBySlug(slugOrCafe);
        if (!isCancelled) {
          if (data) {
            setFetchedCafe(data);
            try {
              registerCafeCatalogEntry(data.slug || slugOrCafe, data);
            } catch (e) {
              console.warn("Could not register in catalog:", e);
            }
          } else {
            const fallback = getCafeBySlug(slugOrCafe);
            setFetchedCafe(fallback || null);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("[useCafeData] Using catalog fallback:", err.message);
          const fallback = getCafeBySlug(slugOrCafe);
          setFetchedCafe(fallback || null);
          setIsError(!fallback);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchCafe();

    return () => {
      isCancelled = true;
    };
  }, [slugOrCafe]);

  const cafe = useMemo(() => {
    if (typeof slugOrCafe === "object" && slugOrCafe !== null) {
      return slugOrCafe;
    }
    if (fetchedCafe) return fetchedCafe;
    if (typeof slugOrCafe === "string") {
      return getCafeBySlug(slugOrCafe) || null;
    }
    return getCafeBySlug("coffee-house") || null;
  }, [slugOrCafe, fetchedCafe]);

  // Safely subscribe to client time with a stable snapshot
  const clientTime = useSyncExternalStore(subscribeTime, getClientTime, getServerTime);
  const schedule = cafe?.openingHours?.schedule;
  const timezone = cafe?.openingHours?.timezone || "Africa/Cairo";

  const operatingStatus = useMemo(() => {
    if (!clientTime || !schedule) return null;
    return computeOpenStatus(schedule, clientTime, timezone);
  }, [clientTime, schedule, timezone]);

  return {
    cafe,
    isLoading,
    isError,
    operatingStatus,
  };
}
