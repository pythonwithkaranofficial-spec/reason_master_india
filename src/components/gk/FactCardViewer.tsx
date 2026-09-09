"use client";

import React, { useState } from "react";
import { GKFact, GKSubtopic } from "@/data/gk/gk-types";
import { ShieldCheck, Search, Tag, Sparkles, BookOpen, Filter } from "lucide-react";

interface FactCardViewerProps {
  subtopics: GKSubtopic[];
  initialSubtopicId?: string;
}

export function FactCardViewer({ subtopics, initialSubtopicId }: FactCardViewerProps) {
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>(
    initialSubtopicId || (subtopics.length > 0 ? subtopics[0].id : "")
  );
  const [searchQuery, setSearchQuery] = useState("");

  const activeSubtopic = subtopics.find((s) => s.id === selectedSubtopicId) || subtopics[0];

  // Filter facts based on search query
  const allFacts: { fact: GKFact; subtopicName: string }[] = subtopics.flatMap((st) =>
    st.facts.map((f) => ({ fact: f, subtopicName: st.name }))
  );

  const displayFacts = searchQuery.trim()
    ? allFacts.filter(
        ({ fact, subtopicName }) =>
          fact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fact.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subtopicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fact.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : activeSubtopic?.facts.map((f) => ({ fact: f, subtopicName: activeSubtopic.name })) || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Search & Filter Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          backgroundColor: "var(--bg-surface)",
          padding: "var(--space-3)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: "relative",
            flex: "1 1 280px",
            maxWidth: "450px",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search high-yield facts, keywords, dates..."
            style={{
              width: "100%",
              padding: "0.55rem 0.85rem 0.55rem 2.25rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
              color: "var(--text-primary)",
              fontSize: "0.88rem",
            }}
          />
        </div>

        {/* Fact count */}
        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          Showing <strong>{displayFacts.length}</strong> fact{displayFacts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Subtopic Filter Pills (if no active global search) */}
      {!searchQuery.trim() && subtopics.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {subtopics.map((st) => {
            const isSelected = st.id === selectedSubtopicId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedSubtopicId(st.id)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-primary-subtle)",
                  border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all var(--transition-fast)",
                }}
              >
                <BookOpen size={14} />
                <span>{st.name}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "var(--border-color)",
                    borderRadius: "9999px",
                    padding: "1px 6px",
                    fontSize: "0.72rem",
                  }}
                >
                  {st.facts.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Facts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {displayFacts.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "var(--space-8)",
              textAlign: "center",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "1rem", marginBottom: "var(--space-2)" }}>No facts found matching &ldquo;{searchQuery}&rdquo;</p>
            <p style={{ fontSize: "0.85rem" }}>Try searching with a different term or clear the search filter.</p>
          </div>
        ) : (
          displayFacts.map(({ fact, subtopicName }) => (
            <div
              key={fact.id}
              className="rm-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                {/* Header: Subtopic name & verification badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <span
                    className="tag"
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      backgroundColor: "var(--color-primary-subtle)",
                      color: "var(--color-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {subtopicName}
                  </span>

                  {fact.lastVerified && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#059669",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        padding: "2px 6px",
                        borderRadius: "var(--radius-sm)",
                      }}
                      title="Fact verified with current government gazette & census"
                    >
                      <ShieldCheck size={12} />
                      As of {fact.lastVerified}
                    </span>
                  )}
                </div>

                {/* Fact Title */}
                <h4
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "var(--space-2)",
                    lineHeight: 1.35,
                  }}
                >
                  {fact.title}
                </h4>

                {/* Fact Content */}
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.55,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {fact.content}
                </p>
              </div>

              {/* Tags */}
              {fact.tags && fact.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginTop: "var(--space-2)",
                    paddingTop: "var(--space-2)",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  {fact.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        backgroundColor: "var(--bg-surface-elevated, var(--border-color))",
                        padding: "1px 6px",
                        borderRadius: "var(--radius-sm)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
