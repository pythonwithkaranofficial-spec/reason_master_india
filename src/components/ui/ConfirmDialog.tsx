"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
      }}
      onClick={onCancel}
    >
      <div
        className="rm-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "var(--space-6)",
          position: "relative",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "var(--space-4)",
            right: "var(--space-4)",
            color: "var(--text-muted)",
            padding: "var(--space-1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-sm)",
          }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          {isDestructive && (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-error-bg)",
                color: "var(--color-error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
          )}

          <div>
            <h3 id="dialog-title" style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)" }}>
              {title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--space-3)",
            marginTop: "var(--space-6)",
          }}
        >
          <button onClick={onCancel} className="btn btn-secondary">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${isDestructive ? "btn-danger" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
