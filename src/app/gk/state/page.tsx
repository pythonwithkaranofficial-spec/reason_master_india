"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_STATES_SUMMARY } from "@/data/gk/state-gk-index";
import { StateCard } from "@/components/gk/StateCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MapPin, Search, ShieldCheck, Building2, Filter, Sparkles } from "lucide-react";

export default function StateGKHubPage() {
  const [filterType, setFilterType] = useState<"all" | "state" | "ut">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = useMemo(() => {
    return ALL_STATES_SUMMARY.filter((s) => {
      if (filterType !== "all" && s.type !== filterType) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.capital.toLowerCase().includes(q) ||
        (s.chiefMinister && s.chiefMinister.toLowerCase().includes(q)) ||
        s.governorOrLtGovernor.toLowerCase().includes(q) ||
        s.officialLanguages.some((lang) => lang.toLowerCase().includes(q))
      );
    });
  }, [filterType, searchQuery]);

  const stateCount = ALL_STATES_SUMMARY.filter((s) => s.type === "state").length;
  const utCount = ALL_STATES_SUMMARY.filter((s) => s.type === "ut").length;

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* Breadcrumb & Header Banner */}
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
              { label: "States & UTs" },
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
                color: "var(--color-primary)",
                backgroundColor: "var(--color-primary-subtle)",
                padding: "3px 10px",
                borderRadius: "9999px",
                marginBottom: "var(--space-2)",
                border: "1px solid var(--border-color)",
              }}
            >
              <MapPin size={13} />
              <span>36 Administrative Units</span>
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
              India&apos;s States &amp; Union Territories
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Comprehensive, authentic repository for all 28 States and 8 Union Territories. Each state profile includes 6 standardized subtopics with verified officeholders and exam practice MCQs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--space-6) var(--space-4) 0" }}>
        {/* Controls Bar: Search & Type Filter Tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            marginBottom: "var(--space-6)",
            backgroundColor: "var(--bg-surface)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
          }}
        >
          {/* Search Input */}
          <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "450px" }}>
            <Search
              size={18}
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
              placeholder="Search state, capital, CM, governor, language..."
              style={{
                width: "100%",
                padding: "0.6rem 0.85rem 0.6rem 2.4rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setFilterType("all")}
              style={{
                padding: "0.45rem 0.95rem",
                borderRadius: "9999px",
                border: filterType === "all" ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                backgroundColor: filterType === "all" ? "var(--color-primary)" : "var(--color-primary-subtle)",
                color: filterType === "all" ? "#ffffff" : "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: filterType === "all" ? 600 : 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              All (36)
            </button>

            <button
              type="button"
              onClick={() => setFilterType("state")}
              style={{
                padding: "0.45rem 0.95rem",
                borderRadius: "9999px",
                border: filterType === "state" ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                backgroundColor: filterType === "state" ? "var(--color-primary)" : "var(--color-primary-subtle)",
                color: filterType === "state" ? "#ffffff" : "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: filterType === "state" ? 600 : 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              28 States ({stateCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterType("ut")}
              style={{
                padding: "0.45rem 0.95rem",
                borderRadius: "9999px",
                border: filterType === "ut" ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                backgroundColor: filterType === "ut" ? "var(--color-primary)" : "var(--color-primary-subtle)",
                color: filterType === "ut" ? "#ffffff" : "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: filterType === "ut" ? 600 : 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              8 Union Territories ({utCount})
            </button>
          </div>
        </div>

        {/* States Grid */}
        {filteredStates.length === 0 ? (
          <div
            style={{
              padding: "var(--space-12)",
              textAlign: "center",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)" }}>
              No state or UT matched your query &ldquo;{searchQuery}&rdquo;.
            </p>
            <p style={{ fontSize: "0.9rem" }}>Clear the search query or reset the filter to view all entities.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredStates.map((state) => (
              <StateCard key={state.id} state={state} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
