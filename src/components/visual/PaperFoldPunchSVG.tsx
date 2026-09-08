"use client";

import React from "react";

export function PaperFoldPunchSVG() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-2)",
        margin: "var(--space-4) 0",
      }}
    >
      <svg
        viewBox="0 0 460 140"
        style={{
          maxWidth: "460px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {/* Step 1: Initial Full Square with horizontal fold line */}
        <g transform="translate(25, 25)">
          <rect x="0" y="0" width="70" height="70" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
          <line x1="0" y1="35" x2="70" y2="35" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />
          {/* Downward fold arrow */}
          <path d="M 35 15 L 35 32 M 31 28 L 35 32 L 39 28" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
          <text x="35" y="88" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Step 1 (Fold ↓)
          </text>
        </g>

        {/* Arrow to step 2 */}
        <path d="M 108 60 L 122 60 M 118 56 L 122 60 L 118 64" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />

        {/* Step 2: Half Folded with vertical fold line */}
        <g transform="translate(135, 25)">
          <rect x="0" y="35" width="70" height="35" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
          <line x1="35" y1="35" x2="35" y2="70" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />
          {/* Rightward fold arrow */}
          <path d="M 15 52.5 L 32 52.5 M 28 48.5 L 32 52.5 L 28 56.5" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
          <text x="35" y="88" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Step 2 (Fold →)
          </text>
        </g>

        {/* Arrow to step 3 */}
        <path d="M 218 60 L 232 60 M 228 56 L 232 60 L 228 64" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />

        {/* Step 3: Quarter Folded with Punched Circle Hole */}
        <g transform="translate(245, 25)">
          <rect x="35" y="35" width="35" height="35" fill="var(--color-primary-subtle)" stroke="var(--color-primary)" strokeWidth="2" />
          {/* Punch Hole */}
          <circle cx="52.5" cy="52.5" r="6" fill="var(--color-error)" />
          <text x="52.5" y="88" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Step 3 (Punch •)
          </text>
        </g>

        {/* Arrow to result */}
        <path d="M 328 60 L 342 60 M 338 56 L 342 60 L 338 64" fill="none" stroke="var(--color-primary)" strokeWidth="2" />

        {/* Step 4: Unfolded Pattern (Symmetric 4 Holes) */}
        <g transform="translate(355, 25)">
          <rect x="0" y="0" width="70" height="70" fill="var(--bg-surface)" stroke="var(--color-primary)" strokeWidth="2" />
          <line x1="0" y1="35" x2="70" y2="35" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="35" y1="0" x2="35" y2="70" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
          {/* 4 Symmetric Punch Holes */}
          <circle cx="17.5" cy="17.5" r="5" fill="var(--color-error)" />
          <circle cx="52.5" cy="17.5" r="5" fill="var(--color-error)" />
          <circle cx="17.5" cy="52.5" r="5" fill="var(--color-error)" />
          <circle cx="52.5" cy="52.5" r="5" fill="var(--color-error)" />
          <text x="35" y="88" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
            Result (Unfolded)
          </text>
        </g>

        <text x="230" y="125" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="500">
          Reverse steps symmetrically to determine the position of all punched cuts.
        </text>
      </svg>
    </div>
  );
}
