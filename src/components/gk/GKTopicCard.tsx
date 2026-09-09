"use client";

import React from "react";
import Link from "next/link";
import { GKTopicSummary } from "@/data/gk/gk-types";
import {
  BookOpen,
  Shield,
  Compass,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  Trees,
  BookmarkCheck,
  Globe,
  Trophy,
  Landmark,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";

interface GKTopicCardProps {
  topic: GKTopicSummary;
}

function getTopicIcon(iconName: string, size = 20) {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen size={size} />;
    case "Shield":
      return <Shield size={size} />;
    case "Compass":
      return <Compass size={size} />;
    case "TrendingUp":
      return <TrendingUp size={size} />;
    case "Zap":
      return <Zap size={size} />;
    case "Award":
      return <Award size={size} />;
    case "Calendar":
      return <Calendar size={size} />;
    case "Trees":
      return <Trees size={size} />;
    case "BookmarkCheck":
      return <BookmarkCheck size={size} />;
    case "Trophy":
      return <Trophy size={size} />;
    case "Landmark":
      return <Landmark size={size} />;
    case "Globe":
    default:
      return <Globe size={size} />;
  }
}

export function GKTopicCard({ topic }: GKTopicCardProps) {
  const isNational = topic.gkCategory === "national";

  return (
    <Link
      href={`/gk/topics/${topic.id}`}
      className="rm-card rm-card-interactive"
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "var(--space-4)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
      }}
    >
      <div>
        {/* Header Icon + Category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-primary-subtle)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getTopicIcon(topic.iconName, 22)}
          </div>

          <span
            className="tag"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: isNational ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)",
              color: isNational ? "#059669" : "#4f46e5",
              borderColor: isNational ? "rgba(16, 185, 129, 0.25)" : "rgba(99, 102, 241, 0.25)",
            }}
          >
            {isNational ? "Indian GK" : "World GK"}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "var(--space-2)",
            letterSpacing: "-0.01em",
          }}
        >
          {topic.name}
        </h3>

        {/* Summary */}
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.45,
            marginBottom: "var(--space-4)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {topic.summary}
        </p>
      </div>

      {/* Footer Metrics */}
      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          paddingTop: "var(--space-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Layers size={13} /> {topic.subtopicCount} Subtopics
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <HelpCircle size={13} /> {topic.questionCount} MCQs
          </span>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--color-primary)",
            fontWeight: 600,
          }}
        >
          Learn <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
