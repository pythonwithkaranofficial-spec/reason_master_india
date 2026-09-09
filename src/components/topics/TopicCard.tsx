import React from "react";
import Link from "next/link";
import { TopicSummary } from "@/data/topics-index";
import { ArrowRight, Lightbulb, HelpCircle, Layers } from "lucide-react";
import { TopicIcon } from "@/components/topics/TopicIcon";

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
          <TopicIcon topicId={topic.id} category={topic.category} size={18} badgeSize={36} variant="badge" />

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
