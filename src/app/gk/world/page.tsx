import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ALL_WORLD_TOPICS_SUMMARY } from "@/data/gk/world-gk-index";
import { GKTopicCard } from "@/components/gk/GKTopicCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Globe, BookOpen, Layers, HelpCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "World GK (6 Topics) — World Geography, Countries, Currencies & UN Organizations | ReasonMaster India",
  description:
    "Authoritative World General Knowledge covering World Geography, Global Countries, Capitals, Currencies, International Organizations (UN, IMF, World Bank, WTO), and Global Sports.",
};

export default function WorldGKHubPage() {
  const totalSubtopics = ALL_WORLD_TOPICS_SUMMARY.reduce((acc, t) => acc + t.subtopicCount, 0);
  const totalMCQs = ALL_WORLD_TOPICS_SUMMARY.reduce((acc, t) => acc + t.questionCount, 0);

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* Header Banner */}
      <section
        style={{
          padding: "var(--space-6) 0 var(--space-6)",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <Breadcrumb
            items={[
              { label: "GK Hub", href: "/gk" },
              { label: "World GK" },
            ]}
          />

          <div style={{ marginTop: "var(--space-4)", maxWidth: "800px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#4f46e5",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                padding: "3px 10px",
                borderRadius: "9999px",
                marginBottom: "var(--space-2)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
              }}
            >
              <Globe size={13} />
              <span>International Knowledge Base</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "var(--space-2)",
              }}
            >
              World General Knowledge (6 Essential Modules)
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Master international relations, global geography, strategic straits, capitals & currencies, and United Nations specialized agencies required for UPSC, SSC, and central government exams.
            </p>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-4)",
                marginTop: "var(--space-4)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <BookOpen size={15} style={{ color: "var(--color-primary)" }} />
                <strong>6</strong> Global Topics
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Layers size={15} style={{ color: "#10b981" }} />
                <strong>{totalSubtopics}</strong> Subtopics
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <HelpCircle size={15} style={{ color: "#f59e0b" }} />
                <strong>{totalMCQs}</strong> High-Yield MCQs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--space-6) var(--space-4) 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {ALL_WORLD_TOPICS_SUMMARY.map((topic) => (
            <GKTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
