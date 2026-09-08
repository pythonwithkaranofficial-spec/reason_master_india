import React from "react";

interface AccuracyGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export function AccuracyGauge({
  percentage,
  size = 140,
  strokeWidth = 12,
}: AccuracyGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;

  let strokeColor = "var(--color-primary)";
  if (clamped >= 75) {
    strokeColor = "var(--color-success)";
  } else if (clamped >= 50) {
    strokeColor = "var(--color-warning)";
  } else {
    strokeColor = "var(--color-error)";
  }

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-subtle)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: size > 120 ? "2rem" : "1.4rem",
            fontWeight: 800,
            color: strokeColor,
            lineHeight: 1,
          }}
        >
          {clamped}%
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            textTransform: "uppercase",
            marginTop: "2px",
          }}
        >
          Accuracy
        </span>
      </div>
    </div>
  );
}
