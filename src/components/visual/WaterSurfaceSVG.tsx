"use client";

import React from "react";

interface WaterSurfaceSVGProps {
  content?: string;
}

export function WaterSurfaceSVG({ content = "DISC" }: WaterSurfaceSVGProps) {
  const word = content || "DISC";

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
        viewBox="0 0 360 220"
        style={{
          maxWidth: "360px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {/* Top: Original Object */}
        <g transform="translate(180, 50)">
          <rect x="-100" y="-30" width="200" height="60" rx="6" fill="var(--bg-surface)" stroke="var(--border-color)" />
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="26"
            fontWeight="800"
            fontFamily="monospace"
            letterSpacing="5"
          >
            {word}
          </text>
          <text x="0" y="-38" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Original Figure / Word
          </text>
        </g>

        {/* Center: Water Surface Plane (AB) */}
        <g transform="translate(180, 110)">
          <line x1="-150" y1="0" x2="150" y2="0" stroke="var(--color-primary)" strokeWidth="2.5" />
          {/* Water ripples / hashes below line */}
          {[-130, -100, -70, -40, -10, 20, 50, 80, 110, 140].map((x, idx) => (
            <line key={idx} x1={x} y1="0" x2={x - 8} y2="7" stroke="var(--color-primary)" strokeWidth="1.5" />
          ))}
          <text x="-160" y="4" textAnchor="end" fill="var(--color-primary)" fontSize="11" fontWeight="800">
            A
          </text>
          <text x="160" y="4" textAnchor="start" fill="var(--color-primary)" fontSize="11" fontWeight="800">
            B (Water Surface)
          </text>
        </g>

        {/* Bottom: Inverted Water Reflection */}
        <g transform="translate(180, 170)">
          <rect x="-100" y="-30" width="200" height="60" rx="6" fill="var(--bg-surface)" stroke="var(--border-color)" />
          <g transform="scale(1, -1)">
            <text
              x="0"
              y="9"
              textAnchor="middle"
              fill="var(--color-primary)"
              fontSize="26"
              fontWeight="800"
              fontFamily="monospace"
              letterSpacing="5"
            >
              {word}
            </text>
          </g>
          <text x="0" y="48" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="600">
            Water Image (Vertical Inversion)
          </text>
        </g>
      </svg>
      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Note: Top becomes bottom, bottom becomes top; left and right positions remain the same.
      </span>
    </div>
  );
}
