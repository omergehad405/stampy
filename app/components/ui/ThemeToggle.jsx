"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

const emptySubscribe = () => () => {};

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
        className="w-9 h-9 p-2 rounded-full text-[var(--mainColor)] opacity-0"
        aria-hidden="true"
      />
    );
  }

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer"
    >
      {isDark ? (
        <LuSun className="w-5 h-5 lg:w-6 lg:h-6" />
      ) : (
        <LuMoon className="w-5 h-5 lg:w-6 lg:h-6" />
      )}
    </button>
  );
}
