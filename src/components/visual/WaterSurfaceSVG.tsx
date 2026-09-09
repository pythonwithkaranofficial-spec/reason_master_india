"use client";

import React from "react";

interface WaterSurfaceSVGProps {
  type?: "word" | "clock";
  content?: string;
  time?: string;
  isSolution?: boolean;
}

export function WaterSurfaceSVG({
  type = "word",
  content = "DISC",
  time = "4:20",
  isSolution = false,
}: WaterSurfaceSVGProps) {
  // Mode 1: Clock Water Reflection
  if (type === "clock") {
    const parts = time.split(":").map(Number);
    const hour = isNaN(parts[0]) ? 4 : parts[0];
    const minute = isNaN(parts[1]) ? 20 : parts[1];

    // Clock angles
    const minuteAngle = minute * 6;
    const hourAngle = (hour % 12) * 30 + minute * 0.5;

    // Water surface vertical reflection (horizontal mirror plane)
    const refMinuteAngle = (180 - minuteAngle + 360) % 360;
    const refHourAngle = (180 - hourAngle + 360) % 360;

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
          viewBox="0 0 380 320"
          style={{
            maxWidth: "380px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {/* Top: Original Clock */}
          <g transform="translate(190, 75)">
            <circle r="55" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
            <circle r="4" fill="var(--color-primary)" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line
                key={i}
                x1="0"
                y1="-50"
                x2="0"
                y2={i % 3 === 0 ? "-42" : "-45"}
                stroke="var(--text-muted)"
                strokeWidth={i % 3 === 0 ? "2" : "1"}
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Hour hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-32"
              stroke="var(--text-primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              transform={`rotate(${hourAngle})`}
            />
            {/* Minute hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-42"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle})`}
            />
            <text x="0" y="72" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="700">
              Clock ({time})
            </text>
          </g>

          {/* Center: Water Surface Plane (AB) */}
          <g transform="translate(190, 160)">
            <line x1="-160" y1="0" x2="160" y2="0" stroke="var(--color-primary)" strokeWidth="2.5" />
            {[-140, -110, -80, -50, -20, 10, 40, 70, 100, 130].map((x, idx) => (
              <line key={idx} x1={x} y1="0" x2={x - 8} y2="7" stroke="var(--color-primary)" strokeWidth="1.5" />
            ))}
            <text x="-170" y="4" textAnchor="end" fill="var(--color-primary)" fontSize="11" fontWeight="800">
              A
            </text>
            <text x="170" y="4" textAnchor="start" fill="var(--color-primary)" fontSize="11" fontWeight="800">
              B (Water Surface)
            </text>
          </g>

          {/* Bottom: Reflected Clock OR Target Box */}
          {isSolution ? (
            <g transform="translate(190, 245)">
              <circle r="55" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="2.5" />
              <circle r="4" fill="var(--color-primary)" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="-50"
                  x2="0"
                  y2={i % 3 === 0 ? "-42" : "-45"}
                  stroke="var(--text-muted)"
                  strokeWidth={i % 3 === 0 ? "2" : "1"}
                  transform={`rotate(${deg})`}
                />
              ))}
              {/* Reflected Hour hand */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-32"
                stroke="var(--text-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${refHourAngle})`}
              />
              {/* Reflected Minute hand */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-42"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${refMinuteAngle})`}
              />
              <text x="0" y="72" textAnchor="middle" fill="var(--color-primary)" fontSize="12" fontWeight="700">
                Water Image (Inverted)
              </text>
            </g>
          ) : (
            <g transform="translate(190, 245)">
              <circle
                r="55"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeDasharray="5,4"
              />
              <text x="0" y="10" textAnchor="middle" fill="var(--color-accent)" fontSize="32" fontWeight="800">
                ?
              </text>
              <text x="0" y="72" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontWeight="700">
                Water Image (?)
              </text>
            </g>
          )}
        </svg>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          Formula: Subtract from 18:30 (or 17:90 if minutes &gt; 30). Top inverts to bottom; left/right remains unchanged.
        </span>
      </div>
    );
  }

  // Mode 2: Word / Code Water Reflection
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
            Given Word / Code
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

        {/* Bottom: Inverted Water Reflection OR Target Box */}
        {isSolution ? (
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
        ) : (
          <g transform="translate(180, 170)">
            <rect
              x="-100"
              y="-30"
              width="200"
              height="60"
              rx="6"
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray="5,4"
            />
            <text x="0" y="10" textAnchor="middle" fill="var(--color-accent)" fontSize="30" fontWeight="800">
              ?
            </text>
            <text x="0" y="48" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="700">
              Water Image (?)
            </text>
          </g>
        )}
      </svg>
      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Note: Top becomes bottom, bottom becomes top; left and right positions remain unchanged.
      </span>
    </div>
  );
}
