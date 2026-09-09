"use client";

import React from "react";

export interface DicePosition {
  label: string;
  top: string | number;
  front: string | number;
  right: string | number;
}

interface CubeDiceSVGProps {
  mode?: "isometric" | "unfolded" | "multi_position" | "painted_cube";
  topFace?: string | number;
  frontFace?: string | number;
  rightFace?: string | number;
  unfoldedFaces?: (string | number)[]; // 6 faces [top, left, center, right, bottom, far-bottom]
  positions?: DicePosition[];
  paintedCubeN?: number;
  showSolution?: boolean;
  isSolution?: boolean;
}

export function CubeDiceSVG({
  mode = "isometric",
  topFace = "1",
  frontFace = "2",
  rightFace = "3",
  unfoldedFaces = ["1", "4", "2", "3", "6", "5"],
  positions,
  paintedCubeN = 3,
  showSolution = false,
  isSolution,
}: CubeDiceSVGProps) {
  const isSolved = isSolution ?? showSolution;
  // Mode 1: Multi-Position Dice (e.g. Die I and Die II side-by-side)
  if (mode === "multi_position" && positions && positions.length > 0) {
    const diceList = positions.slice(0, 3); // Max 3 side by side
    const totalWidth = diceList.length === 2 ? 380 : 460;
    const spacing = diceList.length === 2 ? 180 : 145;
    const startX = diceList.length === 2 ? 100 : 80;

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
          viewBox={`0 0 ${totalWidth} 200`}
          style={{
            maxWidth: `${totalWidth}px`,
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {diceList.map((d, idx) => {
            const cx = startX + idx * spacing;
            const cy = 95;
            return (
              <g key={idx} transform={`translate(${cx}, ${cy})`}>
                {/* Top Face */}
                <polygon
                  points="0,-55 48,-27 0,0 -48,-27"
                  fill="var(--bg-surface)"
                  stroke="var(--border-strong)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <text x="0" y="-23" textAnchor="middle" fill="var(--color-primary)" fontSize="18" fontWeight="800">
                  {d.top}
                </text>

                {/* Left/Front Face */}
                <polygon
                  points="0,0 -48,-27 -48,35 0,62"
                  fill="var(--bg-surface)"
                  stroke="var(--border-strong)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <text x="-24" y="24" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="800">
                  {d.front}
                </text>

                {/* Right Face */}
                <polygon
                  points="0,0 48,-27 48,35 0,62"
                  fill="var(--bg-surface)"
                  stroke="var(--border-strong)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <text x="24" y="24" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="800">
                  {d.right}
                </text>

                {/* Position Label */}
                <text x="0" y="86" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="700">
                  {d.label}
                </text>
              </g>
            );
          })}
          <text x={totalWidth / 2} y="190" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Compare common visible faces to identify opposite pairs
          </text>
        </svg>
      </div>
    );
  }

  // Mode 2: Painted Cube Sliced into n x n x n
  if (mode === "painted_cube") {
    const n = Math.max(2, Math.min(4, paintedCubeN));
    // Render isometric 3D block sliced into n segments
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
          viewBox="0 0 280 240"
          style={{
            maxWidth: "280px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <g transform="translate(140, 115)">
            {/* Top Surface Grid (Isometric) */}
            {Array.from({ length: n }).map((_, r) =>
              Array.from({ length: n }).map((_, c) => {
                // Each unit top square
                const u = 60 / n;
                const x0 = (c - r) * u;
                const y0 = -60 + (c + r) * (u * 0.5);
                const p1 = `${x0},${y0}`;
                const p2 = `${x0 + u},${y0 + u * 0.5}`;
                const p3 = `${x0},${y0 + u}`;
                const p4 = `${x0 - u},${y0 + u * 0.5}`;
                return (
                  <polygon
                    key={`top-${r}-${c}`}
                    points={`${p1} ${p2} ${p3} ${p4}`}
                    fill="var(--color-primary-subtle)"
                    stroke="var(--color-primary)"
                    strokeWidth="1.2"
                  />
                );
              })
            )}

            {/* Left Front Surface Grid */}
            {Array.from({ length: n }).map((_, r) =>
              Array.from({ length: n }).map((_, c) => {
                const u = 60 / n;
                const h = 70 / n;
                const x0 = -60 + c * u;
                const y0 = -30 + c * (u * 0.5) + r * h;
                const p1 = `${x0},${y0}`;
                const p2 = `${x0 + u},${y0 + u * 0.5}`;
                const p3 = `${x0 + u},${y0 + u * 0.5 + h}`;
                const p4 = `${x0},${y0 + h}`;
                return (
                  <polygon
                    key={`left-${r}-${c}`}
                    points={`${p1} ${p2} ${p3} ${p4}`}
                    fill="var(--bg-surface)"
                    stroke="var(--border-strong)"
                    strokeWidth="1.2"
                  />
                );
              })
            )}

            {/* Right Front Surface Grid */}
            {Array.from({ length: n }).map((_, r) =>
              Array.from({ length: n }).map((_, c) => {
                const u = 60 / n;
                const h = 70 / n;
                const x0 = 0 + c * u;
                const y0 = 0 - c * (u * 0.5) + r * h;
                const p1 = `${x0},${y0}`;
                const p2 = `${x0 + u},${y0 - u * 0.5}`;
                const p3 = `${x0 + u},${y0 - u * 0.5 + h}`;
                const p4 = `${x0},${y0 + h}`;
                return (
                  <polygon
                    key={`right-${r}-${c}`}
                    points={`${p1} ${p2} ${p3} ${p4}`}
                    fill="var(--bg-surface)"
                    stroke="var(--border-strong)"
                    strokeWidth="1.2"
                  />
                );
              })
            )}
          </g>

          <text x="140" y="222" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            {n} × {n} × {n} Cube: Outer faces painted, cut into 1 cm unit cubes
          </text>
        </svg>
      </div>
    );
  }

  // Mode 3: Unfolded Net
  if (mode === "unfolded") {
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
          viewBox="0 0 280 250"
          style={{
            maxWidth: "280px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {/* Unfolded Net of 6 Squares */}
          <g transform="translate(45, 18)">
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

          {isSolved ? (
            <text x="140" y="235" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
              Opposite Pairs: {f1} ↔ {f6}, {f4} ↔ {f3}, {f2} ↔ {f5}
            </text>
          ) : (
            <text x="140" y="235" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              Fold the flat net into a cube to find opposite faces
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Mode 4: Isometric Single Cube View
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
          {/* Top Face */}
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

          {/* Left / Front Face */}
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

          {/* Right Face */}
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
    </div>
  );
}
