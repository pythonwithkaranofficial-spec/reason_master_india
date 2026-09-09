"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";
import { MobileDrawer } from "./MobileDrawer";
import { ASSETS } from "@/lib/assets/manifest";
import {
  NavIconVerbal,
  NavIconNonVerbal,
  NavIconExams,
  NavIconPractice,
  NavIconBookmarks,
  NavIconStats,
  NavIconSearch,
  NavIconSettings,
  NavIconMenu,
} from "@/components/navigation/NavIcons";
import { GKDomainSwitcher } from "@/components/gk/GKDomainSwitcher";
import { MapPin, Landmark, Globe } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const isGK = pathname.startsWith("/gk");

  useEffect(() => {
    // Detect OS for shortcut indicator
    if (typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
      setIsMac(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const reasoningNavItems = [
    { label: "Verbal", href: "/verbal", icon: NavIconVerbal },
    { label: "Non-Verbal", href: "/nonverbal", icon: NavIconNonVerbal },
    { label: "Exams", href: "/exams", icon: NavIconExams },
    { label: "Practice", href: "/practice", icon: NavIconPractice },
    { label: "Bookmarks", href: "/bookmarks", icon: NavIconBookmarks },
    { label: "Stats", href: "/stats", icon: NavIconStats },
  ];

  const gkNavItems = [
    { label: "States & UTs", href: "/gk/state", icon: MapPin },
    { label: "Indian GK", href: "/gk/national", icon: Landmark },
    { label: "World GK", href: "/gk/world", icon: Globe },
    { label: "Practice", href: "/gk/practice", icon: NavIconPractice },
    { label: "Bookmarks", href: "/gk/bookmarks", icon: NavIconBookmarks },
    { label: "Stats", href: "/gk/stats", icon: NavIconStats },
  ];

  const navItems = isGK ? gkNavItems : reasoningNavItems;

  return (
    <>
      <header
        className="rm-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-color)",
          height: "var(--nav-height, 68px)",
          display: "flex",
          alignItems: "center",
          transition: "background-color var(--transition-fast), border-color var(--transition-fast)",
        }}
      >
        <div
          className="navbar-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-3)",
            width: "100%",
          }}
        >
          {/* 1. LEFT: Brand Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0 }}>
            <Link
              href={isGK ? "/gk" : "/"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--nav-brand-gap, 0.75rem)",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Image
                src={ASSETS.brand.logoMark.src}
                alt={ASSETS.brand.logoMark.alt}
                width={38}
                height={38}
                priority
                style={{
                  borderRadius: "var(--radius-md)",
                  flexShrink: 0,
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.05rem, 3.5vw, 1.2rem)",
                    lineHeight: 1.15,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  ReasonMaster<span style={{ color: "var(--color-accent)" }}> India</span>
                </span>
                <span
                  className="brand-subtitle"
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    marginTop: "1px",
                  }}
                >
                  {isGK ? "36 States & UTs • 17 GK Topics • 100% Verified" : "64+ Competitive Exams • 19,500 MCQs"}
                </span>
              </div>
            </Link>

            {/* Top Domain Switcher */}
            <div className="header-domain-switcher-wrap" style={{ display: "flex", alignItems: "center" }}>
              <GKDomainSwitcher size="sm" />
            </div>
          </div>

          {/* 2. CENTER: Primary Navigation Links */}
          <nav
            aria-label="Primary desktop navigation"
            className="desktop-primary-nav"
            style={{
              display: "none",
              alignItems: "center",
              gap: "var(--nav-item-gap, 0.35rem)",
              flexShrink: 0,
            }}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-tab ${isActive ? "nav-tab-active" : ""}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 0.85rem",
                    minHeight: "40px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.92rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "var(--color-primary-subtle)" : "transparent",
                    border: isActive ? "1px solid var(--border-color)" : "1px solid transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT: Utility Actions (Search, Settings, Theme, Menu) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--nav-utility-gap, 0.45rem)",
              flexShrink: 0,
            }}
          >
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="btn btn-secondary btn-sm search-trigger-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.5rem 0.85rem",
                minHeight: "44px",
                whiteSpace: "nowrap",
                borderRadius: "var(--radius-md)",
              }}
              title={`Search topics or exams (${isMac ? "⌘K" : "Ctrl+K"})`}
              aria-label="Search topics and exams"
            >
              <NavIconSearch size={16} />
              <span className="search-text-label" style={{ fontSize: "0.88rem", fontWeight: 500 }}>
                Search
              </span>
              <kbd
                className="tag search-shortcut-kbd"
                style={{
                  fontSize: "0.68rem",
                  padding: "0.15rem 0.4rem",
                  fontFamily: "inherit",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-muted)",
                }}
              >
                {isMac ? "⌘K" : "Ctrl+K"}
              </kbd>
            </button>

            {/* Settings Link */}
            <Link
              href="/settings"
              className="btn btn-secondary btn-sm settings-nav-btn"
              style={{
                minWidth: "44px",
                minHeight: "44px",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: pathname === "/settings" ? "var(--color-primary)" : "var(--text-secondary)",
                borderRadius: "var(--radius-md)",
              }}
              title="Settings & Display Preferences"
              aria-label="Settings"
            >
              <NavIconSettings size={19} />
            </Link>

            {/* Theme Toggle Button */}
            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>

            {/* Mobile / Tablet Drawer Menu Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="btn btn-secondary btn-sm mobile-menu-trigger"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "44px",
                minHeight: "44px",
                padding: 0,
                borderRadius: "var(--radius-md)",
              }}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <NavIconMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Mobile & Tablet Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <style jsx global>{`
        /* Desktop navigation is shown at >= 1140px */
        @media (min-width: 1140px) {
          .desktop-primary-nav {
            display: flex !important;
          }
          .mobile-menu-trigger {
            display: none !important;
          }
        }

        /* Tablet & Mobile show the Drawer button */
        @media (max-width: 1139px) {
          .desktop-primary-nav {
            display: none !important;
          }
          .mobile-menu-trigger {
            display: inline-flex !important;
          }
        }

        /* Hide brand subtitle under 1340px to protect horizontal layout and zero text wrapping */
        @media (max-width: 1340px) {
          .brand-subtitle {
            display: none !important;
          }
        }

        /* Compact search button on mobile */
        @media (max-width: 640px) {
          .search-shortcut-kbd,
          .search-text-label {
            display: none !important;
          }
          .settings-nav-btn {
            display: none !important;
          }
        }

        /* Focus styles for keyboard accessibility */
        .nav-tab:focus-visible,
        .search-trigger-btn:focus-visible,
        .mobile-menu-trigger:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 2px;
        }

        .nav-tab:hover:not(.nav-tab-active) {
          background-color: var(--bg-surface-hover) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </>
  );
}
