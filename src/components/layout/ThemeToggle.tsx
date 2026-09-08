"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { NavIconTheme } from "@/components/navigation/NavIcons";

export function ThemeToggle() {
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="btn btn-secondary btn-sm"
        style={{ padding: "0.45rem 0.65rem", display: "inline-flex", alignItems: "center" }}
        aria-label="Toggle theme"
      >
        <NavIconTheme size={18} isDark={false} />
      </button>
    );
  }

  const cycleTheme = () => {
    if (mode === "auto") {
      setThemeMode("light");
    } else if (mode === "light") {
      setThemeMode("dark");
    } else {
      setThemeMode("auto");
    }
  };

  const isDark = resolvedTheme === "dark";

  const getTitle = () => {
    if (mode === "auto") return "Theme: Auto (Day/Night) - Click to change";
    if (mode === "light") return "Theme: Light - Click to change";
    return "Theme: Dark - Click to change";
  };

  return (
    <button
      onClick={cycleTheme}
      className="btn btn-secondary btn-sm"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: "0.45rem 0.75rem",
        borderRadius: "var(--radius-md)",
      }}
      title={getTitle()}
      aria-label={getTitle()}
    >
      <NavIconTheme size={18} isDark={isDark} />
      <span style={{ fontSize: "0.82rem", textTransform: "capitalize", fontWeight: 500 }}>
        {mode}
      </span>
    </button>
  );
}
