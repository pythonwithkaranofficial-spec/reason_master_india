import React from "react";

export type DifficultyLevel = "easy" | "medium" | "hard" | "mixed";

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel | string;
  className?: string;
  size?: "sm" | "md";
}

export function DifficultyBadge({ difficulty, className = "", size = "md" }: DifficultyBadgeProps) {
  const norm = (difficulty || "").toLowerCase() as DifficultyLevel;

  let label = "Medium";
  let badgeClass = "badge-medium";

  switch (norm) {
    case "easy":
      label = "Easy";
      badgeClass = "badge-easy";
      break;
    case "hard":
      label = "Hard";
      badgeClass = "badge-hard";
      break;
    case "mixed":
      label = "Mixed";
      badgeClass = "badge-primary";
      break;
    case "medium":
    default:
      label = "Medium";
      badgeClass = "badge-medium";
      break;
  }

  const sizeStyle = size === "sm" ? { fontSize: "0.7rem", padding: "0.15rem 0.5rem" } : {};

  return (
    <span className={`badge ${badgeClass} ${className}`} style={sizeStyle}>
      {label}
    </span>
  );
}
