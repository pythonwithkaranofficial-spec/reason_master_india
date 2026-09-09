import React from "react";
import { getTopicIconDef } from "@/lib/topics/topic-icons";

export interface TopicIconProps {
  topicId: string;
  category?: "verbal" | "nonverbal";
  size?: number;
  badgeSize?: number;
  variant?: "badge" | "inline" | "plain";
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export function TopicIcon({
  topicId,
  category,
  size = 18,
  badgeSize,
  variant = "badge",
  className = "",
  style = {},
  title,
}: TopicIconProps) {
  const def = getTopicIconDef(topicId, category);
  const IconComponent = def.icon;
  const isVerbal = (category || def.category) === "verbal";

  if (variant === "plain") {
    return (
      <IconComponent
        size={size}
        className={className}
        style={style}
        aria-hidden="true"
      />
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={className}
        title={title || def.label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: isVerbal ? "var(--group-verbal-text)" : "var(--group-nonverbal-text)",
          flexShrink: 0,
          ...style,
        }}
      >
        <IconComponent size={size} aria-hidden="true" />
      </span>
    );
  }

  // "badge" variant (Default)
  const computedBadgeSize = badgeSize || (size >= 24 ? size + 16 : 36);

  return (
    <div
      className={className}
      title={title || def.label}
      style={{
        width: `${computedBadgeSize}px`,
        height: `${computedBadgeSize}px`,
        minWidth: `${computedBadgeSize}px`,
        borderRadius: "var(--radius-md)",
        backgroundColor: isVerbal ? "var(--group-verbal-bg)" : "var(--group-nonverbal-bg)",
        border: `1px solid ${isVerbal ? "var(--group-verbal-border)" : "var(--group-nonverbal-border)"}`,
        color: isVerbal ? "var(--group-verbal-text)" : "var(--group-nonverbal-text)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <IconComponent size={size} aria-hidden="true" />
    </div>
  );
}
