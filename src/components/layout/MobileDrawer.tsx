"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ASSETS } from "@/lib/assets/manifest";
import { ThemeToggle } from "./ThemeToggle";
import {
  NavIconVerbal,
  NavIconNonVerbal,
  NavIconExams,
  NavIconPractice,
  NavIconBookmarks,
  NavIconStats,
  NavIconSearch,
  NavIconSettings,
  NavIconClose,
} from "@/components/navigation/NavIcons";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileDrawer({ isOpen, onClose, onOpenSearch }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Verbal Reasoning", href: "/verbal", icon: NavIconVerbal, badge: "25 Topics" },
    { label: "Non-Verbal Reasoning", href: "/nonverbal", icon: NavIconNonVerbal, badge: "14 Topics" },
    { label: "Competitive Exams", href: "/exams", icon: NavIconExams, badge: "64 Exams" },
    { label: "Practice Arena", href: "/practice", icon: NavIconPractice, badge: "19,500 MCQs" },
    { label: "Bookmarked Questions", href: "/bookmarks", icon: NavIconBookmarks },
    { label: "Diagnostic Statistics", href: "/stats", icon: NavIconStats },
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation Menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(2px)",
          animation: "fadeIn 150ms ease-out",
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "340px",
          height: "100%",
          backgroundColor: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          zIndex: 101,
          animation: "slideInRight 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "var(--space-4) var(--space-5)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Image
              src={ASSETS.brand.logoMark.src}
              alt={ASSETS.brand.logoMark.alt}
              width={32}
              height={32}
              style={{ borderRadius: "var(--radius-sm)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              ReasonMaster<span style={{ color: "var(--color-accent)" }}> India</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.4rem", borderRadius: "var(--radius-md)" }}
            aria-label="Close navigation menu"
          >
            <NavIconClose size={18} />
          </button>
        </div>

        {/* Quick Search Action */}
        <div style={{ padding: "var(--space-4) var(--space-5) var(--space-2)" }}>
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="btn btn-secondary"
            style={{
              width: "100%",
              justifyContent: "space-between",
              padding: "0.55rem 0.85rem",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <NavIconSearch size={16} /> Search topics or exams...
            </span>
            <span className="tag" style={{ fontSize: "0.7rem", padding: "0.1rem 0.35rem" }}>
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--space-3) var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--color-primary)" : "var(--text-primary)",
                  backgroundColor: isActive ? "var(--color-primary-subtle)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                  textDecoration: "none",
                  transition: "background-color var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className="tag"
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: isActive ? "var(--color-primary)" : undefined,
                      color: isActive ? "#ffffff" : undefined,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer Utilities (Settings & Theme) */}
        <div
          style={{
            padding: "var(--space-4) var(--space-5)",
            borderTop: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-3)",
          }}
        >
          <Link
            href="/settings"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "0.45rem 0.75rem",
              textDecoration: "none",
            }}
          >
            <NavIconSettings size={16} />
            <span>Settings</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
