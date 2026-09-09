"use client";

import React from "react";

interface MatrixCompletionSVGProps {
  mode?: "symbol_matrix" | "figure_completion";
  completionType?: "concentric_arcs" | "floral_diamond" | "circular_mandala" | "grid_cross";
  cells?: string[][];
  isSolution?: boolean;
}

export function MatrixCompletionSVG({
  mode = "symbol_matrix",
  completionType = "concentric_arcs",
  cells = [
    ["▲", "▲▲", "▲▲▲"],
    ["■", "■■", "■■■"],
    ["●", "●●", "?"],
  ],
  isSolution = false,
}: MatrixCompletionSVGProps) {
  // Mode 1: Figure Completion (4 Quadrants with 1 Missing Sector)
  if (mode === "figure_completion") {
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
          viewBox="0 0 240 230"
          style={{
            maxWidth: "240px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <g transform="translate(40, 25)">
            {/* Outer Box 160x160 */}
            <rect x="0" y="0" width="160" height="160" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
            {/* Quadrant dividing lines */}
            <line x1="80" y1="0" x2="80" y2="160" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="0" y1="80" x2="160" y2="80" stroke="var(--border-strong)" strokeWidth="2" />

            {/* Pattern Type 1: Concentric Arcs + Diagonal (missing bottom-right) */}
            {completionType === "concentric_arcs" && (
              <>
                {/* Top-Left Quadrant */}
                <path d="M 80 40 A 40 40 0 0 0 40 80" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <path d="M 80 20 A 60 60 0 0 0 20 80" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <line x1="80" y1="80" x2="0" y2="0" stroke="var(--color-primary)" strokeWidth="1.5" />

                {/* Top-Right Quadrant */}
                <path d="M 80 40 A 40 40 0 0 1 120 80" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <path d="M 80 20 A 60 60 0 0 1 140 80" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <line x1="80" y1="80" x2="160" y2="0" stroke="var(--color-primary)" strokeWidth="1.5" />

                {/* Bottom-Left Quadrant */}
                <path d="M 80 120 A 40 40 0 0 1 40 80" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <path d="M 80 140 A 60 60 0 0 1 20 80" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <line x1="80" y1="80" x2="0" y2="160" stroke="var(--color-primary)" strokeWidth="1.5" />

                {/* Bottom-Right Quadrant: Missing '?' or Completed */}
                {isSolution ? (
                  <>
                    <path d="M 80 120 A 40 40 0 0 0 120 80" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
                    <path d="M 80 140 A 60 60 0 0 0 140 80" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
                    <line x1="80" y1="80" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="2" />
                  </>
                ) : (
                  <rect x="80" y="80" width="80" height="80" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4,4" />
                )}
              </>
            )}

            {/* Pattern Type 2: Floral Diamond Petals (missing top-right) */}
            {completionType === "floral_diamond" && (
              <>
                {/* Center diamond */}
                <polygon points="80,20 140,80 80,140 20,80" fill="none" stroke="var(--border-color)" strokeWidth="1.5" />
                {/* Top-Left Petal */}
                <path d="M 80 80 Q 50 30 20 20 Q 70 50 80 80" fill="var(--color-primary-subtle)" stroke="var(--color-primary)" strokeWidth="1.5" />
                {/* Bottom-Left Petal */}
                <path d="M 80 80 Q 50 130 20 140 Q 70 110 80 80" fill="var(--color-primary-subtle)" stroke="var(--color-primary)" strokeWidth="1.5" />
                {/* Bottom-Right Petal */}
                <path d="M 80 80 Q 110 130 140 140 Q 90 110 80 80" fill="var(--color-primary-subtle)" stroke="var(--color-primary)" strokeWidth="1.5" />

                {/* Top-Right: Missing or Completed */}
                {isSolution ? (
                  <path d="M 80 80 Q 110 30 140 20 Q 90 50 80 80" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" />
                ) : (
                  <rect x="80" y="0" width="80" height="80" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4,4" />
                )}
              </>
            )}

            {/* Pattern Type 3: Circular Mandala Rings (missing bottom-left) */}
            {completionType === "circular_mandala" && (
              <>
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <circle cx="80" cy="80" r="50" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                <circle cx="80" cy="80" r="30" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                {/* Spokes */}
                <line x1="80" y1="10" x2="80" y2="150" stroke="var(--border-strong)" strokeWidth="1.5" />
                <line x1="10" y1="80" x2="150" y2="80" stroke="var(--border-strong)" strokeWidth="1.5" />
                <line x1="30" y1="30" x2="130" y2="130" stroke="var(--border-strong)" strokeWidth="1.5" />

                {isSolution ? (
                  <path d="M 80 80 L 45 115 A 50 50 0 0 0 80 130 Z" fill="var(--color-accent)" />
                ) : (
                  <rect x="0" y="80" width="80" height="80" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4,4" />
                )}
              </>
            )}

            {/* Pattern Type 4: Grid Cross (missing lower-right) */}
            {completionType === "grid_cross" && (
              <>
                <line x1="80" y1="80" x2="20" y2="20" stroke="var(--color-primary)" strokeWidth="2" />
                <circle cx="20" cy="20" r="6" fill="var(--color-primary)" />
                <line x1="80" y1="80" x2="140" y2="20" stroke="var(--color-primary)" strokeWidth="2" />
                <circle cx="140" cy="20" r="6" fill="var(--color-primary)" />
                <line x1="80" y1="80" x2="20" y2="140" stroke="var(--color-primary)" strokeWidth="2" />
                <circle cx="20" cy="140" r="6" fill="var(--color-primary)" />

                {isSolution ? (
                  <>
                    <line x1="80" y1="80" x2="140" y2="140" stroke="var(--color-accent)" strokeWidth="2.5" />
                    <circle cx="140" cy="140" r="6" fill="var(--color-accent)" />
                  </>
                ) : (
                  <rect x="80" y="80" width="80" height="80" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4,4" />
                )}
              </>
            )}

            {/* Question Mark on missing sector in question mode */}
            {!isSolution && (
              <text
                x={completionType === "floral_diamond" ? 120 : completionType === "circular_mandala" ? 40 : 120}
                y={completionType === "floral_diamond" ? 48 : completionType === "circular_mandala" ? 128 : 128}
                textAnchor="middle"
                fill="var(--color-accent)"
                fontSize="30"
                fontWeight="800"
              >
                ?
              </text>
            )}
          </g>

          <text x="120" y="212" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            {isSolution ? "Completed figure pattern" : "Select option figure to complete the missing quadrant (?) "}
          </text>
        </svg>
      </div>
    );
  }

  // Mode 2: Symbol Matrix Completion
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
        viewBox="0 0 240 230"
        style={{
          maxWidth: "240px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        <g transform="translate(30, 25)">
          {cells.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isTarget = val === "?";
              return (
                <g key={`${rIdx}-${cIdx}`} transform={`translate(${cIdx * 60}, ${rIdx * 55})`}>
                  <rect
                    x="0"
                    y="0"
                    width="55"
                    height="50"
                    rx="4"
                    fill={isTarget ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
                    stroke={isTarget ? "var(--color-accent)" : "var(--border-strong)"}
                    strokeWidth={isTarget ? "2" : "1.5"}
                  />
                  <text
                    x="27.5"
                    y="32"
                    textAnchor="middle"
                    fill={isTarget ? "var(--color-accent)" : "var(--text-primary)"}
                    fontSize={isTarget ? "22" : "16"}
                    fontWeight="800"
                  >
                    {val}
                  </text>
                </g>
              );
            })
          )}
        </g>
        <text x="120" y="210" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          Identify row/column rule to replace &apos;?&apos;
        </text>
      </svg>
    </div>
  );
}
