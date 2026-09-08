"use client";

import React from "react";

interface MirrorReflectionSVGProps {
  type?: "word" | "clock" | "shape";
  content?: string;
  time?: string;
}

export function MirrorReflectionSVG({
  type = "word",
  content = "REASON",
  time = "3:25",
}: MirrorReflectionSVGProps) {
  if (type === "clock") {
    // Parse time like 3:25
    const parts = time.split(":").map(Number);
    const hour = isNaN(parts[0]) ? 3 : parts[0];
    const minute = isNaN(parts[1]) ? 25 : parts[1];

    // Clock angles
    const minuteAngle = minute * 6; // 360 / 60
    const hourAngle = (hour % 12) * 30 + minute * 0.5;

    // Reflected angles across vertical axis (12-6 line): angle -> 360 - angle
    const refMinuteAngle = (360 - minuteAngle) % 360;
    const refHourAngle = (360 - hourAngle) % 360;

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
          viewBox="0 0 460 210"
          style={{
            maxWidth: "460px",
            width: "100%",
            height: "auto",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          {/* Left: Original Clock */}
          <g transform="translate(105, 100)">
            <circle r="65" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="3" />
            <circle r="4" fill="var(--color-primary)" />
            {/* Clock hour marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line
                key={i}
                x1="0"
                y1="-60"
                x2="0"
                y2={i % 3 === 0 ? "-50" : "-54"}
                stroke="var(--text-muted)"
                strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Hour hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-38"
              stroke="var(--text-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle})`}
            />
            {/* Minute hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-50"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle})`}
            />
            <text x="0" y="86" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="700">
              Clock ({time})
            </text>
          </g>

          {/* Center: Vertical Mirror Line (MN) */}
          <g transform="translate(230, 10)">
            <line x1="0" y1="15" x2="0" y2="170" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="6,4" />
            {/* Mirror Hash Marks on Right of mirror */}
            {[25, 45, 65, 85, 105, 125, 145, 165].map((y, idx) => (
              <line key={idx} x1="0" y1={y} x2="7" y2={y - 6} stroke="var(--color-accent)" strokeWidth="1.5" />
            ))}
            <text x="0" y="10" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontWeight="800">
              M
            </text>
            <text x="0" y="185" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontWeight="800">
              N (Mirror)
            </text>
          </g>

          {/* Right: Mirror Reflected Clock */}
          <g transform="translate(355, 100)">
            <circle r="65" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="3" />
            <circle r="4" fill="var(--color-primary)" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line
                key={i}
                x1="0"
                y1="-60"
                x2="0"
                y2={i % 3 === 0 ? "-50" : "-54"}
                stroke="var(--text-muted)"
                strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Reflected Hour hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-38"
              stroke="var(--text-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${refHourAngle})`}
            />
            {/* Reflected Minute hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-50"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${refMinuteAngle})`}
            />
            <text x="0" y="86" textAnchor="middle" fill="var(--color-primary)" fontSize="13" fontWeight="700">
              Mirror Image
            </text>
          </g>
        </svg>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          Formula: Actual Time + Mirror Time = 11:60 (or 12:00)
        </span>
      </div>
    );
  }

  // Word / Shape Lateral Reflection
  const word = content || "QUALITY";
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
        viewBox="0 0 460 150"
        style={{
          maxWidth: "460px",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        {/* Left: Original Object / Text */}
        <g transform="translate(115, 65)">
          <rect x="-95" y="-35" width="190" height="70" rx="6" fill="var(--bg-surface)" stroke="var(--border-color)" />
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="24"
            fontWeight="800"
            fontFamily="monospace"
            letterSpacing="3"
          >
            {word}
          </text>
          <text x="0" y="52" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Given Figure / Word
          </text>
        </g>

        {/* Center: Vertical Mirror Line (MN) */}
        <g transform="translate(230, 10)">
          <line x1="0" y1="10" x2="0" y2="115" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="6,4" />
          {[18, 36, 54, 72, 90, 108].map((y, idx) => (
            <line key={idx} x1="0" y1={y} x2="7" y2={y - 6} stroke="var(--color-accent)" strokeWidth="1.5" />
          ))}
          <text x="0" y="8" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontWeight="800">
            M
          </text>
          <text x="0" y="130" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontWeight="800">
            N (Mirror)
          </text>
        </g>

        {/* Right: Laterally Inverted (Left <-> Right Flipped) */}
        <g transform="translate(345, 65)">
          <rect x="-95" y="-35" width="190" height="70" rx="6" fill="var(--bg-surface)" stroke="var(--border-color)" />
          <g transform="scale(-1, 1)">
            <text
              x="0"
              y="9"
              textAnchor="middle"
              fill="var(--color-primary)"
              fontSize="24"
              fontWeight="800"
              fontFamily="monospace"
              letterSpacing="3"
            >
              {word}
            </text>
          </g>
          <text x="0" y="52" textAnchor="middle" fill="var(--color-primary)" fontSize="11" fontWeight="600">
            Mirror Image (Lateral Inversion)
          </text>
        </g>
      </svg>
      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Note: Left becomes right, right becomes left; top and bottom remain unchanged.
      </span>
    </div>
  );
}
