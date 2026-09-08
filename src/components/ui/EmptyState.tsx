import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, HelpCircle } from "lucide-react";
import { VisualAsset } from "@/lib/assets/manifest";

interface EmptyStateProps {
  icon?: LucideIcon;
  asset?: VisualAsset;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = HelpCircle,
  asset,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="rm-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-12) var(--space-6)",
        maxWidth: "600px",
        margin: "var(--space-8) auto",
      }}
    >
      {asset ? (
        <div style={{ marginBottom: "var(--space-4)" }}>
          <Image
            src={asset.src}
            alt={asset.alt}
            width={asset.width || 120}
            height={asset.height || 120}
            style={{ display: "block" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary-subtle)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "var(--space-4)",
          }}
        >
          <Icon size={32} />
        </div>
      )}

      <h3 style={{ marginBottom: "var(--space-2)" }}>{title}</h3>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: actionText ? "var(--space-6)" : 0,
          maxWidth: "440px",
          fontSize: "0.95rem",
        }}
      >
        {description}
      </p>

      {actionText && (
        <div>
          {actionHref ? (
            <Link href={actionHref} className="btn btn-primary">
              {actionText}
            </Link>
          ) : (
            <button onClick={onAction} className="btn btn-primary">
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
