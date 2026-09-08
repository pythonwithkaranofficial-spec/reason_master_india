"use client";

import React from "react";

interface CubeDiceSVGProps {
  mode?: "isometric" | "unfolded";
  topFace?: string | number;
  frontFace?: string | number;
  rightFace?: string | number;
  unfoldedFaces?: (string | number)[]; // 6 faces [top, left, center, right, bottom, far-bottom]
}

export function CubeDiceSVG({
  mode = "isometric",
  topFace = "1",
  frontFace = "2",
  rightFace = "3",
  unfoldedFaces = ["1", "4", "2", "3", "6", "5"],
}: CubeDiceSVGProps) {
  if (mode === "unfolded") {
    // Unfolded standard cross net
    // Layout:
    //      [1]          (Top face)
    //  [4] [2] [3]      (Left, Center, Right)
    //      [6]          (Bottom)
    //      [5]          (Far bottom)
    const [f1, f4, f2, f3, f6, f5] = unfoldedFaces;

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
          viewBox="0 0 280 260"
          style={{
            maxWidth: "280px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {/* Unfolded Net of 6 Squares, size 45x45 */}
          <g transform="translate(45, 20)">
            {/* Top row: column 2 */}
            <rect x="50" y="0" width="45" height="45" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="72.5" y="28" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {f1}
            </text>

            {/* Middle row: column 1, 2, 3 */}
            <rect x="5" y="45" width="45" height="45" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="27.5" y="73" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {f4}
            </text>

            <rect x="50" y="45" width="45" height="45" fill="var(--color-primary-subtle)" stroke="var(--color-primary)" strokeWidth="2" />
            <text x="72.5" y="73" textAnchor="middle" fill="var(--color-primary)" fontSize="18" fontWeight="700">
              {f2}
            </text>

            <rect x="95" y="45" width="45" height="45" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="117.5" y="73" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {f3}
            </text>

            {/* Third row: column 2 */}
            <rect x="50" y="90" width="45" height="45" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="72.5" y="118" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {f6}
            </text>

            {/* Fourth row: column 2 */}
            <rect x="50" y="135" width="45" height="45" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="72.5" y="163" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {f5}
            </text>
          </g>

          <text x="140" y="240" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Opposite Pairs: {f1} ↔ {f6}, {f4} ↔ {f3}, {f2} ↔ {f5}
          </text>
        </svg>
      </div>
    );
  }

  // Isometric 3D Cube View
  // Center vertex is at (120, 100)
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
        viewBox="0 0 240 220"
        style={{
          maxWidth: "240px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        <g transform="translate(120, 110)">
          {/* Top Face: points (0, -70), (60, -35), (0, 0), (-60, -35) */}
          <polygon
            points="0,-70 60,-35 0,0 -60,-35"
            fill="var(--bg-surface)"
            stroke="var(--border-strong)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="0" y="-30" textAnchor="middle" fill="var(--color-primary)" fontSize="20" fontWeight="800">
            {topFace}
          </text>

          {/* Left / Front Face: points (0, 0), (-60, -35), (-60, 45), (0, 80) */}
          <polygon
            points="0,0 -60,-35 -60,45 0,80"
            fill="var(--bg-surface)"
            stroke="var(--border-strong)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="-30" y="30" textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="800">
            {frontFace}
          </text>

          {/* Right Face: points (0, 0), (60, -35), (60, 45), (0, 80) */}
          <polygon
            points="0,0 60,-35 60,45 0,80"
            fill="var(--bg-surface)"
            stroke="var(--border-strong)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="30" y="30" textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="800">
            {rightFace}
          </text>
        </g>
        <text x="120" y="208" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          Standard 3D Cube / Dice View
        </text>
      </svg>
      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Adjacent visible faces can never be opposite to each other.
      </span>
    </div>
  );
}
