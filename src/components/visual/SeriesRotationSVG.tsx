"use client";

import React from "react";

interface SeriesRotationSVGProps {
  seriesType?: "arrow" | "dots" | "sides" | "sectors";
  angles?: number[];
  isSolution?: boolean;
}

export function SeriesRotationSVG({
  seriesType = "arrow",
  angles = [0, 45, 90, 135],
  isSolution = false,
}: SeriesRotationSVGProps) {
  // 1. Dots Series: 1 dot -> 2 dots -> 3 dots -> 4 dots -> ?
  if (seriesType === "dots") {
    const dotCounts = [1, 2, 3, 4];
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
          {dotCounts.map((count, idx) => (
            <g key={idx} transform={`translate(${15 + idx * 85}, 20)`}>
              <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
              {/* Render dots */}
              {count === 1 && <circle cx="32.5" cy="32.5" r="5" fill="var(--color-primary)" />}
              {count === 2 && (
                <>
                  <circle cx="20" cy="32.5" r="4.5" fill="var(--color-primary)" />
                  <circle cx="45" cy="32.5" r="4.5" fill="var(--color-primary)" />
                </>
              )}
              {count === 3 && (
                <>
                  <circle cx="32.5" cy="20" r="4" fill="var(--color-primary)" />
                  <circle cx="20" cy="45" r="4" fill="var(--color-primary)" />
                  <circle cx="45" cy="45" r="4" fill="var(--color-primary)" />
                </>
              )}
              {count === 4 && (
                <>
                  <circle cx="20" cy="20" r="4" fill="var(--color-primary)" />
                  <circle cx="45" cy="20" r="4" fill="var(--color-primary)" />
                  <circle cx="20" cy="45" r="4" fill="var(--color-primary)" />
                  <circle cx="45" cy="45" r="4" fill="var(--color-primary)" />
                </>
              )}
              <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
                ({idx + 1})
              </text>
            </g>
          ))}

          {/* 5th Frame: Target */}
          <g transform="translate(355, 20)">
            <rect
              x="0"
              y="0"
              width="65"
              height="65"
              rx="6"
              fill={isSolution ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray={isSolution ? undefined : "4,4"}
            />
            {isSolution ? (
              <>
                <circle cx="20" cy="20" r="4" fill="var(--color-accent)" />
                <circle cx="45" cy="20" r="4" fill="var(--color-accent)" />
                <circle cx="32.5" cy="32.5" r="4" fill="var(--color-accent)" />
                <circle cx="20" cy="45" r="4" fill="var(--color-accent)" />
                <circle cx="45" cy="45" r="4" fill="var(--color-accent)" />
                <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  (5 dots)
                </text>
              </>
            ) : (
              <>
                <text x="32.5" y="42" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
                  ?
                </text>
                <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  (Next)
                </text>
              </>
            )}
          </g>

          <text x="225" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            {isSolution ? "Rule: Internal dots increment by +1 in each successive figure." : "Determine the sequential progression pattern for (?)"}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Polygon Sides: 3 (Triangle) -> 4 (Square) -> 5 (Pentagon) -> 6 (Hexagon) -> ?
  if (seriesType === "sides") {
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
          {/* Frame 1: Triangle (3) */}
          <g transform="translate(15, 20)">
            <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
            <polygon points="32.5,15 15,50 50,50" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
            <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              (1) 3 sides
            </text>
          </g>

          {/* Frame 2: Square (4) */}
          <g transform="translate(100, 20)">
            <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
            <rect x="17.5" y="17.5" width="30" height="30" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
            <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              (2) 4 sides
            </text>
          </g>

          {/* Frame 3: Pentagon (5) */}
          <g transform="translate(185, 20)">
            <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
            <polygon points="32.5,14 49,27 43,49 22,49 16,27" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
            <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              (3) 5 sides
            </text>
          </g>

          {/* Frame 4: Hexagon (6) */}
          <g transform="translate(270, 20)">
            <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
            <polygon points="32.5,14 49,23 49,42 32.5,51 16,42 16,23" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
            <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              (4) 6 sides
            </text>
          </g>

          {/* 5th Frame: Target */}
          <g transform="translate(355, 20)">
            <rect
              x="0"
              y="0"
              width="65"
              height="65"
              rx="6"
              fill={isSolution ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray={isSolution ? undefined : "4,4"}
            />
            {isSolution ? (
              <>
                <polygon
                  points="32.5,13 47,20 52,36 42,49 23,49 13,36 18,20"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                />
                <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  (7 sides)
                </text>
              </>
            ) : (
              <>
                <text x="32.5" y="42" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
                  ?
                </text>
                <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  (Next)
                </text>
              </>
            )}
          </g>

          <text x="225" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            {isSolution ? "Rule: Side count increments by +1: 3 -> 4 -> 5 -> 6 -> 7 (Heptagon)." : "Identify the side count increment rule to determine figure (?)"}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Shaded Sector: Top -> Right -> Bottom -> ?
  if (seriesType === "sectors") {
    const sectorAngles = [0, 90, 180];
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
          viewBox="0 0 380 120"
          style={{
            maxWidth: "380px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {sectorAngles.map((deg, idx) => (
            <g key={idx} transform={`translate(${20 + idx * 90}, 20)`}>
              <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
              <g transform="translate(32.5, 32.5)">
                <circle r="22" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
                <line x1="-22" y1="0" x2="22" y2="0" stroke="var(--border-strong)" strokeWidth="1" />
                <line x1="0" y1="-22" x2="0" y2="22" stroke="var(--border-strong)" strokeWidth="1" />
                {/* Shaded quadrant */}
                <g transform={`rotate(${deg})`}>
                  <path d="M 0 0 L 0 -22 A 22 22 0 0 1 22 0 Z" fill="var(--color-primary)" />
                </g>
              </g>
              <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
                ({idx + 1})
              </text>
            </g>
          ))}

          {/* 4th Frame: Target */}
          <g transform="translate(290, 20)">
            <rect
              x="0"
              y="0"
              width="65"
              height="65"
              rx="6"
              fill={isSolution ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray={isSolution ? undefined : "4,4"}
            />
            {isSolution ? (
              <>
                <g transform="translate(32.5, 32.5)">
                  <circle r="22" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="var(--border-strong)" strokeWidth="1" />
                  <line x1="0" y1="-22" x2="0" y2="22" stroke="var(--border-strong)" strokeWidth="1" />
                  <g transform="rotate(270)">
                    <path d="M 0 0 L 0 -22 A 22 22 0 0 1 22 0 Z" fill="var(--color-accent)" />
                  </g>
                </g>
                <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  (4)
                </text>
              </>
            ) : (
              <>
                <text x="32.5" y="42" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
                  ?
                </text>
                <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                  (Next)
                </text>
              </>
            )}
          </g>

          <text x="190" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            {isSolution ? "Rule: Shaded quadrant rotates 90° clockwise in each step." : "Determine the rotating quadrant sector progression for (?)"}
          </text>
        </svg>
      </div>
    );
  }

  // 4. Default Arrow Series
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
            <rect x="0" y="0" width="65" height="65" rx="6" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />

            {/* Rotating Arrow Glyph */}
            <g transform={`translate(32.5, 32.5) rotate(${deg})`}>
              <line x1="0" y1="18" x2="0" y2="-18" stroke="var(--color-primary)" strokeWidth="3" />
              <polygon points="0,-22 -7,-12 7,-12" fill="var(--color-primary)" />
              <circle cx="0" cy="18" r="4" fill="var(--color-accent)" />
            </g>

            <text x="32.5" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              ({idx + 1})
            </text>
          </g>
        ))}

        {/* 5th Frame: Target */}
        <g transform="translate(355, 20)">
          <rect
            x="0"
            y="0"
            width="65"
            height="65"
            rx="6"
            fill={isSolution ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeDasharray={isSolution ? undefined : "4,4"}
          />
          {isSolution ? (
            <>
              <g transform="translate(32.5, 32.5) rotate(180)">
                <line x1="0" y1="18" x2="0" y2="-18" stroke="var(--color-accent)" strokeWidth="3" />
                <polygon points="0,-22 -7,-12 7,-12" fill="var(--color-accent)" />
                <circle cx="0" cy="18" r="4" fill="var(--color-accent)" />
              </g>
              <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                (5) South
              </text>
            </>
          ) : (
            <>
              <text x="32.5" y="42" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontWeight="800">
                ?
              </text>
              <text x="32.5" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
                (Next)
              </text>
            </>
          )}
        </g>

        <text x="225" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          {isSolution ? "Rule: Arrow rotates 45° clockwise systematically: N -> NE -> E -> SE -> S (180°)." : "Determine the directional rotation progression for (?)"}
        </text>
      </svg>
    </div>
  );
}
