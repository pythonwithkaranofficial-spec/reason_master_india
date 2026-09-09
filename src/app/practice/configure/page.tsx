"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ALL_TOPICS_SUMMARY } from "@/data/topics-index";
import { EXAM_CATEGORIES } from "@/data/categories";
import { ContentService } from "@/lib/content/ContentService";
import { Exam } from "@/types/models";
import { Sliders, Zap, Check, HelpCircle, Layers, Award } from "lucide-react";
import { useUserSettings } from "@/lib/settings/SettingsProvider";

function ConfigureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings, isLoaded } = useUserSettings();

  const queryCount = searchParams.get("count");
  const queryMode = searchParams.get("mode");

  const [scopeType, setScopeType] = useState<"all" | "verbal" | "nonverbal" | "topic" | "exam">(
    (searchParams.get("category") as any) || "all"
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    searchParams.get("topicIds") ? searchParams.get("topicIds")!.split(",") : []
  );
  const [selectedExamId, setSelectedExamId] = useState<string>(searchParams.get("examId") || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [questionCount, setQuestionCount] = useState<10 | 20 | 30>(
    queryCount ? (Number(queryCount) as 10 | 20 | 30) : 20
  );
  const [mode, setMode] = useState<"instant" | "review">(
    (queryMode as "instant" | "review") || "instant"
  );

  useEffect(() => {
    if (isLoaded && !queryCount) {
      setQuestionCount(settings.defaultQuestionCount);
    }
  }, [isLoaded, settings.defaultQuestionCount, queryCount]);

  useEffect(() => {
    if (isLoaded && !queryMode) {
      setMode(settings.instantFeedback ? "instant" : "review");
    }
  }, [isLoaded, settings.instantFeedback, queryMode]);

  const [examsList, setExamsList] = useState<Exam[]>([]);

  useEffect(() => {
    async function loadExams() {
      const exams = await ContentService.getAllExams();
      setExamsList(exams);
    }
    loadExams();
  }, []);

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleStartSession = () => {
    const params = new URLSearchParams();
    params.set("count", questionCount.toString());
    params.set("difficulty", difficulty);
    params.set("mode", mode);

    if (scopeType === "verbal") {
      params.set("category", "verbal");
    } else if (scopeType === "nonverbal") {
      params.set("category", "nonverbal");
    } else if (scopeType === "topic" && selectedTopics.length > 0) {
      params.set("topicIds", selectedTopics.join(","));
    } else if (scopeType === "exam" && selectedExamId) {
      params.set("examId", selectedExamId);
    }

    router.push(`/practice/session?${params.toString()}`);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)", maxWidth: "840px" }}>
      <Breadcrumb
        items={[
          { label: "Practice Arena", href: "/practice" },
          { label: "Configure Session" },
        ]}
      />

      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          <Sliders size={20} color="var(--color-primary)" />
          <h1 style={{ fontSize: "1.8rem" }}>Session Builder Wizard</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Customize the scope, difficulty curve, and feedback mode of your practice session.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* Step 1: Scope Selection */}
        <section className="rm-card">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-4)" }}>
            1. Select Practice Scope
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "var(--space-3)",
              marginBottom: "var(--space-6)",
            }}
          >
            {[
              { id: "all", label: "All 39 Topics", desc: "Verbal & Non-Verbal" },
              { id: "verbal", label: "Verbal Only", desc: "25 Verbal Topics" },
              { id: "nonverbal", label: "Non-Verbal Only", desc: "14 Spatial Topics" },
              { id: "topic", label: "Specific Topics", desc: "Choose Topics" },
              { id: "exam", label: "By Exam Target", desc: "64 Exam Profiles" },
            ].map((scope) => {
              const isSelected = scopeType === scope.id;
              return (
                <div
                  key={scope.id}
                  onClick={() => setScopeType(scope.id as any)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)", marginBottom: "2px" }}>
                    {scope.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {scope.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conditional Sub-selector for Topic Multi-Select */}
          {scopeType === "topic" && (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  Select Topic(s) ({selectedTopics.length} selected):
                </span>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button
                    onClick={() => setSelectedTopics(ALL_TOPICS_SUMMARY.map((t) => t.id))}
                    className="btn btn-subtle btn-sm"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedTopics([])}
                    className="btn btn-subtle btn-sm"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "var(--space-2)",
                  maxHeight: "260px",
                  overflowY: "auto",
                  padding: "var(--space-2)",
                  backgroundColor: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {ALL_TOPICS_SUMMARY.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTopic(topic.id)}
                      style={{
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: isChecked ? "var(--color-primary)" : "var(--bg-surface)",
                        color: isChecked ? "#ffffff" : "var(--text-primary)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{topic.name}</span>
                      {isChecked && <Check size={14} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conditional Sub-selector for Exam */}
          {scopeType === "exam" && (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>
                Choose Target Exam:
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                }}
              >
                <option value="">-- Choose from 64 Exam Profiles --</option>
                {examsList.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} ({exam.shortName})
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* Step 2: Difficulty Distribution */}
        <section className="rm-card">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-4)" }}>
            2. Difficulty Distribution
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-3)" }}>
            {[
              { id: "mixed", label: "Mixed (Recommended)", desc: "25% Easy • 50% Medium • 25% Hard" },
              { id: "easy", label: "Easy", desc: "Fundamental drills" },
              { id: "medium", label: "Medium", desc: "Standard exam level" },
              { id: "hard", label: "Hard", desc: "Advanced & tricky questions" },
            ].map((d) => {
              const isSelected = difficulty === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setDifficulty(d.id as any)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)", marginBottom: "2px" }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {d.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Question Count */}
        <section className="rm-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>
              3. Number of Questions
            </h3>
            {isLoaded && (
              <span className="tag" style={{ fontSize: "0.75rem" }}>
                Default: {settings.defaultQuestionCount} Qs
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
            Select session length or customize your default in Settings.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
            {[
              { count: 10, label: "10 Questions", desc: "Rapid Drill (~8 mins)" },
              { count: 20, label: "20 Questions", desc: "Standard Practice (~15 mins)" },
              { count: 30, label: "30 Questions", desc: "Full Sectional Mock (~25 mins)" },
            ].map((q) => {
              const cnt = q.count as 10 | 20 | 30;
              const isSelected = questionCount === cnt;
              const isDefault = isLoaded && settings.defaultQuestionCount === cnt;

              return (
                <div
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all var(--transition-fast)",
                    position: "relative",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)", marginBottom: "2px" }}>
                    {q.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {q.desc}
                  </div>
                  {isDefault && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "var(--space-2)",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "var(--color-accent)",
                        backgroundColor: "var(--color-accent-subtle)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      ★ Saved Default
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 4: Feedback Mode */}
        <section className="rm-card">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
            4. Feedback Mode
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
            Decide whether answers and solutions appear instantly or after test completion.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
            {[
              {
                id: "instant",
                label: "Instant Feedback",
                desc: "Check answers and step-by-step logic immediately after each question.",
              },
              {
                id: "review",
                label: "Review at End",
                desc: "Real exam simulation. Submit entire test first, then review solutions.",
              },
            ].map((m) => {
              const isSelected = mode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)", marginBottom: "4px" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {m.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Launch Action */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleStartSession}
            disabled={scopeType === "topic" && selectedTopics.length === 0}
            className="btn btn-primary btn-lg"
            style={{ padding: "0.85rem 3rem", fontSize: "1.1rem" }}
          >
            <Zap size={20} /> Launch Practice Session ({questionCount} Qs)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "var(--space-12) 0", textAlign: "center" }}>Loading wizard...</div>}>
      <ConfigureContent />
    </Suspense>
  );
}
