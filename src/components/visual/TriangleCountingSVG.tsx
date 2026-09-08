"use client";

import React from "react";

interface TriangleCountingSVGProps {
  figureType?: "partitioned_triangle" | "square_diagonals" | "grid_squares";
  partitions?: number;
}

export function TriangleCountingSVG({
  figureType = "partitioned_triangle",
  partitions = 3,
}: TriangleCountingSVGProps) {
  if (figureType === "square_diagonals") {
    // Square with 2 diagonals and 2 medians dividing into 8 sectors
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
          <g transform="translate(40, 30)">
            {/* Outer Square 160x160 */}
            <rect x="0" y="0" width="160" height="160" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
            
            {/* Diagonals */}
            <line x1="0" y1="0" x2="160" y2="160" stroke="var(--color-primary)" strokeWidth="2" />
            <line x1="160" y1="0" x2="0" y2="160" stroke="var(--color-primary)" strokeWidth="2" />
            
            {/* Medians */}
            <line x1="80" y1="0" x2="80" y2="160" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4,3" />
            <line x1="0" y1="80" x2="160" y2="80" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4,3" />

            {/* 8 Sector Labels */}
            <text x="50" y="32" fill="var(--text-muted)" fontSize="11" fontWeight="700">1</text>
            <text x="100" y="32" fill="var(--text-muted)" fontSize="11" fontWeight="700">2</text>
            <text x="128" y="60" fill="var(--text-muted)" fontSize="11" fontWeight="700">3</text>
            <text x="128" y="110" fill="var(--text-muted)" fontSize="11" fontWeight="700">4</text>
            <text x="100" y="140" fill="var(--text-muted)" fontSize="11" fontWeight="700">5</text>
            <text x="50" y="140" fill="var(--text-muted)" fontSize="11" fontWeight="700">6</text>
            <text x="22" y="110" fill="var(--text-muted)" fontSize="11" fontWeight="700">7</text>
            <text x="22" y="60" fill="var(--text-muted)" fontSize="11" fontWeight="700">8</text>
          </g>
          <text x="120" y="215" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Total Triangles = 8 × 2 = 16
          </text>
        </svg>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          Formula: Count individual small triangles (n) and multiply by 2 (2n).
        </span>
      </div>
    );
  }

  // Partitioned Triangle (Apex joined to Base with n parts)
  const n = Math.max(2, Math.min(5, partitions));
  const baseWidth = 180;
  const height = 140;
  const startX = 30;
  const startY = 160;
  const apexX = startX + baseWidth / 2;
  const apexY = startY - height;

  const segmentWidth = baseWidth / n;
  const partitionLines = [];
  const sectorCenters = [];

  for (let i = 1; i < n; i++) {
    const x = startX + i * segmentWidth;
    partitionLines.push(x);
  }

  for (let i = 0; i < n; i++) {
    const x = startX + i * segmentWidth + segmentWidth / 2;
    sectorCenters.push({ x, num: i + 1 });
  }

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
        viewBox="0 0 240 210"
        style={{
          maxWidth: "240px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {/* Outer Triangle */}
        <polygon
          points={`${startX},${startY} ${apexX},${apexY} ${startX + baseWidth},${startY}`}
          fill="var(--bg-surface)"
          stroke="var(--border-strong)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Partition Lines from Apex to Base */}
        {partitionLines.map((x, idx) => (
          <line
            key={idx}
            x1={apexX}
            y1={apexY}
            x2={x}
            y2={startY}
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
        ))}

        {/* Sector Numbers at Base */}
        {sectorCenters.map((s, idx) => (
          <text
            key={idx}
            x={s.x}
            y={startY - 14}
            textAnchor="middle"
            fill="var(--color-primary)"
            fontSize="14"
            fontWeight="800"
          >
            {s.num}
          </text>
        ))}

        <text x="120" y="194" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          Total = {sectorCenters.map((s) => s.num).join(" + ")} = {(n * (n + 1)) / 2} Triangles
        </text>
      </svg>
      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Formula: Sum of first n numbers = n(n + 1) / 2
      </span>
    </div>
  );
}
