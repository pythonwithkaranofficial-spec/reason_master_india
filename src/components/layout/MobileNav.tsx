"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavIconVerbal,
  NavIconNonVerbal,
  NavIconExams,
  NavIconPractice,
} from "@/components/navigation/NavIcons";

function HomeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5L10 3l7 5.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5z" />
      <polyline points="7 18 7 11 13 11 13 18" />
    </svg>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav during active test/session to give maximum focus
  if (pathname.includes("/practice/session")) {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: HomeIcon, exact: true },
    { label: "Verbal", href: "/verbal", icon: NavIconVerbal },
    { label: "Non-Verbal", href: "/nonverbal", icon: NavIconNonVerbal },
    { label: "Exams", href: "/exams", icon: NavIconExams },
    { label: "Practice", href: "/practice", icon: NavIconPractice },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile bottom navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(var(--mobile-nav-height, 64px) + env(safe-area-inset-bottom, 0px))",
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-color)",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 var(--space-2) env(safe-area-inset-bottom, 0px)",
      }}
    >
      {items.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              flex: 1,
              height: "100%",
              minWidth: "48px",
              minHeight: "44px",
              color: isActive ? "var(--color-primary)" : "var(--text-muted)",
              textDecoration: "none",
              transition: "color var(--transition-fast)",
            }}
          >
            <item.icon size={20} />
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <style jsx global>{`
        @media (min-width: 1140px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
