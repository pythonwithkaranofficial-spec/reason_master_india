"use client";

import React from "react";

export type OddFigurePatternType = "open_closed" | "symmetry" | "rotation" | "vertices";

interface OddFigureOutSVGProps {
  patternType?: OddFigurePatternType;
  isSolution?: boolean;
  oddFigure?: "A" | "B" | "C" | "D";
}

export function OddFigureOutSVG({
  patternType = "open_closed",
  isSolution = false,
  oddFigure = "D",
}: OddFigureOutSVGProps) {
  // Render figure glyph for each box (A, B, C, D)
  const renderGlyph = (figLabel: "A" | "B" | "C" | "D") => {
    switch (patternType) {
      case "open_closed": {
        // A: Triangle (3 sides, closed)
        // B: Rectangle (4 sides, closed)
        // C: Pentagon (5 sides, closed)
        // D: Open spiral / curve (open!)
        if (figLabel === "A") {
          return (
            <polygon
              points="40,16 16,60 64,60"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
            />
          );
        }
        if (figLabel === "B") {
          return (
            <rect
              x="18"
              y="20"
              width="44"
              height="38"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
            />
          );
        }
        if (figLabel === "C") {
          return (
            <polygon
              points="40,15 64,32 55,60 25,60 16,32"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
            />
          );
        }
        // D: Open spiral curve
        return (
          <path
            d="M 22 55 C 15 35, 30 15, 45 25 C 55 33, 50 48, 38 48 C 30 48, 28 38, 35 34"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      }

      case "symmetry": {
        // A, B, C have bilateral symmetry; D is asymmetrical
        if (figLabel === "A") {
          return (
            <g>
              <polygon points="40,16 16,60 64,60" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              {isSolution && <line x1="40" y1="12" x2="40" y2="64" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />}
            </g>
          );
        }
        if (figLabel === "B") {
          return (
            <g>
              <polygon points="40,16 64,38 40,60 16,38" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              {isSolution && <line x1="40" y1="12" x2="40" y2="64" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />}
            </g>
          );
        }
        if (figLabel === "C") {
          return (
            <g>
              <circle cx="40" cy="38" r="22" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              {isSolution && <line x1="40" y1="12" x2="40" y2="64" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />}
            </g>
          );
        }
        // D: Asymmetrical scalene polygon
        return (
          <polygon
            points="18,22 62,30 50,62 30,55 14,42"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
          />
        );
      }

      case "rotation": {
        // A, B, C: Clockwise rotation; D: Anticlockwise rotation
        if (figLabel === "A") {
          return (
            <g transform="translate(40, 38) rotate(0)">
              <path d="M -18 0 A 18 18 0 0 1 14 -12" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              <polygon points="14,-17 22,-8 11,-5" fill="var(--color-primary)" />
            </g>
          );
        }
        if (figLabel === "B") {
          return (
            <g transform="translate(40, 38) rotate(90)">
              <path d="M -18 0 A 18 18 0 0 1 14 -12" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              <polygon points="14,-17 22,-8 11,-5" fill="var(--color-primary)" />
            </g>
          );
        }
        if (figLabel === "C") {
          return (
            <g transform="translate(40, 38) rotate(180)">
              <path d="M -18 0 A 18 18 0 0 1 14 -12" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              <polygon points="14,-17 22,-8 11,-5" fill="var(--color-primary)" />
            </g>
          );
        }
        // D: Anticlockwise arrow
        return (
          <g transform="translate(40, 38)">
            <path d="M 18 0 A 18 18 0 0 0 -14 -12" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
            <polygon points="-14,-17 -22,-8 -11,-5" fill="var(--color-primary)" />
          </g>
        );
      }

      case "vertices":
      default: {
        // A: 4 vertices (square); B: 6 vertices (hexagon); C: 8 vertices (octagon); D: 3 vertices (triangle - odd!)
        if (figLabel === "A") {
          return (
            <g>
              <rect x="20" y="20" width="40" height="40" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="3.5" fill="var(--color-accent)" />
              <circle cx="60" cy="20" r="3.5" fill="var(--color-accent)" />
              <circle cx="60" cy="60" r="3.5" fill="var(--color-accent)" />
              <circle cx="20" cy="60" r="3.5" fill="var(--color-accent)" />
            </g>
          );
        }
        if (figLabel === "B") {
          return (
            <g>
              <polygon points="40,16 60,27 60,49 40,60 20,49 20,27" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />
              <circle cx="40" cy="16" r="3.5" fill="var(--color-accent)" />
              <circle cx="60" cy="27" r="3.5" fill="var(--color-accent)" />
              <circle cx="60" cy="49" r="3.5" fill="var(--color-accent)" />
              <circle cx="40" cy="60" r="3.5" fill="var(--color-accent)" />
              <circle cx="20" cy="49" r="3.5" fill="var(--color-accent)" />
              <circle cx="20" cy="27" r="3.5" fill="var(--color-accent)" />
            </g>
          );
        }
        if (figLabel === "C") {
          return (
            <g>
              <polygon points="32,16 48,16 62,30 62,46 48,60 32,60 18,46 18,30" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />
              <circle cx="32" cy="16" r="3" fill="var(--color-accent)" />
              <circle cx="48" cy="16" r="3" fill="var(--color-accent)" />
              <circle cx="62" cy="30" r="3" fill="var(--color-accent)" />
              <circle cx="62" cy="46" r="3" fill="var(--color-accent)" />
              <circle cx="48" cy="60" r="3" fill="var(--color-accent)" />
              <circle cx="32" cy="60" r="3" fill="var(--color-accent)" />
              <circle cx="18" cy="46" r="3" fill="var(--color-accent)" />
              <circle cx="18" cy="30" r="3" fill="var(--color-accent)" />
            </g>
          );
        }
        // D: 3 vertices (triangle)
        return (
          <g>
            <polygon points="40,18 18,60 62,60" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />
            <circle cx="40" cy="18" r="3.5" fill="var(--color-accent)" />
            <circle cx="18" cy="60" r="3.5" fill="var(--color-accent)" />
            <circle cx="62" cy="60" r="3.5" fill="var(--color-accent)" />
          </g>
        );
      }
    }
  };

  const figures: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

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
        viewBox="0 0 450 130"
        style={{
          maxWidth: "450px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {figures.map((fig, idx) => {
          const isOdd = fig === oddFigure;
          const isHighlighted = isSolution && isOdd;

          return (
            <g key={fig} transform={`translate(${20 + idx * 105}, 18)`}>
              <rect
                x="0"
                y="0"
                width="80"
                height="75"
                rx="6"
                fill={isHighlighted ? "var(--color-accent-subtle)" : "var(--bg-surface)"}
                stroke={isHighlighted ? "var(--color-accent)" : "var(--border-strong)"}
                strokeWidth={isHighlighted ? "2.5" : "1.5"}
              />

              {renderGlyph(fig)}

              <text
                x="40"
                y="92"
                textAnchor="middle"
                fill={isHighlighted ? "var(--color-accent)" : "var(--text-secondary)"}
                fontSize="12"
                fontWeight={isHighlighted ? "800" : "700"}
              >
                ({fig})
              </text>

              {isHighlighted && (
                <text
                  x="40"
                  y="-5"
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  fontSize="10"
                  fontWeight="800"
                >
                  ODD ONE
                </text>
              )}
            </g>
          );
        })}

        <text x="225" y="122" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
          {isSolution
            ? `Figure (${oddFigure}) is the odd one out conforming to a different property.`
            : "Identify which figure ((A), (B), (C), or (D)) does not belong"}
        </text>
      </svg>
    </div>
  );
}
