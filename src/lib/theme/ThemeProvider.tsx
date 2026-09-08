"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type ThemeMode = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "rm_theme_mode";

function getAutoTheme(): ResolvedTheme {
  const currentHour = new Date().getHours();
  // 06:00 to 18:00 is Light, 18:00 to 06:00 is Dark
  return currentHour >= 6 && currentHour < 18 ? "light" : "dark";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "auto") {
    return getAutoTheme();
  }
  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored theme preference
    const savedMode = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initialMode = savedMode && ["light", "dark", "auto"].includes(savedMode) ? savedMode : "auto";
    setMode(initialMode);
    
    const initialResolved = resolveTheme(initialMode);
    setResolvedTheme(initialResolved);
    document.documentElement.setAttribute("data-theme", initialResolved);
    setMounted(true);

    // If auto mode, update every 10 minutes to handle day/night transition smoothly
    const interval = setInterval(() => {
      if (mode === "auto") {
        const nextResolved = getAutoTheme();
        setResolvedTheme(nextResolved);
        document.documentElement.setAttribute("data-theme", nextResolved);
      }
    }, 600000);

    return () => clearInterval(interval);
  }, [mode]);

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
    const resolved = resolveTheme(newMode);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  };

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setThemeMode("dark");
    } else {
      setThemeMode("light");
    }
  };

  const contextValue = useMemo(
    () => ({
      mode,
      resolvedTheme: mounted ? resolvedTheme : "light",
      setThemeMode,
      toggleTheme,
    }),
    [mode, resolvedTheme, mounted]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
