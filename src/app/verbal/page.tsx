"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Search, Zap, Layers, Filter } from "lucide-react";
import { ContentService } from "@/lib/content/ContentService";
import { VERBAL_CLUSTERS } from "@/data/topic-groups";
import { TopicCard } from "@/components/topics/TopicCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { ASSETS } from "@/lib/assets/manifest";

export default function VerbalHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCluster, setActiveCluster] = useState<string>("all");

  const verbalTopics = useMemo(() => ContentService.getVerbalTopics(), []);

  const filteredTopics = useMemo(() => {
    let list = verbalTopics;
    if (activeCluster !== "all") {
      const cluster = VERBAL_CLUSTERS.find((c) => c.id === activeCluster);
      if (cluster) {
        list = list.filter((t) => cluster.topicIds.includes(t.id));
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.shortcutSummary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [verbalTopics, activeCluster, searchQuery]);

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-12)" }}>
      <Breadcrumb items={[{ label: "Verbal Reasoning" }]} />

      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--group-verbal-bg)",
                color: "var(--group-verbal-text)",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "var(--space-3)",
              }}
            >
              <BookOpen size={14} /> Verbal Reasoning Module
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "var(--space-2)" }}>
              Verbal Reasoning Hub
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "650px", fontSize: "1rem" }}>
              25 structured topics spanning Language Basics, Number & Letter Sequences, Relationship Puzzles,
              Deductive Logic, and Critical Analytical Reasoning.
            </p>
          </div>

          <Link href="/practice/configure?category=verbal" className="btn btn-primary btn-lg">
            <Zap size={18} /> Practice Verbal MCQs
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-6)",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "0.5rem 0.85rem",
            width: "100%",
            maxWidth: "360px",
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter 25 verbal topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--text-primary)",
              outline: "none",
              width: "100%",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Cluster Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          <button
            onClick={() => setActiveCluster("all")}
            className={`btn btn-sm ${activeCluster === "all" ? "btn-primary" : "btn-secondary"}`}
          >
            All (25)
          </button>
          {VERBAL_CLUSTERS.map((c) => {
            const isSelected = activeCluster === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCluster(c.id)}
                className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
              >
                {c.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Display by Clusters when "all" is active and no search query */}
      {activeCluster === "all" && !searchQuery.trim() ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
          {VERBAL_CLUSTERS.map((cluster) => {
            const clusterTopics = verbalTopics.filter((t) => cluster.topicIds.includes(t.id));
            if (clusterTopics.length === 0) return null;

            return (
              <section key={cluster.id}>
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                    <h2 style={{ fontSize: "1.35rem" }}>{cluster.title}</h2>
                    <span className="badge badge-primary">{clusterTopics.length} Topics</span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {cluster.description}
                  </p>
                </div>

                <div className="grid-cards">
                  {clusterTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Filtered Grid */
        <div>
          <div style={{ marginBottom: "var(--space-4)", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Showing {filteredTopics.length} topic{filteredTopics.length !== 1 ? "s" : ""}
          </div>

          {filteredTopics.length === 0 ? (
            <EmptyState
              asset={ASSETS.states.emptySearch}
              title="No Matching Topics Found"
              description={`No verbal reasoning topics found matching "${searchQuery}".`}
              actionText="Clear Filter"
              onAction={() => { setSearchQuery(""); setActiveCluster("all"); }}
            />
          ) : (
            <div className="grid-cards">
              {filteredTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
