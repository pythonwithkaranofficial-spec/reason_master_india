"use client";

import React from "react";

interface MissingCharacterSVGProps {
  mode?: "grid" | "circle_quadrants" | "cross";
  grid?: (string | number)[][];
  quadrantValues?: {
    top: string | number;
    right: string | number;
    bottom: string | number;
    left: string | number;
  };
  crossValues?: {
    top: string | number;
    right: string | number;
    bottom: string | number;
    left: string | number;
    center: string | number;
  };
  isSolution?: boolean;
  solvedValue?: string | number;
}

export function MissingCharacterSVG({
  mode = "grid",
  grid = [
    [2, 3, 13],
    [4, 1, 17],
    [2, 3, "?"],
  ],
  quadrantValues = { top: 2, right: 3, bottom: 8, left: "?" },
  crossValues = { top: 4, right: 5, bottom: 6, left: 3, center: "?" },
  isSolution = false,
  solvedValue,
}: MissingCharacterSVGProps) {
  const resolveVal = (val: string | number) => {
    if (String(val).trim() === "?" && isSolution && solvedValue !== undefined) {
      return solvedValue;
    }
    return val;
  };
  // Mode 1: Circle Divided into 4 Quadrants with Opposing Sectors
  if (mode === "circle_quadrants") {
    const { top, right, bottom, left } = quadrantValues;
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
          <g transform="translate(120, 105)">
            {/* Outer Circle */}
            <circle r="80" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />

            {/* Dividing Cross Axes */}
            <line x1="-80" y1="0" x2="80" y2="0" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="0" y1="-80" x2="0" y2="80" stroke="var(--border-strong)" strokeWidth="2" />

            {/* Diagonal Quadrant Numbers */}
            {/* Top Sector */}
            <text
              x="0"
              y="-38"
              textAnchor="middle"
              fill={String(top) === "?" ? "var(--color-accent)" : "var(--text-primary)"}
              fontSize={String(top) === "?" ? "24" : "20"}
              fontWeight="800"
            >
              {resolveVal(top)}
            </text>

            {/* Right Sector */}
            <text
              x="45"
              y="8"
              textAnchor="middle"
              fill={String(right) === "?" ? "var(--color-accent)" : "var(--text-primary)"}
              fontSize={String(right) === "?" ? "24" : "20"}
              fontWeight="800"
            >
              {resolveVal(right)}
            </text>

            {/* Bottom Sector */}
            <text
              x="0"
              y="52"
              textAnchor="middle"
              fill={String(bottom) === "?" ? "var(--color-accent)" : "var(--text-primary)"}
              fontSize={String(bottom) === "?" ? "24" : "20"}
              fontWeight="800"
            >
              {resolveVal(bottom)}
            </text>

            {/* Left Sector */}
            <text
              x="-45"
              y="8"
              textAnchor="middle"
              fill={String(left) === "?" ? "var(--color-accent)" : "var(--text-primary)"}
              fontSize={String(left) === "?" ? "24" : "20"}
              fontWeight="800"
            >
              {resolveVal(left)}
            </text>
          </g>
          <text x="120" y="210" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Determine the relationship between opposing sectors to find &apos;?&apos;
          </text>
        </svg>
      </div>
    );
  }

  // Mode 2: Cross-shaped Diagram (4 Outer Arms + Center Target)
  if (mode === "cross") {
    const { top, right, bottom, left, center } = crossValues;
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
          viewBox="0 0 250 230"
          style={{
            maxWidth: "250px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <g transform="translate(125, 105)">
            {/* Center Box */}
            <rect
              x="-26"
              y="-26"
              width="52"
              height="52"
              rx="6"
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth="2"
            />
            <text x="0" y="8" textAnchor="middle" fill="var(--color-accent)" fontSize="24" fontWeight="800">
              {resolveVal(center)}
            </text>

            {/* Top Arm */}
            <circle cx="0" cy="-65" r="22" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="0" y1="-43" x2="0" y2="-26" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="0" y="-58" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {top}
            </text>

            {/* Bottom Arm */}
            <circle cx="0" cy="65" r="22" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="0" y1="26" x2="0" y2="43" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="0" y="72" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {bottom}
            </text>

            {/* Left Arm */}
            <circle cx="-65" cy="0" r="22" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="-26" y1="0" x2="-43" y2="0" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="-65" y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {left}
            </text>

            {/* Right Arm */}
            <circle cx="65" cy="0" r="22" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="26" y1="0" x2="43" y2="0" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="65" y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {right}
            </text>
          </g>
          <text x="125" y="210" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Combine outer numbers using arithmetic operations to calculate &apos;?&apos;
          </text>
        </svg>
      </div>
    );
  }

  // Mode 3: Grid / Matrix of Numbers
  const numRows = grid.length;
  const numCols = Math.max(...grid.map((r) => r.length), 1);
  const cellW = 55;
  const cellH = 48;
  const gap = 8;
  const totalW = numCols * cellW + (numCols - 1) * gap + 50;
  const totalH = numRows * cellH + (numRows - 1) * gap + 65;
  const startX = 25;
  const startY = 20;

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
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={{
          maxWidth: `${Math.min(totalW, 300)}px`,
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        <g transform={`translate(${startX}, ${startY})`}>
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isTarget = String(val).trim() === "?";
              const x = cIdx * (cellW + gap);
              const y = rIdx * (cellH + gap);
              return (
                <g key={`${rIdx}-${cIdx}`} transform={`translate(${x}, ${y})`}>
                  <rect
                    x="0"
                    y="0"
                    width={cellW}
                    height={cellH}
                    rx="6"
                    fill={isTarget ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
                    stroke={isTarget ? "var(--color-accent)" : "var(--border-strong)"}
                    strokeWidth={isTarget ? "2.2" : "1.5"}
                  />
                  <text
                    x={cellW / 2}
                    y={cellH / 2 + 6}
                    textAnchor="middle"
                    fill={isTarget ? "var(--color-accent)" : "var(--text-primary)"}
                    fontSize={isTarget ? "22" : "17"}
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {resolveVal(val)}
                  </text>
                </g>
              );
            })
          )}
        </g>
        <text x={totalW / 2} y={totalH - 12} textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          Determine the mathematical row/column logic for &apos;?&apos;
        </text>
      </svg>
    </div>
  );
}
