import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ALL_NATIONAL_TOPICS_SUMMARY } from "@/data/gk/national-gk-index";
import { GKTopicCard } from "@/components/gk/GKTopicCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Landmark, BookOpen, Layers, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Indian GK (11 Topics) — History, Polity, Geography, Economy & Science | ReasonMaster India",
  description:
    "Master Indian General Knowledge with authoritative topics: Indian History, Polity & Constitution, Indian Geography, Economy, Science & Tech, Sports, Books & Authors, Awards, and National Parks.",
};

export default function NationalGKHubPage() {
  const totalSubtopics = ALL_NATIONAL_TOPICS_SUMMARY.reduce((acc, t) => acc + t.subtopicCount, 0);
  const totalMCQs = ALL_NATIONAL_TOPICS_SUMMARY.reduce((acc, t) => acc + t.questionCount, 0);

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
              { label: "Indian GK" },
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
                color: "#059669",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                padding: "3px 10px",
                borderRadius: "9999px",
                marginBottom: "var(--space-2)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
              }}
            >
              <Landmark size={13} />
              <span>National Knowledge Base</span>
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
              Indian General Knowledge (11 Core Disciplines)
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              In-depth coverage of India&apos;s history, constitution, geography, economy, science milestones, and culture. Every discipline is structured with subtopics, high-yield fact cards, and practice questions.
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
                <strong>11</strong> Topics
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
          {ALL_NATIONAL_TOPICS_SUMMARY.map((topic) => (
            <GKTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
