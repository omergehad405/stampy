"use client";

import React, { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { LuMoon, LuSun } from "react-icons/lu";

const emptySubscribe = () => () => { };

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return (
      <div
        className="w-9 h-9 p-2 rounded-full text-(--mainColor) opacity-0"
        aria-hidden="true"
      />
    );
  }

  const isDark = (resolvedTheme || theme) === "dark";

  const toggleThemeWithCircularReveal = (e) => {
    const nextTheme = isDark ? "light" : "dark";

    // Fallback if View Transitions API is not supported or user prefers reduced motion
    if (
      typeof document === "undefined" ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // Get click coordinates (or center of the button)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    // Calculate distance to the furthest corner of the viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Set custom properties on the root element BEFORE starting transition
    // so that the initial keyframe (0px) is applied on the very first frame
    document.documentElement.style.setProperty("--reveal-x", `${x}px`);
    document.documentElement.style.setProperty("--reveal-y", `${y}px`);
    document.documentElement.style.setProperty("--reveal-r", `${endRadius}px`);

    // Temporarily disable CSS color transitions so elements don't fade/interpolate before the reveal
    document.documentElement.classList.add("disable-transitions");

    // Start View Transition with flushSync to guarantee synchronous DOM snapshot
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("disable-transitions");
    });
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleThemeWithCircularReveal}
      className="p-2 rounded-full hover:bg-(--mainColor)/10 text-(--mainColor) transition-colors cursor-pointer"
    >
      {isDark ? (
        <LuSun className="w-5 h-5 lg:w-6 lg:h-6" />
      ) : (
        <LuMoon className="w-5 h-5 lg:w-6 lg:h-6" />
      )}
    </button>
  );
}
