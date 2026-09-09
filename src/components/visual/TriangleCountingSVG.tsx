"use client";

import React from "react";

interface TriangleCountingSVGProps {
  figureType?: "partitioned_triangle" | "square_diagonals" | "star" | "grid_squares" | "grid_rectangles";
  partitions?: number;
  gridRows?: number;
  gridCols?: number;
  isSolution?: boolean;
}

export function TriangleCountingSVG({
  figureType = "partitioned_triangle",
  partitions = 3,
  gridRows = 3,
  gridCols = 4,
  isSolution = false,
}: TriangleCountingSVGProps) {
  // Mode 1: 5-Pointed Star (Pentagram)
  if (figureType === "star") {
    // 5 outer points and 5 inner points forming a regular pentagram
    // Center at (120, 110), Outer R = 75, Inner R = 32
    const cx = 120;
    const cy = 105;
    const outerR = 75;
    const innerR = 32;
    const points: string[] = [];

    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * 36 - 90) * (Math.PI / 180);
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
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
          {/* Star polygon */}
          <polygon
            points={points.join(" ")}
            fill="var(--bg-surface)"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Pentagram internal diagonals */}
          {[0, 2, 4, 6, 8].map((idx) => {
            const nextIdx = (idx + 4) % 10;
            const p1 = points[idx].split(",");
            const p2 = points[nextIdx].split(",");
            return (
              <line
                key={idx}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
            );
          })}
          {isSolution ? (
            <text x="120" y="212" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
              5 small outer + 5 large overlapping = 10 Triangles
            </text>
          ) : (
            <text x="120" y="212" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              Count all small and composite triangles in the star
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Mode 2: Grid of Squares (n x n)
  if (figureType === "grid_squares") {
    const n = Math.max(2, Math.min(5, gridRows || 3));
    const size = 150;
    const step = size / n;
    const startX = 45;
    const startY = 30;

    // Total squares formula: sum of k^2 for k=1..n
    const total = Array.from({ length: n }).reduce((acc: number, _, i) => acc + (i + 1) * (i + 1), 0);

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
          <g transform={`translate(${startX}, ${startY})`}>
            {/* Outer Box */}
            <rect x="0" y="0" width={size} height={size} fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
            {/* Grid lines */}
            {Array.from({ length: n - 1 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={(i + 1) * step} y1="0" x2={(i + 1) * step} y2={size} stroke="var(--color-primary)" strokeWidth="1.5" />
                <line x1="0" y1={(i + 1) * step} x2={size} y2={(i + 1) * step} stroke="var(--color-primary)" strokeWidth="1.5" />
              </React.Fragment>
            ))}
          </g>
          {isSolution ? (
            <text x="120" y="205" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
              Total Squares = Σ(k²) = {total}
            </text>
          ) : (
            <text x="120" y="205" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              {n} × {n} Grid: Count 1×1, 2×2, ... up to {n}×{n} squares
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Mode 3: Grid of Rectangles (m x n)
  if (figureType === "grid_rectangles") {
    const rows = Math.max(2, Math.min(4, gridRows || 3));
    const cols = Math.max(2, Math.min(5, gridCols || 4));
    const width = 180;
    const height = 120;
    const stepX = width / cols;
    const stepY = height / rows;
    const startX = 30;
    const startY = 35;

    const total = ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);

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
          viewBox="0 0 240 200"
          style={{
            maxWidth: "240px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <g transform={`translate(${startX}, ${startY})`}>
            <rect x="0" y="0" width={width} height={height} fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
            {Array.from({ length: cols - 1 }).map((_, i) => (
              <line key={`col-${i}`} x1={(i + 1) * stepX} y1="0" x2={(i + 1) * stepX} y2={height} stroke="var(--color-primary)" strokeWidth="1.5" />
            ))}
            {Array.from({ length: rows - 1 }).map((_, i) => (
              <line key={`row-${i}`} x1="0" y1={(i + 1) * stepY} x2={width} y2={(i + 1) * stepY} stroke="var(--color-primary)" strokeWidth="1.5" />
            ))}
          </g>
          {isSolution ? (
            <text x="120" y="185" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
              Total Rectangles = [m(m+1)/2] × [n(n+1)/2] = {total}
            </text>
          ) : (
            <text x="120" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              {rows} rows × {cols} columns: Count all rectangular combinations
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Mode 4: Square with Diagonals & Medians (8 Sectors)
  if (figureType === "square_diagonals") {
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
          <g transform="translate(40, 25)">
            {/* Outer Square 160x160 */}
            <rect x="0" y="0" width="160" height="160" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />

            {/* Diagonals */}
            <line x1="0" y1="0" x2="160" y2="160" stroke="var(--color-primary)" strokeWidth="2" />
            <line x1="160" y1="0" x2="0" y2="160" stroke="var(--color-primary)" strokeWidth="2" />

            {/* Medians */}
            <line x1="80" y1="0" x2="80" y2="160" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4,3" />
            <line x1="0" y1="80" x2="160" y2="80" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4,3" />

            {/* 8 Sector Numbers */}
            <text x="50" y="32" fill="var(--text-muted)" fontSize="11" fontWeight="700">1</text>
            <text x="100" y="32" fill="var(--text-muted)" fontSize="11" fontWeight="700">2</text>
            <text x="128" y="60" fill="var(--text-muted)" fontSize="11" fontWeight="700">3</text>
            <text x="128" y="110" fill="var(--text-muted)" fontSize="11" fontWeight="700">4</text>
            <text x="100" y="140" fill="var(--text-muted)" fontSize="11" fontWeight="700">5</text>
            <text x="50" y="140" fill="var(--text-muted)" fontSize="11" fontWeight="700">6</text>
            <text x="22" y="110" fill="var(--text-muted)" fontSize="11" fontWeight="700">7</text>
            <text x="22" y="60" fill="var(--text-muted)" fontSize="11" fontWeight="700">8</text>
          </g>
          {isSolution ? (
            <text x="120" y="208" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
              Total Triangles = 8 × 2 = 16
            </text>
          ) : (
            <text x="120" y="208" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              Count single, paired, and composite triangles
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Mode 5: Partitioned Triangle (Apex joined to Base)
  const n = Math.max(2, Math.min(6, partitions));
  const baseWidth = 180;
  const height = 135;
  const startX = 30;
  const startY = 155;
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
        viewBox="0 0 240 200"
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

        {isSolution ? (
          <text x="120" y="188" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="700">
            Total = {sectorCenters.map((s) => s.num).join(" + ")} = {(n * (n + 1)) / 2} Triangles
          </text>
        ) : (
          <text x="120" y="188" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Count all individual and composite triangles
          </text>
        )}
      </svg>
    </div>
  );
}
