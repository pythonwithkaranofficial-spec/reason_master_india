import React from "react";
import Link from "next/link";
import { TopicSummary } from "@/data/topics-index";
import { BookOpen, Eye, ArrowRight, Lightbulb, HelpCircle, Layers } from "lucide-react";

interface TopicCardProps {
  topic: TopicSummary;
}

export function TopicCard({ topic }: TopicCardProps) {
  const isVerbal = topic.category === "verbal";

  return (
    <Link
      href={`/topics/${topic.id}`}
      className="rm-card rm-card-interactive"
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
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
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              backgroundColor: isVerbal ? "var(--group-verbal-bg)" : "var(--group-nonverbal-bg)",
              color: isVerbal ? "var(--group-verbal-text)" : "var(--group-nonverbal-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isVerbal ? <BookOpen size={18} /> : <Eye size={18} />}
          </div>

          <span className="tag" style={{ fontSize: "0.75rem" }}>
            <Layers size={12} /> {topic.subtopicCount} Subtopic{topic.subtopicCount > 1 ? "s" : ""}
          </span>
        </div>

        <h3 style={{ fontSize: "1.15rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
          {topic.name}
        </h3>

        {topic.shortcutSummary && (
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
            {topic.shortcutSummary}
          </p>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          paddingTop: "var(--space-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <span>{topic.exampleCount} Examples</span>
          <span>•</span>
          <span>{topic.practiceCount} Practice Qs</span>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
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
