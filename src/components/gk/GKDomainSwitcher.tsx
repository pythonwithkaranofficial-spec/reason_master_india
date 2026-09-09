"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Brain, Globe } from "lucide-react";

interface GKDomainSwitcherProps {
  className?: string;
  size?: "sm" | "md";
  showFullLabel?: boolean;
}

export function GKDomainSwitcher({
  className = "",
  size = "md",
  showFullLabel = false,
}: GKDomainSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isGK = pathname.startsWith("/gk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync localStorage domain flag
    if (typeof window !== "undefined") {
      const activeDomain = isGK ? "gk" : "reasoning";
      localStorage.setItem("rm_active_domain", activeDomain);
    }
  }, [isGK]);

  const handleSwitch = (targetDomain: "reasoning" | "gk") => {
    if (targetDomain === "gk" && !isGK) {
      if (typeof window !== "undefined") {
        localStorage.setItem("rm_active_domain", "gk");
      }
      router.push("/gk");
    } else if (targetDomain === "reasoning" && isGK) {
      if (typeof window !== "undefined") {
        localStorage.setItem("rm_active_domain", "reasoning");
      }
      router.push("/");
    }
  };

  const isSmall = size === "sm";

  return (
    <div
      role="tablist"
      aria-label="Domain Switcher"
      className={`rm-domain-switcher ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "var(--color-primary-subtle)",
        border: "1px solid var(--border-color)",
        borderRadius: "9999px",
        padding: "3px",
        position: "relative",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {/* Reasoning Option */}
      <button
        type="button"
        role="tab"
        aria-selected={!isGK}
        onClick={() => handleSwitch("reasoning")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: isSmall ? "0.3rem 0.65rem" : "0.4rem 0.85rem",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          fontSize: isSmall ? "0.8rem" : "0.86rem",
          fontWeight: !isGK ? 700 : 500,
          color: !isGK ? "#ffffff" : "var(--text-secondary)",
          backgroundColor: !isGK ? "var(--color-primary)" : "transparent",
          boxShadow: !isGK ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
          transition: "all var(--transition-fast)",
          whiteSpace: "nowrap",
        }}
        title="Switch to Reasoning Module"
      >
        <Brain size={isSmall ? 13 : 15} />
        <span>Reasoning</span>
      </button>

      {/* GK Option */}
      <button
        type="button"
        role="tab"
        aria-selected={isGK}
        onClick={() => handleSwitch("gk")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: isSmall ? "0.3rem 0.65rem" : "0.4rem 0.85rem",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          fontSize: isSmall ? "0.8rem" : "0.86rem",
          fontWeight: isGK ? 700 : 500,
          color: isGK ? "#ffffff" : "var(--text-secondary)",
          backgroundColor: isGK ? "var(--color-primary)" : "transparent",
          boxShadow: isGK ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
          transition: "all var(--transition-fast)",
          whiteSpace: "nowrap",
        }}
        title="Switch to General Knowledge Module"
      >
        <Globe size={isSmall ? 13 : 15} />
        <span>{showFullLabel ? "General Knowledge" : "GK"}</span>
      </button>
    </div>
  );
}
