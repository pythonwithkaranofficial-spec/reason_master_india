"use client";

import React from "react";
import Link from "next/link";
import { StateSummaryItem } from "@/data/gk/state-gk-index";
import { MapPin, Building2, User, Award, ShieldCheck, ArrowRight, BookOpen } from "lucide-react";

interface StateCardProps {
  state: StateSummaryItem;
}

export function StateCard({ state }: StateCardProps) {
  const isUT = state.type === "ut";

  return (
    <Link
      href={`/gk/state/${state.id}`}
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
        {/* Top Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
            gap: "var(--space-2)",
          }}
        >
          <span
            className="tag"
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: isUT ? "rgba(245, 158, 11, 0.12)" : "var(--color-primary-subtle)",
              color: isUT ? "#d97706" : "var(--color-primary)",
              borderColor: isUT ? "rgba(245, 158, 11, 0.25)" : "var(--border-color)",
            }}
          >
            {isUT ? "Union Territory" : "State"}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            <ShieldCheck size={12} style={{ color: "var(--color-success, #10b981)" }} />
            As of {state.lastVerified.split("-")[0]}
          </span>
        </div>

        {/* State Name */}
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "var(--space-2)",
            letterSpacing: "-0.01em",
          }}
        >
          {state.name}
        </h3>

        {/* Key Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-2)",
            marginBottom: "var(--space-3)",
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Building2 size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <strong>Capital:</strong> {state.capital}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
            <span>
              <strong>Districts:</strong> {state.districtsCount}
            </span>
          </div>
        </div>

        {/* Leadership (CM or Governor) */}
        <div
          style={{
            backgroundColor: "var(--color-primary-subtle)",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.78rem",
            marginBottom: "var(--space-3)",
            border: "1px solid var(--border-color)",
          }}
        >
          {state.chiefMinister ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
              <User size={13} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <strong>CM:</strong> {state.chiefMinister}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
              <Award size={13} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <strong>{state.governorTitle}:</strong> {state.governorOrLtGovernor}
              </span>
            </div>
          )}
        </div>

        {/* Summary Snippet */}
        <p
          style={{
            fontSize: "0.83rem",
            color: "var(--text-muted)",
            lineHeight: 1.45,
            marginBottom: "var(--space-3)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {state.summary}
        </p>
      </div>

      {/* Footer Meta */}
      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          paddingTop: "var(--space-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <BookOpen size={13} /> {state.subtopicCount} Subtopics • {state.mcqCount} MCQs
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--color-primary)",
            fontWeight: 600,
          }}
        >
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
