"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { getCafeBySlug } from "./cafesCatalog";
import { MOCK_CAFE_DATA } from "./cafeData";

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
function computeOpenStatus(schedule, timestamp) {
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0 || !timestamp) {
    return {
      isOpenNow: null,
      statusLabel: "Hours not available",
      statusColor: "neutral",
      todaySchedule: null,
      todayDayName: "",
    };
  }

  const dateObj = new Date(timestamp);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDayName = daysOfWeek[dateObj.getDay()];
  const currentHours = dateObj.getHours();
  const currentMinutes = dateObj.getMinutes();
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
 * Custom hook to retrieve cafe data and computed helpers.
 * Can be called with a cafe slug or cafe object, or with no params for default.
 */
export function useCafeData(slugOrCafe = null) {
  const cafe = useMemo(() => {
    if (!slugOrCafe) {
      return getCafeBySlug("coffee-house") || MOCK_CAFE_DATA;
    }
    if (typeof slugOrCafe === "string") {
      return getCafeBySlug(slugOrCafe) || getCafeBySlug("coffee-house") || MOCK_CAFE_DATA;
    }
    return slugOrCafe;
  }, [slugOrCafe]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Safely subscribe to client time with a stable snapshot
  const clientTime = useSyncExternalStore(subscribeTime, getClientTime, getServerTime);
  const schedule = cafe?.openingHours?.schedule;

  const operatingStatus = useMemo(() => {
    if (!clientTime || !schedule) return null;
    return computeOpenStatus(schedule, clientTime);
  }, [clientTime, schedule]);

  return {
    cafe,
    isLoading,
    isError,
    operatingStatus,
  };
}
