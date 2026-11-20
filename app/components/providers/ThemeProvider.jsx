"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const activeTheme = stored === "dark" ? "dark" : "light";
      setThemeState(activeTheme);
      const root = document.documentElement;
      if (activeTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme: theme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
