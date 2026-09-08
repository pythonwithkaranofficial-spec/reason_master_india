"use client";

import React from "react";

interface MatrixCompletionSVGProps {
  cells?: string[][];
}

export function MatrixCompletionSVG({
  cells = [
    ["▲", "▲▲", "▲▲▲"],
    ["■", "■■", "■■■"],
    ["●", "●●", "?"],
  ],
}: MatrixCompletionSVGProps) {
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
