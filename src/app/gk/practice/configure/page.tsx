"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_STATES_SUMMARY } from "@/data/gk/state-gk-index";
import { ALL_NATIONAL_TOPICS_SUMMARY } from "@/data/gk/national-gk-index";
import { ALL_WORLD_TOPICS_SUMMARY } from "@/data/gk/world-gk-index";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GKStorageService } from "@/lib/gk/GKStorageService";
import {
  Sliders,
  MapPin,
  Landmark,
  Globe,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Languages,
} from "lucide-react";

export default function GKPracticeConfigurePage() {
  const router = useRouter();

  const [category, setCategory] = useState<"all" | "state" | "national" | "world">("all");
  const [selectedStateId, setSelectedStateId] = useState<string>("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<"mixed" | "easy" | "medium" | "hard">("mixed");
  const [mode, setMode] = useState<"instant" | "review">("instant");
  const [quizLanguage, setQuizLanguage] = useState<"en" | "hi">(() => {
    if (typeof window !== "undefined") {
      return GKStorageService.getSettings().quizLanguage || "en";
    }
    return "en";
  });

  const handleLaunch = () => {
    const params = new URLSearchParams();
    params.set("category", category);

    if (category === "state" && selectedStateId !== "all") {
      params.set("stateId", selectedStateId);
    } else if ((category === "national" || category === "world") && selectedTopicId !== "all") {
      params.set("topicId", selectedTopicId);
    }

    params.set("count", questionCount.toString());
    params.set("difficulty", difficulty);
    params.set("mode", mode);
    params.set("lang", quizLanguage);

    router.push(`/gk/practice/session?${params.toString()}`);
  };

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
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <Breadcrumb
            items={[
              { label: "GK Hub", href: "/gk" },
              { label: "Practice Arena", href: "/gk/practice" },
              { label: "Configure Test" },
            ]}
          />

          <div style={{ marginTop: "var(--space-4)" }}>
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
              <Sliders size={13} />
              <span>Custom Builder</span>
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
              Configure Custom GK Practice Test
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Customize question counts, target specific state/national topics, choose difficulty, and test yourself with instant feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--space-8) var(--space-4) 0" }}>
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          {/* 1. Category Selection */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              1. Select Domain / GK Pillar
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              {[
                { id: "all", label: "All GK Domains", icon: Sparkles, color: "var(--color-primary)" },
                { id: "state", label: "State GK (36 States & UTs)", icon: MapPin, color: "#d97706" },
                { id: "national", label: "Indian GK (11 Topics)", icon: Landmark, color: "#059669" },
                { id: "world", label: "World GK (6 Topics)", icon: Globe, color: "#4f46e5" },
              ].map((opt) => {
                const isSelected = category === opt.id;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCategory(opt.id as any);
                      setSelectedStateId("all");
                      setSelectedTopicId("all");
                    }}
                    style={{
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-lg)",
                      border: isSelected ? `2px solid ${opt.color}` : "1px solid var(--border-color)",
                      backgroundColor: isSelected ? "var(--color-primary-subtle)" : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "var(--space-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <Icon size={20} style={{ color: opt.color }} />
                    <span style={{ fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500, color: "var(--text-primary)" }}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Specific Entity Filter (Conditional) */}
          {category === "state" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Select Specific State / UT (Optional)
              </label>

              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                }}
              >
                <option value="all">All States &amp; UTs (Mixed)</option>
                {ALL_STATES_SUMMARY.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.type === "ut" ? "UT" : "State"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {category === "national" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Select Specific Indian GK Topic (Optional)
              </label>

              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                }}
              >
                <option value="all">All Indian GK Topics (Mixed)</option>
                {ALL_NATIONAL_TOPICS_SUMMARY.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {category === "world" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Select Specific World GK Topic (Optional)
              </label>

              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                }}
              >
                <option value="all">All World GK Topics (Mixed)</option>
                {ALL_WORLD_TOPICS_SUMMARY.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Question Count Selection */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              2. Number of Questions
            </label>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              {[10, 15, 20, 25, 30, 50].map((cnt) => {
                const isSelected = questionCount === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    style={{
                      padding: "0.55rem 1.15rem",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                      backgroundColor: isSelected ? "var(--color-primary-subtle)" : "transparent",
                      color: isSelected ? "var(--color-primary)" : "var(--text-primary)",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {cnt} Questions
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Quiz Language Selection */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              <Languages size={18} style={{ color: "var(--color-primary)" }} />
              <span>3. Quiz Language (प्रश्नोत्तरी की भाषा)</span>
            </label>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              {[
                { id: "en", label: "English", desc: "Questions & options in English" },
                { id: "hi", label: "हिन्दी (Hindi)", desc: "प्रश्न एवं विकल्प शुद्ध हिन्दी में" },
              ].map((langItem) => {
                const isSelected = quizLanguage === langItem.id;
                return (
                  <button
                    key={langItem.id}
                    type="button"
                    onClick={() => {
                      setQuizLanguage(langItem.id as any);
                      GKStorageService.saveSettings({ quizLanguage: langItem.id as any });
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "var(--radius-md)",
                      border: isSelected
                        ? "2px solid var(--color-primary)"
                        : "1px solid var(--border-color)",
                      backgroundColor: isSelected
                        ? "var(--color-primary-subtle)"
                        : "transparent",
                      color: isSelected ? "var(--color-primary)" : "var(--text-primary)",
                      cursor: "pointer",
                      textAlign: "left",
                      minWidth: "160px",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{langItem.label}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {langItem.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Difficulty Level */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              4. Difficulty Level
            </label>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              {[
                { id: "mixed", label: "Mixed / All Levels" },
                { id: "easy", label: "Easy" },
                { id: "medium", label: "Medium" },
                { id: "hard", label: "Hard" },
              ].map((lvl) => {
                const isSelected = difficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id as any)}
                    style={{
                      padding: "0.55rem 1.15rem",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                      backgroundColor: isSelected ? "var(--color-primary-subtle)" : "transparent",
                      color: isSelected ? "var(--color-primary)" : "var(--text-primary)",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Mode Selection */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              4. Practice Experience Mode
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              <button
                type="button"
                onClick={() => setMode("instant")}
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  border: mode === "instant" ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                  backgroundColor: mode === "instant" ? "var(--color-primary-subtle)" : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Instant Feedback Mode
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  See correct answer, score, and in-depth explanation immediately after choosing each option. Ideal for learning.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("review")}
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  border: mode === "review" ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                  backgroundColor: mode === "review" ? "var(--color-primary-subtle)" : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Full Exam / Review Mode
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Timed exam simulator with palette navigation and final score breakdown after submission. Ideal for mock tests.
                </div>
              </button>
            </div>
          </div>

          {/* Launch Button */}
          <div style={{ paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-color)" }}>
            <button
              type="button"
              onClick={handleLaunch}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.8rem 1.5rem",
                fontSize: "1.05rem",
                fontWeight: 700,
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Zap size={18} /> Launch Practice Test ({questionCount} Questions)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
