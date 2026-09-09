"use client";

import React from "react";

interface PaperFoldPunchSVGProps {
  mode?: "paper_cutting" | "paper_folding";
  foldingType?: "circle_diameters" | "triangles" | "square_circle" | "lines";
  cuttingType?: "square_quarter_circle" | "semicircle_triangle_notch" | "diagonal_diamond" | "quarter_two_cuts";
  isSolution?: boolean;
}

export function PaperFoldPunchSVG({
  mode = "paper_cutting",
  foldingType = "circle_diameters",
  cuttingType = "square_quarter_circle",
  isSolution = false,
}: PaperFoldPunchSVGProps) {
  // Mode 1: Transparent Paper Folding (Superposition)
  if (mode === "paper_folding") {
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
          viewBox="0 0 440 160"
          style={{
            maxWidth: "440px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {/* Left: Original Transparent Square Sheet (140x100) */}
          <g transform="translate(30, 20)">
            <rect x="0" y="0" width="140" height="90" rx="4" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            {/* Center vertical fold line */}
            <line x1="70" y1="0" x2="70" y2="90" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Left Design & Right Design according to foldingType */}
            {foldingType === "circle_diameters" && (
              <>
                {/* Left: circle with vertical diameter */}
                <circle cx="35" cy="45" r="24" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                <line x1="35" y1="21" x2="35" y2="69" stroke="var(--text-primary)" strokeWidth="2" />
                {/* Right: circle with horizontal diameter */}
                <circle cx="105" cy="45" r="24" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                <line x1="81" y1="45" x2="129" y2="45" stroke="var(--text-primary)" strokeWidth="2" />
              </>
            )}

            {foldingType === "triangles" && (
              <>
                {/* Left: upward pointing triangle */}
                <polygon points="35,22 15,62 55,62" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                {/* Right: downward pointing triangle */}
                <polygon points="105,65 85,25 125,25" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
              </>
            )}

            {foldingType === "square_circle" && (
              <>
                {/* Left: dark square in top-left */}
                <rect x="18" y="16" width="22" height="22" fill="var(--text-primary)" />
                {/* Right: dark circle in bottom-right */}
                <circle cx="118" cy="65" r="11" fill="var(--text-primary)" />
              </>
            )}

            {foldingType === "lines" && (
              <>
                {/* Left: 3 horizontal lines */}
                <line x1="12" y1="30" x2="58" y2="30" stroke="var(--text-primary)" strokeWidth="2" />
                <line x1="12" y1="45" x2="58" y2="45" stroke="var(--text-primary)" strokeWidth="2" />
                <line x1="12" y1="60" x2="58" y2="60" stroke="var(--text-primary)" strokeWidth="2" />
                {/* Right: 3 vertical lines */}
                <line x1="90" y1="20" x2="90" y2="70" stroke="var(--text-primary)" strokeWidth="2" />
                <line x1="105" y1="20" x2="105" y2="70" stroke="var(--text-primary)" strokeWidth="2" />
                <line x1="120" y1="20" x2="120" y2="70" stroke="var(--text-primary)" strokeWidth="2" />
              </>
            )}

            {/* Fold arrow: right folds to left */}
            <path d="M 95 10 L 80 10 M 85 6 L 80 10 L 85 14" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
            <text x="70" y="106" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              Fold along dotted line (←)
            </text>
          </g>

          {/* Arrow */}
          <path d="M 205 65 L 235 65 M 228 59 L 235 65 L 228 71" fill="none" stroke="var(--color-primary)" strokeWidth="2" />

          {/* Right: Folded Result (Half sheet 70x90) */}
          <g transform="translate(265, 20)">
            {isSolution ? (
              <>
                <rect x="0" y="0" width="70" height="90" rx="4" fill="var(--bg-surface)" stroke="var(--color-primary)" strokeWidth="2" />
                {foldingType === "circle_diameters" && (
                  <>
                    <circle cx="35" cy="45" r="24" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="35" y1="21" x2="35" y2="69" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="11" y1="45" x2="59" y2="45" stroke="var(--color-primary)" strokeWidth="2" />
                  </>
                )}
                {foldingType === "triangles" && (
                  <>
                    {/* Hexagram: upward + downward */}
                    <polygon points="35,22 15,62 55,62" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                    <polygon points="35,68 15,28 55,28" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                  </>
                )}
                {foldingType === "square_circle" && (
                  <>
                    <rect x="18" y="16" width="22" height="22" fill="var(--color-primary)" />
                    {/* Circle reflects to bottom-left */}
                    <circle cx="29" cy="65" r="11" fill="var(--color-primary)" />
                  </>
                )}
                {foldingType === "lines" && (
                  <>
                    <line x1="12" y1="30" x2="58" y2="30" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="12" y1="45" x2="58" y2="45" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="12" y1="60" x2="58" y2="60" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="20" y1="20" x2="20" y2="70" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="35" y1="20" x2="35" y2="70" stroke="var(--color-primary)" strokeWidth="2" />
                    <line x1="50" y1="20" x2="50" y2="70" stroke="var(--color-primary)" strokeWidth="2" />
                  </>
                )}
                <text x="35" y="106" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
                  Superimposed Result
                </text>
              </>
            ) : (
              <>
                <rect
                  x="0"
                  y="0"
                  width="70"
                  height="90"
                  rx="4"
                  fill="var(--color-accent-subtle)"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeDasharray="5,4"
                />
                <text x="35" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
                  ?
                </text>
                <text x="35" y="106" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  Result Sheet (?)
                </text>
              </>
            )}
          </g>

          <text x="220" y="145" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="500">
            Determine the pattern formed when the transparent sheet is folded from right to left
          </text>
        </svg>
      </div>
    );
  }

  // Mode 2: Paper Folding & Punch Cutting
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
        {/* Step 1: Initial Sheet with 1st fold line */}
        <g transform="translate(25, 20)">
          <rect x="0" y="0" width="70" height="70" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
          <line x1="35" y1="0" x2="35" y2="70" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />
          <path d="M 52 35 L 38 35 M 42 31 L 38 35 L 42 39" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
          <text x="35" y="86" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Step 1 (Fold ←)
          </text>
        </g>

        {/* Arrow to step 2 */}
        <path d="M 108 55 L 122 55 M 118 51 L 122 55 L 118 59" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />

        {/* Step 2: 2nd fold */}
        <g transform="translate(135, 20)">
          <rect x="0" y="0" width="35" height="70" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
          <line x1="0" y1="35" x2="35" y2="35" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />
          <path d="M 17.5 18 L 17.5 32 M 13.5 28 L 17.5 32 L 21.5 28" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
          <text x="17.5" y="86" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Step 2 (Fold ↓)
          </text>
        </g>

        {/* Arrow to step 3 */}
        <path d="M 205 55 L 219 55 M 215 51 L 219 55 L 215 59" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />

        {/* Step 3: Punch Cut on Folded Quarter */}
        <g transform="translate(235, 20)">
          <rect x="0" y="35" width="35" height="35" fill="var(--color-primary-subtle)" stroke="var(--color-primary)" strokeWidth="2" />
          {cuttingType === "semicircle_triangle_notch" ? (
            <polygon points="17.5,62 10,70 25,70" fill="var(--color-error)" />
          ) : cuttingType === "diagonal_diamond" ? (
            <polygon points="17.5,46 24,52.5 17.5,59 11,52.5" fill="var(--color-error)" />
          ) : cuttingType === "quarter_two_cuts" ? (
            <>
              <circle cx="10" cy="45" r="3.5" fill="var(--color-error)" />
              <circle cx="25" cy="60" r="3.5" fill="var(--color-error)" />
            </>
          ) : (
            <circle cx="17.5" cy="52.5" r="5" fill="var(--color-error)" />
          )}
          <text x="17.5" y="86" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Step 3 (Punch)
          </text>
        </g>

        {/* Arrow to result */}
        <path d="M 305 55 L 325 55 M 320 51 L 325 55 L 320 59" fill="none" stroke="var(--color-primary)" strokeWidth="2" />

        {/* Step 4: Unfolded Result OR Target Box */}
        <g transform="translate(345, 20)">
          {isSolution ? (
            <>
              <rect x="0" y="0" width="70" height="70" fill="var(--bg-surface)" stroke="var(--color-primary)" strokeWidth="2" />
              <line x1="0" y1="35" x2="70" y2="35" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="35" y1="0" x2="35" y2="70" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
              {/* Symmetrically unfolded cuts */}
              <circle cx="17.5" cy="17.5" r="4.5" fill="var(--color-error)" />
              <circle cx="52.5" cy="17.5" r="4.5" fill="var(--color-error)" />
              <circle cx="17.5" cy="52.5" r="4.5" fill="var(--color-error)" />
              <circle cx="52.5" cy="52.5" r="4.5" fill="var(--color-error)" />
              <text x="35" y="86" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
                Unfolded Pattern
              </text>
            </>
          ) : (
            <>
              <rect
                x="0"
                y="0"
                width="70"
                height="70"
                rx="6"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeDasharray="5,4"
              />
              <text x="35" y="42" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
                ?
              </text>
              <text x="35" y="86" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                Unfolded (?)
              </text>
            </>
          )}
        </g>

        <text x="230" y="124" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="500">
          Reverse fold lines symmetrically to determine the position of all punch cuts
        </text>
      </svg>
    </div>
  );
}
