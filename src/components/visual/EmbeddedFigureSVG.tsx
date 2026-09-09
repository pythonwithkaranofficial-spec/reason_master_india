"use client";

import React from "react";

export type EmbeddedShapeType = "z_shape" | "triangle" | "f_shape" | "diamond";

interface EmbeddedFigureSVGProps {
  shapeType?: EmbeddedShapeType;
  isSolution?: boolean;
}

export function EmbeddedFigureSVG({
  shapeType = "z_shape",
  isSolution = false,
}: EmbeddedFigureSVGProps) {
  // Render the target figure (X)
  const renderShapeX = () => {
    switch (shapeType) {
      case "z_shape":
        return (
          <g transform="translate(40, 20)">
            <polyline
              points="10,15 50,15 15,55 55,55"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      case "triangle":
        return (
          <g transform="translate(40, 20)">
            <polygon
              points="35,12 12,55 58,55"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      case "f_shape":
        return (
          <g transform="translate(40, 20)">
            <line x1="20" y1="12" x2="20" y2="58" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
            <line x1="20" y1="14" x2="52" y2="14" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
            <line x1="20" y1="34" x2="44" y2="34" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case "diamond":
      default:
        return (
          <g transform="translate(40, 20)">
            <polygon
              points="35,12 58,35 35,58 12,35"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="35" x2="58" y2="35" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
    }
  };

  // Render Candidate figures (A, B, C, D)
  const renderCandidate = (label: string, idx: number, isEmbeddedHost: boolean) => {
    return (
      <g key={label} transform={`translate(${160 + idx * 80}, 20)`}>
        <rect
          x="0"
          y="0"
          width="70"
          height="70"
          rx="6"
          fill={isSolution && isEmbeddedHost ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
          stroke={isSolution && isEmbeddedHost ? "var(--color-accent)" : "var(--border-strong)"}
          strokeWidth={isSolution && isEmbeddedHost ? "2" : "1.5"}
        />

        {/* Patterns */}
        {idx === 0 && (
          // Ladder / Zig-zag structure (Host for Z shape)
          <g transform="translate(5, 5)">
            <line x1="10" y1="5" x2="10" y2="55" stroke={isSolution && shapeType === "z_shape" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" />
            <line x1="50" y1="5" x2="50" y2="55" stroke={isSolution && shapeType === "z_shape" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" />
            <polyline
              points="10,15 50,15 10,40 50,40"
              fill="none"
              stroke={isSolution && shapeType === "z_shape" ? "var(--color-accent)" : "var(--text-secondary)"}
              strokeWidth={isSolution && shapeType === "z_shape" ? "3.5" : "1.5"}
            />
          </g>
        )}

        {idx === 1 && (
          // Isometric hexagonal grid / Rings (Host for Triangle)
          <g transform="translate(5, 5)">
            <circle cx="30" cy="30" r="22" fill="none" stroke={isSolution && shapeType === "triangle" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" />
            <polygon
              points="30,12 12,46 48,46"
              fill="none"
              stroke={isSolution && shapeType === "triangle" ? "var(--color-accent)" : "var(--text-secondary)"}
              strokeWidth={isSolution && shapeType === "triangle" ? "3.5" : "1.5"}
            />
          </g>
        )}

        {idx === 2 && (
          // Architectural window grid (Host for F shape)
          <g transform="translate(5, 5)">
            <rect x="8" y="8" width="44" height="44" fill="none" stroke={isSolution && shapeType === "f_shape" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" />
            <line x1="8" y1="26" x2="52" y2="26" stroke={isSolution && shapeType === "f_shape" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" />
            <line x1="30" y1="8" x2="30" y2="52" stroke={isSolution && shapeType === "f_shape" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" />
            {isSolution && shapeType === "f_shape" && (
              <>
                <line x1="16" y1="14" x2="16" y2="44" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="16" y1="14" x2="40" y2="14" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="16" y1="28" x2="34" y2="28" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {idx === 3 && (
          // Kite & lattice (Host for Diamond with midline)
          <g transform="translate(5, 5)">
            <polygon
              points="30,8 52,30 30,52 8,30"
              fill="none"
              stroke={isSolution && shapeType === "diamond" ? "var(--color-accent)" : "var(--text-secondary)"}
              strokeWidth={isSolution && shapeType === "diamond" ? "3.5" : "1.5"}
            />
            <line
              x1="8"
              y1="30"
              x2="52"
              y2="30"
              stroke={isSolution && shapeType === "diamond" ? "var(--color-accent)" : "var(--text-secondary)"}
              strokeWidth={isSolution && shapeType === "diamond" ? "3.5" : "1.5"}
            />
            <line x1="30" y1="8" x2="30" y2="52" stroke={isSolution && shapeType === "diamond" ? "var(--border-color)" : "var(--text-secondary)"} strokeWidth="1.5" strokeDasharray="3,3" />
          </g>
        )}

        <text x="35" y="85" textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="700">
          ({label})
        </text>
      </g>
    );
  };

  // Determine which candidate is host
  const hostIndex =
    shapeType === "z_shape" ? 0 : shapeType === "triangle" ? 1 : shapeType === "f_shape" ? 2 : 3;

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
        viewBox="0 0 500 130"
        style={{
          maxWidth: "500px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {/* Question Figure X */}
        <g transform="translate(20, 20)">
          <rect
            x="0"
            y="0"
            width="110"
            height="70"
            rx="6"
            fill="var(--bg-surface)"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          {renderShapeX()}
          <text x="55" y="85" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
            Figure (X)
          </text>
        </g>

        {/* Divider */}
        <line x1="145" y1="15" x2="145" y2="105" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="4,4" />

        {/* 4 Candidate Answer Figures */}
        {["A", "B", "C", "D"].map((lbl, idx) =>
          renderCandidate(lbl, idx, idx === hostIndex)
        )}

        <text x="250" y="120" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          {isSolution
            ? `Figure (${["A", "B", "C", "D"][hostIndex]}) embeds Question Figure (X) highlighted above.`
            : "Select the answer figure (A, B, C, or D) that embeds Figure (X)"}
        </text>
      </svg>
    </div>
  );
}
