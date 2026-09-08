import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--space-6)" }}>
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
        }}
      >
        <li>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "var(--text-muted)",
            }}
            title="Home"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
                <ChevronRight size={14} />
              </li>
              <li>
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    style={{
                      color: isLast ? "var(--text-primary)" : "var(--text-muted)",
                      fontWeight: isLast ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
