"use client";

import React from "react";

interface SeriesRotationSVGProps {
  angles?: number[];
}

export function SeriesRotationSVG({ angles = [0, 45, 90, 135] }: SeriesRotationSVGProps) {
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
        viewBox="0 0 450 120"
        style={{
          maxWidth: "450px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {angles.map((deg, idx) => (
          <g key={idx} transform={`translate(${15 + idx * 85}, 20)`}>
            {/* Box frame */}
            <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
            
            {/* Rotating Arrow Glyph */}
            <g transform={`translate(32.5, 32.5) rotate(${deg})`}>
              <line x1="0" y1="18" x2="0" y2="-18" stroke="var(--color-primary)" strokeWidth="3" />
              <polygon points="0,-22 -7,-12 7,-12" fill="var(--color-primary)" />
              <circle cx="0" cy="18" r="4" fill="var(--color-accent)" />
            </g>

            {/* Frame Label */}
            <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              ({idx + 1})
            </text>
          </g>
        ))}

        {/* 5th Frame: The '?' Target */}
        <g transform="translate(355, 20)">
          <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" />
          <text x="32.5" y="42" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
            ?
          </text>
          <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
            (Next)
          </text>
        </g>

        <text x="225" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="500">
          Rotation rule: Clockwise +45° progression per step.
        </text>
      </svg>
    </div>
  );
}
